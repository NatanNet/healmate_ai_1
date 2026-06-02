from fastapi import APIRouter, Depends, Query
from middleware.auth import get_current_user
from services.mood_service import calculate_weekly_emotion

router = APIRouter()

@router.post("/record")
async def mood():
    # Ruang untuk fitur pencatatan mood manual di masa depan
    pass

@router.get("/weekly")
async def weekly(
    weeksAgo: int = Query(0), # Menangkap parameter dari URL Frontend
    user_id: str = Depends(get_current_user)
):
    """
    Endpoint untuk mengambil rekap emosi dominan berdasarkan kalender Senin-Minggu.
    Memerlukan token JWT (Bearer Token) dari frontend.
    """
    # Mengirimkan weeksAgo ke service
    result = await calculate_weekly_emotion(user_id, weeks_ago=weeksAgo)
    return result

@router.get("/stats")
async def stats():
    # Ruang untuk fitur statistik lanjutan
    pass