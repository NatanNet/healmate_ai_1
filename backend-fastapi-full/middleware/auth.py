from jose import jwt
from fastapi import HTTPException, Header
from datetime import datetime,timedelta,timezone
from typing import Optional
from config import JWT_SECRET

JWT_EXPIRE=7

def create_token(user_id:str):

    payload={

        "userId":user_id,

        "exp":
        datetime.now(timezone.utc)
        + timedelta(days=JWT_EXPIRE)
    }

    return jwt.encode(
        payload,
        JWT_SECRET,
        algorithm="HS256"
    )


def verify_token(token:str):

    try:

        payload=jwt.decode(
            token,
            JWT_SECRET,
            algorithms=["HS256"]
        )

        return payload.get("userId")

    except:

        return None


def get_current_user(
    authorization:Optional[str]=Header(None)
):

    if not authorization:

        raise HTTPException(
            status_code=401,
            detail="Missing token"
        )

    token=authorization.replace(
        "Bearer ",
        ""
    )

    user_id=verify_token(token)

    if not user_id:

        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    return user_id