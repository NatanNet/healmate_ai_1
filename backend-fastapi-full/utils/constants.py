"""Constants untuk HealMate API"""

# Mood types
MOOD_TYPES = [
    "happy",
    "sad",
    "anxious",
   
]

# Valid intensity levels (1-10)
VALID_INTENSITIES = list(range(1, 11))

# API Response status
RESPONSE_SUCCESS = "success"
RESPONSE_ERROR = "error"
RESPONSE_FAILED = "failed"

# Database collections
COLLECTION_USERS = "users"
COLLECTION_CHATS = "chats"
COLLECTION_MOODS = "moods"
COLLECTION_GOALS = "goals"
COLLECTION_TIMECAPSULES = "timecapsules"

# Default pagination
DEFAULT_PAGE = 1
DEFAULT_LIMIT = 50
MAX_LIMIT = 100

# AI Model defaults
DEFAULT_AI_RESPONSE = "Thank you for sharing. I hear you. How can I support you today?"
DEFAULT_EMOTION = "neutral"

# Error messages
ERROR_USER_NOT_FOUND = "User not found"
ERROR_INVALID_CREDENTIALS = "Invalid email or password"
ERROR_USER_EXISTS = "Email or username already exists"
ERROR_CHAT_NOT_FOUND = "Chat not found"
ERROR_MOOD_NOT_FOUND = "Mood record not found"
ERROR_GOAL_NOT_FOUND = "Goal not found"
ERROR_DB_CONNECTION = "Database connection failed"
ERROR_UNAUTHORIZED = "Unauthorized"
