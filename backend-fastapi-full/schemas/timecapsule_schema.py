"""Pydantic schemas untuk timecapsule endpoints"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class TimeCapsuleCreate(BaseModel):
    """Schema untuk create time capsule"""
    title: str = Field(..., min_length=1, max_length=200)
    content: str = Field(..., min_length=1, max_length=10000)
    openDate: datetime
    tags: Optional[list[str]] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "title": "Letter to Future Me",
                "content": "This is a message for my future self...",
                "openDate": "2027-05-25",
                "tags": ["personal", "reflection"]
            }
        }


class TimeCapsuleUpdate(BaseModel):
    """Schema untuk update time capsule"""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    content: Optional[str] = Field(None, min_length=1, max_length=10000)
    openDate: Optional[datetime] = None
    tags: Optional[list[str]] = None


class TimeCapsuleResponse(BaseModel):
    """Schema untuk time capsule response"""
    id: str
    userId: str
    title: str
    content: str
    openDate: datetime
    isOpened: bool = False
    tags: Optional[list[str]] = None
    createdAt: datetime
    openedAt: Optional[datetime] = None
