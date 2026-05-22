import logging
import sys
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

# Import config dan models
from config import settings
from utils.ai_models import get_ai_manager

# ==================== SETUP LOGGING ====================
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ==================== FASTAPI SETUP ====================
app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="AI Backend untuk HealMate - Sentiment & Emotion Analysis"
)

# ==================== CORS MIDDLEWARE ====================
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== REQUEST MODELS ====================
class ChatRequest(BaseModel):
    """Request untuk chat analysis"""
    message: str
    userId: Optional[str] = None
    
    class Config:
        example = {
            "message": "Saya hari ini merasa sedih",
            "userId": "user123"
        }

class MoodAnalysisRequest(BaseModel):
    """Request untuk mood analysis"""
    text: str
    
    class Config:
        example = {"text": "Aku sangat happy hari ini!"}

class EmotionRequest(BaseModel):
    """Request untuk emotion detection"""
    text: str
    emotions: Optional[list] = None
    
    class Config:
        example = {
            "text": "Ini adalah hari yang menakjubkan",
            "emotions": ["happy", "sad", "anxious"]
        }

# ==================== HEALTH CHECK ====================
@app.get("/api/health")
async def health_check():
    """Check apakah FastAPI backend berjalan"""
    return {
        "status": "ok",
        "service": "FastAPI AI Backend",
        "environment": settings.ENVIRONMENT
    }

# ==================== AI ENDPOINTS ====================

@app.post("/api/ai/chat")
async def chat_analysis(request: ChatRequest):
    """
    Analisis sentiment dari chat message
    
    Contoh: User ketik "Saya sedih hari ini"
    Return: sentiment + emotion + recommendation
    """
    try:
        ai_manager = get_ai_manager()
        
        # Analisis sentiment
        sentiment_result = ai_manager.analyze_sentiment(request.message)
        
        # Analisis emotion
        emotion_result = ai_manager.analyze_emotion(request.message)
        
        # Generate recommendation
        recommendation = ai_manager.generate_recommendation(
            emotion_result.get('primary_emotion', 'calm'),
            sentiment_result.get('sentiment', 'neutral')
        )
        
        return {
            "status": "success",
            "userId": request.userId,
            "message": request.message,
            "sentiment": sentiment_result,
            "emotion": emotion_result,
            "recommendation": recommendation
        }
    
    except Exception as e:
        logger.error(f"Error in chat analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai/analyze-mood")
async def analyze_mood(request: MoodAnalysisRequest):
    """
    Analisis mood/emotion dari text
    
    Contoh: Untuk "Saya merasa sangat senang"
    Return: emotion dengan confidence score
    """
    try:
        ai_manager = get_ai_manager()
        
        # Predefined emotions untuk HealMate
        emotions = [
            "happy", "sad", "anxious", "calm", 
            "stressed", "excited", "lonely", "confident"
        ]
        
        result = ai_manager.analyze_emotion(request.text, emotions)
        
        return {
            "status": "success",
            "text": request.text,
            "analysis": result
        }
    
    except Exception as e:
        logger.error(f"Error in mood analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai/custom-emotion")
async def custom_emotion_detection(request: EmotionRequest):
    """
    Custom emotion detection dengan emotion list yang bisa di-customize
    
    Contoh: Analisis dengan emotion ["happy", "angry"] saja
    """
    try:
        ai_manager = get_ai_manager()
        
        # Gunakan custom emotions kalau dikirim, atau default
        emotions = request.emotions or [
            "happy", "sad", "anxious", "calm", "stressed"
        ]
        
        result = ai_manager.analyze_emotion(request.text, emotions)
        
        return {
            "status": "success",
            "text": request.text,
            "custom_emotions": emotions,
            "analysis": result
        }
    
    except Exception as e:
        logger.error(f"Error in custom emotion detection: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ==================== INFO ENDPOINT ====================
@app.get("/api/ai/info")
async def ai_info():
    """Info tentang available AI capabilities"""
    return {
        "status": "ready",
        "capabilities": [
            "sentiment_analysis",
            "emotion_detection",
            "mood_analysis",
            "recommendations"
        ],
        "models": [
            "distilbert-base-uncased (sentiment)",
            "facebook/bart-large-mnli (emotion)"
        ],
        "endpoints": [
            "/api/health",
            "/api/ai/chat",
            "/api/ai/analyze-mood",
            "/api/ai/custom-emotion",
            "/api/ai/info"
        ]
    }

# ==================== STARTUP & SHUTDOWN ====================
@app.on_event("startup")
async def startup_event():
    """Jalankan saat FastAPI start"""
    logger.info("🚀 FastAPI starting up...")
    try:
        ai_manager = get_ai_manager()
        logger.info("✅ AI Models loaded successfully")
    except Exception as e:
        logger.error(f"❌ Failed to load AI models: {e}")
        sys.exit(1)

@app.on_event("shutdown")
async def shutdown_event():
    """Jalankan saat FastAPI shutdown"""
    logger.info("👋 FastAPI shutting down...")

# ==================== ROOT ENDPOINT ====================
@app.get("/")
async def root():
    return {
        "message": "HealMate AI Backend API",
        "docs": "http://localhost:8000/docs",
        "status": "running"
    }

# ==================== RUN COMMAND ====================
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )