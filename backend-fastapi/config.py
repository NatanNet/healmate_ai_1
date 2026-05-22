from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    """Konfigurasi FastAPI Backend"""
    
    # Server settings
    APP_NAME: str = "HealMate AI Backend"
    DEBUG: bool = False
    ENVIRONMENT: str = "development"
    
    # CORS settings (untuk komunikasi dengan Express Backend)
    ALLOWED_ORIGINS: list = [
        "http://localhost:5000",      # Express backend
        "http://localhost:5173",      # Frontend Vite
        "http://localhost",           # Frontend production
        "http://express:5000",        # Docker network
    ]
    
    # Model settings
    MODEL_CACHE_DIR: str = "./models"
    USE_GPU: bool = False  # Set True jika punya GPU
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Create instance
settings = Settings()