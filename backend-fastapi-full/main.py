from fastapi import FastAPI, HTTPException, Depends, Query, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError
from bson import ObjectId
import bcrypt
from jose import jwt
import os
from datetime import datetime, timedelta, timezone
from typing import Optional, List
from dotenv import load_dotenv

# ==================== LOAD ENV ====================
load_dotenv()

# ==================== CONFIG ====================
MONGODB_URI = os.getenv("MONGODB_URI")
JWT_SECRET = os.getenv("JWT_SECRET")

if not MONGODB_URI or not JWT_SECRET:
    raise RuntimeError("Missing MONGODB_URI or JWT_SECRET in environment")

JWT_EXPIRE = 7

client = None
db = None

def get_db():
    global client, db
    if client is None:
        try:
            client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
            db = client['healmate']
        except Exception as e:
            raise Exception(f"MongoDB connection failed: {str(e)}")
    return db

# ==================== REQUEST/RESPONSE MODELS ====================
class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str
    fullName: str

class LoginRequest(BaseModel):
    email: str
    password: str

class ChatRequest(BaseModel):
    message: str

class MoodRequest(BaseModel):
    mood: str
    intensity: int

class UpdateChatRequest(BaseModel):
    aiResponse: Optional[str] = None
    emotion: Optional[str] = None

