import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB
MONGODB_URI = os.getenv(
    "MONGODB_URI"
)

# JWT
JWT_SECRET = os.getenv(
    "JWT_SECRET",
    "healmate_secret"
)

JWT_EXPIRE = 7


# AI API
AI_URL = os.getenv(
    "AI_URL"
)


# App
APP_NAME = "HealMate API"

DEBUG = os.getenv(
    "DEBUG",
    "false"
).lower() == "true"