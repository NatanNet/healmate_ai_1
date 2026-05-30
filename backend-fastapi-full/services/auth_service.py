from database.mongodb import get_db
from middleware.auth import create_token
from bson import ObjectId
import bcrypt
from datetime import datetime, timezone
from fastapi import HTTPException


async def register_service(req):

    db=get_db()

    users=db["users"]

    existing=users.find_one({

        "$or":[

            {"email":req.email},
            {"username":req.username}

        ]

    })

    if existing:

        raise HTTPException(
            status_code=409,
            detail="User already exists"
        )


    hashed=bcrypt.hashpw(

        req.password.encode(),
        bcrypt.gensalt()

    ).decode()


    user_doc={

        "username":req.username,
        "email":req.email,
        "password":hashed,
        "fullName":req.fullName,
        "createdAt":datetime.now(timezone.utc)

    }

    result=users.insert_one(
        user_doc
    )

    token=create_token(
        str(result.inserted_id)
    )

    return {
        "status": "success",
        "token": token,
        "user_id": str(result.inserted_id)
    }


async def login_service(req):
    """Login user dan return JWT token"""
    db = get_db()
    users = db["users"]
    
    # Find user by email
    user = users.find_one({"email": req.email})
    
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not bcrypt.checkpw(req.password.encode(), user["password"].encode()):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )
    
    # Create JWT token
    token = create_token(str(user["_id"]))
    
    return {
        "status": "success",
        "token": token,
        "user_id": str(user["_id"]),
        "email": user["email"],
        "username": user.get("username", ""),
        "fullName": user.get("fullName", "")
    }


async def me_service(user_id: str):
    """Get current user info"""
    db = get_db()
    users = db["users"]
    
    try:
        user = users.find_one({"_id": ObjectId(user_id)})
        
        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )
        
        return {
            "user_id": str(user["_id"]),
            "email": user["email"],
            "username": user.get("username", ""),
            "fullName": user.get("fullName", ""),
            "createdAt": user.get("createdAt", ""),
            "healingBonus": user.get("healingBonus", 0.0) 
        }
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )