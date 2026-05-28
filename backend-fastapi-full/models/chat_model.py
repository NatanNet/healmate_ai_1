"""Chat model untuk database"""

from datetime import datetime
from typing import Optional

class Chat:
    """Model untuk chat message"""
    
    def __init__(self, 
                 user_id: str,
                 user_message: str,
                 ai_response: str,
                 emotion: str = "neutral",
                 confidence: float = 0.5,
                 intent: str = "default"):
        self.user_id = user_id
        self.user_message = user_message
        self.ai_response = ai_response
        self.emotion = emotion
        self.confidence = confidence
        self.intent = intent
        self.created_at = datetime.utcnow()
    
    def to_dict(self):
        """Convert ke dictionary untuk MongoDB"""
        return {
            "userId": self.user_id,
            "userMessage": self.user_message,
            "aiResponse": self.ai_response,
            "emotion": self.emotion,
            "confidence": self.confidence,
            "intent": self.intent,
            "createdAt": self.created_at
        }