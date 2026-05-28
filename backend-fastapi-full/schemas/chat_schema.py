"""Pydantic schemas untuk chat endpoints"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ChatRequest(BaseModel):
    """Schema untuk send chat message"""
    message: str = Field(..., min_length=1, max_length=5000)
    
    class Config:
        json_schema_extra = {
            "example": {
                "message": "I'm feeling anxious today..."
            }
        }


class ChatUpdate(BaseModel):
    """Schema untuk update chat response"""
    aiResponse: Optional[str] = None
    emotion: Optional[str] = None


class ChatResponse(BaseModel):
    """Schema untuk chat response"""
    id: str
    userId: str
    userMessage: str
    aiResponse: str
    emotion: str = "neutral"
    createdAt: datetime
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "507f1f77bcf86cd799439011",
                "userId": "507f1f77bcf86cd799439010",
                "userMessage": "I'm feeling anxious today...",
                "aiResponse": "I hear you. That's a valid feeling...",
                "emotion": "anxious",
                "createdAt": "2026-05-25T10:30:00Z"
            }
        }
