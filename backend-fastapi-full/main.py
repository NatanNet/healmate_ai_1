"""
HealMate FastAPI Backend
Main application entry point
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from datetime import datetime, timezone

# Import konfigurasi
from config import APP_NAME, DEBUG, JWT_SECRET, MONGODB_URI

# Import database
from database.mongodb import get_db

# Import services
from services.ai_service import init_ai_service, shutdown_ai_service

# Import routes
from routes import auth, chat, mood, goals, timecapsule

# Import utils
from utils.helpers import format_response


# ==================== LIFESPAN EVENTS ====================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Manage application lifespan:
    - Startup: Initialize AI models dan database
    - Shutdown: Cleanup resources
    """
    # Startup
    print("🚀 Starting HealMate API...")
    try:
        get_db()
        print("✅ MongoDB Connected Successfully")
    except Exception as e:
        print(f"❌ MongoDB Connection Error: {e}")
    
    try:
        await init_ai_service()
        print("✅ AI Service Initialized")
    except Exception as e:
        print(f"⚠️ AI Service Warning: {e}")
    
    yield
    
    # Shutdown
    print("🛑 Shutting down HealMate API...")
    try:
        await shutdown_ai_service()
        print("✅ AI Service Shutdown")
    except Exception as e:
        print(f"⚠️ Shutdown Warning: {e}")


# ==================== FastAPI APP ====================

app = FastAPI(
    title=APP_NAME,
    description="HealMate AI Mental Health Support API",
    version="1.0.0",
    lifespan=lifespan
)

# ==================== CORS MIDDLEWARE ====================

app.add_middleware(
    CORSMiddleware,
    #allow_origins=["*"],  # TODO: Update untuk production
     allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:5173", "https://healmate-ai-1.vercel.app", "https://healmate-ai-1-3lhodu244-heal-mate-ai-s-projects.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== ROOT ENDPOINT ====================

@app.get("/")
async def root():
    """Root endpoint untuk health check"""
    return format_response(
        status="success",
        data={
            "service": APP_NAME,
            "version": "1.0.0",
            "status": "running"
        }
    )


@app.get("/api/health")
async def health():
    """Health check endpoint"""
    try:
        get_db()
        db_status = "healthy"
    except Exception:
        db_status = "unhealthy"
    
    return format_response(
        status="success",
        data={
            "service": APP_NAME,
            "database": db_status,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    )


@app.get("/api/info")
async def api_info():
    """Get API information"""
    return format_response(
        status="success",
        data={
            "name": APP_NAME,
            "version": "1.0.0",
            "debug": DEBUG,
            "endpoints": {
                "auth": "/api/auth",
                "chat": "/api/chat",
                "mood": "/api/mood",
                "goals": "/api/goals",
                "timecapsule": "/api/timecapsule"
            }
        }
    )


# ==================== INCLUDE ROUTES ====================

app.include_router(
    auth.router,
    prefix="/api/auth",
    tags=["Authentication"]
)

app.include_router(
    chat.router,
    prefix="/api/chat",
    tags=["Chat"]
)

app.include_router(
    mood.router,
    prefix="/api/mood",
    tags=["Mood"]
)

app.include_router(
    goals.router,
    prefix="/api/goals",
    tags=["Goals"]
)

app.include_router(
    timecapsule.router,
    prefix="/api/timecapsule",
    tags=["Time Capsule"]
)


# ==================== ERROR HANDLERS ====================

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Handle general exceptions"""
    print(f"Error: {exc}")
    return {
        "status": "error",
        "message": "Internal server error",
        "detail": str(exc) if DEBUG else None,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=DEBUG,
        log_level="info"
    )