# ==================== FastAPI App ====================
app = FastAPI(title="HealMate API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== STARTUP EVENT (AFTER app defined) ====================
@app.on_event("startup")
async def startup_event():
    try:
        db = get_db()
        client.admin.command("ping")
        print("✅ MongoDB Connected Successfully")
    except Exception as e:
        print(f"❌ MongoDB Connection Error: {e}")

# ==================== ROOT ENDPOINT ====================
@app.get("/")
async def root():
    """Root endpoint untuk HF health check"""
    return {
        "status": "ok",
        "service": "HealMate FastAPI",
        "version": "1.0.0"
    }

# ==================== JWT HELPERS ====================
def create_token(user_id: str):
    """Generate JWT token"""
    payload = {
        "userId": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(days=JWT_EXPIRE)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

def verify_token(token: str):
    """Verify JWT token"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload.get("userId")
    except:
        return None

def get_current_user(authorization: Optional[str] = Header(None)):
    """Extract user_id dari Authorization header"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization token")
    
    try:
        token = authorization.replace("Bearer ", "")
        user_id = verify_token(token)
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid or expired token")
        return user_id
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

# ==================== HEALTH CHECK ====================
@app.get("/api/health")
async def health():
    return {
        "status": "ok", 
        "service": "fastapi-full",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

# ==================== AUTH ENDPOINTS ====================
@app.post("/api/auth/register")
async def register(req: RegisterRequest):
    """Register new user"""
    try:
        db = get_db()
        users = db['users']
        
        if users.find_one({"$or": [{"email": req.email}, {"username": req.username}]}):
            raise HTTPException(status_code=409, detail="Email or username already exists")
        
        hashed = bcrypt.hashpw(req.password.encode(), bcrypt.gensalt()).decode()
        
        user_doc = {
            "username": req.username,
            "email": req.email,
            "password": hashed,
            "fullName": req.fullName,
            "createdAt": datetime.now(timezone.utc),
            "lastLoginAt": None
        }
        result = users.insert_one(user_doc)
        
        token = create_token(str(result.inserted_id))
        
        return {
            "status": "success",
            "message": "User registered successfully",
            "token": token,
            "user": {
                "id": str(result.inserted_id),
                "email": req.email,
                "username": req.username,
                "fullName": req.fullName
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/auth/login")
async def login(req: LoginRequest):
    """Login user"""
    try:
        db = get_db()
        users = db['users']
        
        user = users.find_one({"email": req.email})
        if not user:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        if not bcrypt.checkpw(req.password.encode(), user['password'].encode()):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        users.update_one({"_id": user['_id']}, {"$set": {"lastLoginAt": datetime.now(timezone.utc)}})
        
        token = create_token(str(user['_id']))
        
        return {
            "status": "success",
            "message": "Login successful",
            "token": token,
            "user": {
                "id": str(user['_id']),
                "email": user['email'],
                "username": user['username'],
                "fullName": user.get('fullName', '')
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/auth/me")
async def get_me(user_id: str = Depends(get_current_user)):
    """Get current user info"""
    try:
        db = get_db()
        users = db['users']
        
        user = users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {
            "status": "success",
            "user": {
                "id": str(user['_id']),
                "email": user['email'],
                "username": user['username'],
                "fullName": user.get('fullName', ''),
                "createdAt": user.get('createdAt'),
                "lastLoginAt": user.get('lastLoginAt')
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==================== CHAT ENDPOINTS ====================
@app.post("/api/chat/send")
async def send_chat(req: ChatRequest, user_id: str = Depends(get_current_user)):
    """Send chat message"""
    try:
        db = get_db()
        chats = db['chats']
        
        if not req.message or not req.message.strip():
            raise HTTPException(status_code=400, detail="Message cannot be empty")
        
        chat_doc = {
            "userId": ObjectId(user_id),
            "userMessage": req.message,
            "aiResponse": "Thank you for sharing. I hear you. How can I support you today?",
            "emotion": "neutral",
            "createdAt": datetime.now(timezone.utc)
        }
        result = chats.insert_one(chat_doc)
        
        return {
            "status": "success",
            "message": "Message sent successfully",
            "chat": {
                "id": str(result.inserted_id),
                "userMessage": req.message,
                "aiResponse": chat_doc["aiResponse"],
                "emotion": "neutral",
                "createdAt": chat_doc["createdAt"]
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/chat/history")
async def get_chat_history(
    limit: int = Query(50, ge=1, le=100),
    page: int = Query(1, ge=1),
    user_id: str = Depends(get_current_user)
):
    """Get chat history with pagination"""
    try:
        db = get_db()
        chats = db['chats']
        
        skip = (page - 1) * limit
        
        user_chats = list(chats.find({"userId": ObjectId(user_id)})
                         .sort("createdAt", -1)
                         .skip(skip)
                         .limit(limit))
        
        total = chats.count_documents({"userId": ObjectId(user_id)})
        
        chats_list = [{
            "id": str(chat['_id']),
            "userMessage": chat['userMessage'],
            "aiResponse": chat.get('aiResponse', ''),
            "emotion": chat.get('emotion', 'neutral'),
            "createdAt": chat['createdAt']
        } for chat in user_chats]
        
        return {
            "status": "success",
            "chats": chats_list,
            "pagination": {
                "total": total,
                "page": page,
                "limit": limit,
                "pages": (total + limit - 1) // limit
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/chat/{chat_id}")
async def delete_chat(chat_id: str, user_id: str = Depends(get_current_user)):
    """Delete a chat"""
    try:
        db = get_db()
        chats = db['chats']
        
        result = chats.delete_one({"_id": ObjectId(chat_id), "userId": ObjectId(user_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Chat not found")
        
        return {"status": "success", "message": "Chat deleted"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==================== MOOD ENDPOINTS ====================
@app.post("/api/mood/record")
async def record_mood(req: MoodRequest, user_id: str = Depends(get_current_user)):
    """Record mood"""
    try:
        db = get_db()
        moods = db['moods']
        
        mood_doc = {
            "userId": ObjectId(user_id),
            "mood": req.mood,
            "intensity": req.intensity,
            "createdAt": datetime.now(timezone.utc)
        }
        result = moods.insert_one(mood_doc)
        
        return {
            "status": "success",
            "message": "Mood recorded",
            "moodId": str(result.inserted_id)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/mood/weekly")
async def get_weekly_moods(user_id: str = Depends(get_current_user)):
    """Get moods from last 7 days"""
    try:
        db = get_db()
        moods = db['moods']
        
        seven_days_ago = datetime.now(timezone.utc) - timedelta(days=7)
        
        user_moods = list(moods.find({
            "userId": ObjectId(user_id),
            "createdAt": {"$gte": seven_days_ago}
        }).sort("createdAt", -1))
        
        moods_list = [{
            "id": str(mood['_id']),
            "mood": mood['mood'],
            "intensity": mood.get('intensity', 0),
            "createdAt": mood['createdAt']
        } for mood in user_moods]
        
        return {
            "status": "success",
            "moods": moods_list,
            "count": len(moods_list)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/mood/stats")
async def get_mood_stats(user_id: str = Depends(get_current_user)):
    """Get mood statistics"""
    try:
        db = get_db()
        moods = db['moods']
        
        user_moods = list(moods.find({"userId": ObjectId(user_id)}))
        
        if not user_moods:
            return {
                "status": "success",
                "stats": {
                    "totalRecords": 0,
                    "averageIntensity": 0,
                    "moodBreakdown": {}
                }
            }
        
        total_intensity = sum(mood.get('intensity', 0) for mood in user_moods)
        avg_intensity = total_intensity / len(user_moods)
        
        mood_breakdown = {}
        for mood in user_moods:
            mood_name = mood['mood']
            mood_breakdown[mood_name] = mood_breakdown.get(mood_name, 0) + 1
        
        return {
            "status": "success",
            "stats": {
                "totalRecords": len(user_moods),
                "averageIntensity": round(avg_intensity, 2),
                "moodBreakdown": mood_breakdown
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))