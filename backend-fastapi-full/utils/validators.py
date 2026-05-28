"""Validators untuk input data"""

import re
from typing import Optional
from utils.errors import ValidationError


def validate_email(email: str) -> bool:
    """Validasi email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(pattern, email):
        raise ValidationError("Invalid email format")
    return True


def validate_password(password: str) -> bool:
    """Validasi password strength"""
    if len(password) < 6:
        raise ValidationError("Password must be at least 6 characters")
    return True


def validate_username(username: str) -> bool:
    """Validasi username"""
    if len(username) < 3:
        raise ValidationError("Username must be at least 3 characters")
    if len(username) > 50:
        raise ValidationError("Username must be less than 50 characters")
    if not re.match(r'^[a-zA-Z0-9_-]+$', username):
        raise ValidationError("Username can only contain letters, numbers, underscore and hyphen")
    return True


def validate_mood(mood: str) -> bool:
    """Validasi mood value"""
    from utils.constants import MOOD_TYPES
    if mood not in MOOD_TYPES:
        raise ValidationError(f"Invalid mood. Must be one of: {', '.join(MOOD_TYPES)}")
    return True


def validate_intensity(intensity: int) -> bool:
    """Validasi mood intensity"""
    from utils.constants import VALID_INTENSITIES
    if intensity not in VALID_INTENSITIES:
        raise ValidationError(f"Intensity must be between 1-10")
    return True


def validate_message(message: str) -> bool:
    """Validasi chat message"""
    if not message or not message.strip():
        raise ValidationError("Message cannot be empty")
    if len(message) > 5000:
        raise ValidationError("Message too long (max 5000 characters)")
    return True


def validate_goal_title(title: str) -> bool:
    """Validasi goal title"""
    if not title or not title.strip():
        raise ValidationError("Goal title cannot be empty")
    if len(title) > 200:
        raise ValidationError("Goal title too long (max 200 characters)")
    return True
