"""Time Capsule routes"""

from fastapi import APIRouter, Depends
from bson import ObjectId

from schemas.timecapsule_schema import TimeCapsuleCreate, TimeCapsuleUpdate, TimeCapsuleResponse
from middleware.auth import get_current_user

router = APIRouter()


@router.post("/create")
async def create_timecapsule(
    req: TimeCapsuleCreate,
    user_id: str = Depends(get_current_user)
):
    """Create new time capsule"""
    # TODO: Implement create time capsule service
    return {
        "status": "success",
        "message": "Time capsule created",
        "timecapsule": {}
    }


@router.get("/{capsule_id}")
async def get_timecapsule(
    capsule_id: str,
    user_id: str = Depends(get_current_user)
):
    """Get time capsule detail"""
    # TODO: Implement get time capsule service
    return {
        "status": "success",
        "timecapsule": {}
    }


@router.get("/")
async def list_timecapsules(
    user_id: str = Depends(get_current_user)
):
    """List user time capsules"""
    # TODO: Implement list time capsules service
    return {
        "status": "success",
        "timecapsules": []
    }


@router.put("/{capsule_id}")
async def update_timecapsule(
    capsule_id: str,
    req: TimeCapsuleUpdate,
    user_id: str = Depends(get_current_user)
):
    """Update time capsule"""
    # TODO: Implement update time capsule service
    return {
        "status": "success",
        "message": "Time capsule updated"
    }


@router.delete("/{capsule_id}")
async def delete_timecapsule(
    capsule_id: str,
    user_id: str = Depends(get_current_user)
):
    """Delete time capsule"""
    # TODO: Implement delete time capsule service
    return {
        "status": "success",
        "message": "Time capsule deleted"
    }


@router.post("/{capsule_id}/open")
async def open_timecapsule(
    capsule_id: str,
    user_id: str = Depends(get_current_user)
):
    """Open/unlock time capsule if date is reached"""
    # TODO: Implement open time capsule service
    return {
        "status": "success",
        "message": "Time capsule opened"
    }
