"""Time Capsule routes"""

from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId

from schemas.timecapsule_schema import TimeCapsuleCreate, TimeCapsuleUpdate, TimeCapsuleResponse
from middleware.auth import get_current_user

# TAMBAHKAN IMPORT INI:
from services.timecapsule_service import create_timecapsule_service, get_user_timecapsules_service

router = APIRouter()

@router.post("/create")
async def create_timecapsule(
    req: TimeCapsuleCreate,
    user_id: str = Depends(get_current_user)
):
    """Create new time capsule"""
    try:
        # Ubah request Pydantic menjadi Dictionary
        capsule_data = req.model_dump()
        
        # Kirim fungsi service untuk disimpan ke MongoDB
        new_capsule = await create_timecapsule_service(user_id, capsule_data)
        
        return {
            "status": "success",
            "message": "Time capsule created",
            "timecapsule": new_capsule
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal menyimpan kapsul: {str(e)}")


@router.get("/")
async def list_timecapsules(
    user_id: str = Depends(get_current_user)
):
    """List user time capsules"""
    try:
        # 1. Ambil data dari MongoDB lewat service
        capsules = await get_user_timecapsules_service(user_id)
        
        return {
            "status": "success",
            "timecapsules": capsules
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal mengambil daftar kapsul: {str(e)}")
