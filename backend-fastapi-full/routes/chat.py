"""Chat routes"""

from fastapi import APIRouter, Depends, HTTPException
from schemas.chat_schema import ChatRequest
from services.chat_service import process_chat, get_chat_history
from middleware.auth import get_current_user

router = APIRouter()


@router.post("/send")
async def send_chat(
    req: ChatRequest,
    user_id: str = Depends(get_current_user)
):
    """Send chat message"""
    
    if not req.message or not req.message.strip():
        raise HTTPException(
            status_code=400,
            detail="Message cannot be empty"
        )
    
    result = await process_chat(req.message, user_id)
    return result


@router.get("/history")
async def chat_history(
    limit: int = 50,
    skip: int = 0,
    user_id: str = Depends(get_current_user)
):
    """Get chat history"""
    result = await get_chat_history(user_id, limit, skip)
    return result