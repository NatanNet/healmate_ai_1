"""Pydantic schemas untuk goal endpoints"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class GoalCreate(BaseModel):
    """Schema untuk create goal"""
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=2000)
    dueDate: Optional[datetime] = None
    priority: Optional[str] = Field(None, pattern="^(low|medium|high)$")
    
    class Config:
        json_schema_extra = {
            "example": {
                "title": "Exercise regularly",
                "description": "Work out 3 times a week",
                "dueDate": "2026-06-25",
                "priority": "high"
            }
        }


class GoalUpdate(BaseModel):
    """Schema untuk update goal"""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=2000)
    dueDate: Optional[datetime] = None
    priority: Optional[str] = Field(None, pattern="^(low|medium|high)$")
    status: Optional[str] = Field(None, pattern="^(active|completed|abandoned)$")


class GoalResponse(BaseModel):
    """Schema untuk goal response"""
    id: str
    userId: str
    title: str
    description: Optional[str] = None
    dueDate: Optional[datetime] = None
    priority: str = "medium"
    status: str = "active"
    progress: int = 0
    createdAt: datetime
    updatedAt: Optional[datetime] = None
