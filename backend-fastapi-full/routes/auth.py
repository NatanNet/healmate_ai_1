from fastapi import APIRouter, Depends
from schemas.auth_schema import RegisterRequest, LoginRequest, BaselineRequest
from middleware.auth import get_current_user
from services.auth_service import *

router = APIRouter()


@router.post("/register")
async def register(req:RegisterRequest):

    return await register_service(req)


@router.post("/login")
async def login(req:LoginRequest):

    return await login_service(req)


@router.get("/me")
async def get_me(
user_id:str=Depends(get_current_user)
):

    return await me_service(user_id)

@router.post("/baseline")
async def set_baseline(
    req: BaselineRequest, 
    user_id: str = Depends(get_current_user)
):
    return await set_baseline_service(user_id, req)