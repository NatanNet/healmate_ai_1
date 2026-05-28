"""Pydantic schemas untuk mood endpoints"""

from pydantic import BaseModel, Field
from datetime import datetime


class MoodRequest(BaseModel):
    """Schema untuk record mood"""
    mood: str = Field(..., pattern="^(happy|sad|anxious|angry|calm|excited|stressed|neutral|confused|hopeful)$")
    intensity: int = Field(..., ge=1, le=10)
    
    class Config:
        json_schema_extra = {
            "example": {
                "mood": "anxious",
                "intensity": 7
            }
        }


class MoodResponse(BaseModel):
    """Schema untuk mood response"""
    id: str
    userId: str
    mood: str
    intensity: int
    createdAt: datetime
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "507f1f77bcf86cd799439011",
                "userId": "507f1f77bcf86cd799439010",
                "mood": "anxious",
                "intensity": 7,
                "createdAt": "2026-05-25T10:30:00Z"
            }
        }


class MoodStats(BaseModel):
    """Schema untuk mood statistics"""
    totalRecords: int
    averageIntensity: float
    moodBreakdown: dict
