from fastapi import APIRouter, Depends
from middleware.auth import get_current_user
from services.mood_service import calculate_weekly_emotion

router = APIRouter()

@router.post("/record")
async def mood():
    # Ruang untuk fitur pencatatan mood manual di masa depan
    pass

@router.get("/weekly")
async def weekly(user_id: str = Depends(get_current_user)):
    """
    Endpoint untuk mengambil rekap emosi dominan selama 7 hari terakhir.
    Memerlukan token JWT (Bearer Token) dari frontend.
    """
    result = await calculate_weekly_emotion(user_id)
    return result

@router.get("/stats")
async def stats():
    # Ruang untuk fitur statistik lanjutan
    pass