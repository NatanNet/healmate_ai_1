from database.mongodb import get_db
from middleware.auth import create_token
from bson import ObjectId
import bcrypt
from datetime import datetime, timezone
from fastapi import HTTPException


async def register_service(req):
    db = get_db()
    users = db["users"]

    existing = users.find_one({
        "$or": [
            {"email": req.email},
            {"username": req.username}
        ]
    })

    if existing:
        raise HTTPException(
            status_code=409,
            detail="User already exists"
        )

    hashed = bcrypt.hashpw(
        req.password.encode(),
        bcrypt.gensalt()
    ).decode()

    user_doc = {
        "username": req.username,
        "email": req.email,
        "password": hashed,
        "fullName": req.fullName,
        "createdAt": datetime.now(timezone.utc),
        "hasSetBaseline": False,
    }

    result = users.insert_one(user_doc)
    token = create_token(str(result.inserted_id))

    return {
        "status": "success",
        "token": token,
        "user_id": str(result.inserted_id)
    }


async def login_service(req):
    """Login user dan return JWT token"""
    db = get_db()
    users = db["users"]
    
    # Find user by email
    user = users.find_one({"email": req.email})
    
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not bcrypt.checkpw(req.password.encode(), user["password"].encode()):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )
    
    # Create JWT token
    token = create_token(str(user["_id"]))
    
    return {
        "status": "success",
        "token": token,
        "user_id": str(user["_id"]),
        "email": user["email"],
        "username": user.get("username", ""),
        "fullName": user.get("fullName", "")
    }


async def me_service(user_id: str):
    """Get current user info"""
    db = get_db()
    users = db["users"]
    
    try:
        user = users.find_one({"_id": ObjectId(user_id)})
        
        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )
        
        return {
            "user_id": str(user["_id"]),
            "email": user["email"],
            "username": user.get("username", ""),
            "fullName": user.get("fullName", ""),
            "createdAt": user.get("createdAt", ""),
            "healingBonus": user.get("healingBonus", 0.0),
            "hasSetBaseline": user.get("hasSetBaseline", False)
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


async def set_baseline_service(user_id: str, req):
    """Menyimpan fase awal user dan membuat chat bayangan untuk titik start UI"""
    db = get_db()
    users = db["users"]
    chats = db["chats"]
    
    # 1. Ubah status hasSetBaseline menjadi True agar pop-up tidak muncul lagi
    users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"hasSetBaseline": True}}
    )
    
    # 2. Buat "Chat Bayangan" untuk Baseline (DISAMAKAN 100% DENGAN CHAT_SERVICE)
    dummy_chat = {
        "userId": ObjectId(user_id), # SUDAH DIPERBAIKI (camelCase)
        "userMessage": f"Saya merasa sedang berada di fase: {req.phaseName}",
        "messageEN": "Initial baseline assessment", # Tambahan agar skema kembar
        "aiResponse": "Terima kasih sudah jujur dengan perasaanmu. Mari kita mulai proses pemulihan ini perlahan-lahan bersama HealMate.",
        # "emotion": "acceptance",
        # "confidence": 1.0,
        "intent": "baseline", # Tambahan agar skema kembar
        "healingScore": req.healingScore,
        "createdAt": datetime.utcnow() # SUDAH DIPERBAIKI (Pakai datetime object)
    }
    
    chats.insert_one(dummy_chat)
    
    return {
        "status": "success", 
        "message": "Titik mulai pemulihan berhasil diatur"
    }