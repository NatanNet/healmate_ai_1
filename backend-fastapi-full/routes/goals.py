"""Goals routes"""

from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId

from schemas.goal_schema import GoalCreate, GoalUpdate, GoalResponse
from middleware.auth import get_current_user

# Import service yang baru kita buat
from services import goal_service 
from database.mongodb import get_db # Untuk fitur gamifikasi

router = APIRouter()

@router.post("/create", response_model=dict)
async def create_goal(
    req: GoalCreate,
    user_id: str = Depends(get_current_user)
):
    """Create new goal"""
    try:
        new_goal = goal_service.create_goal(req, user_id)
        return {
            "status": "success",
            "message": "Goal created",
            "goal": new_goal
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{goal_id}")
async def get_goal(
    goal_id: str,
    user_id: str = Depends(get_current_user)
):
    """Get goal detail"""
    goal = goal_service.get_goal(goal_id, user_id)
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
        
    return {
        "status": "success",
        "goal": goal
    }

@router.get("/")
async def list_goals(
    user_id: str = Depends(get_current_user)
):
    """List user goals"""
    goals = goal_service.list_goals(user_id)
    return goals # Sesuai dengan fetch di frontend yang mengharapkan array balikan langsung

@router.put("/{goal_id}")
async def update_goal(
    goal_id: str,
    req: GoalUpdate,
    user_id: str = Depends(get_current_user)
):
    """Update goal & Gamifikasi Poin"""
    # Cek apakah targetnya ada
    existing_goal = goal_service.get_goal(goal_id, user_id)
    if not existing_goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    # Update targetnya
    updated_goal = goal_service.update_goal(goal_id, req.dict(), user_id)

    # ==========================================
    # LOGIKA GAMIFIKASI (BONUS HEALING SCORE)
    # ==========================================
    # Jika statusnya berubah menjadi 'completed', berikan bonus +2% ke user
    if req.status == "completed" and existing_goal.get("status") != "completed":
        db = get_db()
        # Asumsi: kamu menyimpan total bonus/skor di tabel users. 
        # Sesuaikan 'healingBonus' dengan nama field di databasemu.
        db["users"].update_one(
            {"_id": ObjectId(user_id)},
            {"$inc": {"healingBonus": 0.02}} # Tambah bonus 2%
        )

    return {
        "status": "success",
        "message": "Goal updated",
        "goal": updated_goal
    }

@router.delete("/{goal_id}")
async def delete_goal(
    goal_id: str,
    user_id: str = Depends(get_current_user)
):
    """Delete goal"""
    is_deleted = goal_service.delete_goal(goal_id, user_id)
    if not is_deleted:
        raise HTTPException(status_code=404, detail="Goal not found or already deleted")
        
    return {
        "status": "success",
        "message": "Goal deleted"
    }