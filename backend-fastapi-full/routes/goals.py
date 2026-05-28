"""Goals routes"""

from fastapi import APIRouter, Depends
from bson import ObjectId

from schemas.goal_schema import GoalCreate, GoalUpdate, GoalResponse
from middleware.auth import get_current_user

router = APIRouter()


@router.post("/create")
async def create_goal(
    req: GoalCreate,
    user_id: str = Depends(get_current_user)
):
    """Create new goal"""
    # TODO: Implement create goal service
    return {
        "status": "success",
        "message": "Goal created",
        "goal": {}
    }


@router.get("/{goal_id}")
async def get_goal(
    goal_id: str,
    user_id: str = Depends(get_current_user)
):
    """Get goal detail"""
    # TODO: Implement get goal service
    return {
        "status": "success",
        "goal": {}
    }


@router.get("/")
async def list_goals(
    user_id: str = Depends(get_current_user)
):
    """List user goals"""
    # TODO: Implement list goals service
    return {
        "status": "success",
        "goals": []
    }


@router.put("/{goal_id}")
async def update_goal(
    goal_id: str,
    req: GoalUpdate,
    user_id: str = Depends(get_current_user)
):
    """Update goal"""
    # TODO: Implement update goal service
    return {
        "status": "success",
        "message": "Goal updated"
    }


@router.delete("/{goal_id}")
async def delete_goal(
    goal_id: str,
    user_id: str = Depends(get_current_user)
):
    """Delete goal"""
    # TODO: Implement delete goal service
    return {
        "status": "success",
        "message": "Goal deleted"
    }
