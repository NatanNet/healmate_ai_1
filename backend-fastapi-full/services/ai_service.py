"""AI Service - orchestrator untuk AI models"""

from typing import Dict, Any, Optional
from ai.models import EmotionDetectionModel, ResponseGenerationModel, DummyAIModel
from config import AI_URL
import httpx


class AIService:
    """Service untuk manage dan use AI models"""
    
    def __init__(self):
        self.emotion_model = EmotionDetectionModel()
        self.response_model = ResponseGenerationModel()
        self.use_external_api = bool(AI_URL)
        self.models_loaded = False
    
    async def load_models(self) -> bool:
        """Load semua AI models"""
        try:
            if self.use_external_api:
                print("Using external AI API")
                self.models_loaded = True
            else:
                # Load internal models
                emotion_loaded = await self.emotion_model.load()
                response_loaded = await self.response_model.load()
                self.models_loaded = emotion_loaded and response_loaded
            
            return self.models_loaded
        except Exception as e:
            print(f"Error loading models: {e}")
            return False
    
    async def unload_models(self) -> bool:
        """Unload semua AI models"""
        try:
            if not self.use_external_api:
                await self.emotion_model.unload()
                await self.response_model.unload()
            
            self.models_loaded = False
            return True
        except Exception as e:
            print(f"Error unloading models: {e}")
            return False
    
    async def get_ai_response(self, message: str) -> Dict[str, Any]:
        """Get AI response dan emotion detection untuk user message"""
        try:
            if self.use_external_api:
                return await self._get_external_ai_response(message)
            else:
                return await self._get_internal_ai_response(message)
        except Exception as e:
            print(f"Error getting AI response: {e}")
            return {
                "reply": "I'm here to listen. Could you tell me more?",
                "emotion": "neutral",
                "confidence": 0.0,
                "error": str(e)
            }
    
    async def _get_internal_ai_response(self, message: str) -> Dict[str, Any]:
        """Get response dari internal AI models"""
        try:
            # Detect emotion
            emotion_result = await self.emotion_model.predict(message)
            emotion = emotion_result.get("emotion", "neutral")
            emotion_confidence = emotion_result.get("confidence", 0.0)
            
            # Generate response
            response_result = await self.response_model.predict(message)
            reply = response_result.get("response", "Thank you for sharing.")
            response_confidence = response_result.get("confidence", 0.0)
            
            return {
                "reply": reply,
                "emotion": emotion,
                "emotion_confidence": emotion_confidence,
                "response_confidence": response_confidence
            }
        except Exception as e:
            print(f"Error in internal AI response: {e}")
            return {
                "reply": "Thank you for sharing. I hear you.",
                "emotion": "neutral",
                "error": str(e)
            }
    
    async def _get_external_ai_response(self, message: str) -> Dict[str, Any]:
        """Get response dari external AI API"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{AI_URL}/predict",
                    json={"text": message},
                    timeout=10.0
                )
                print(f"\n[EXTERNAL AI API] Called {AI_URL}/predict with message: {message}")
                print(f"External AI API response status: {response.status_code}")
                print(f"External AI API response content: {response.text}")

                if response.status_code == 200:
                    result = response.json()
                    return {
                        "reply": result.get("response", "Thank you for sharing."),
                        "emotion": result.get("emotion", "neutral"),
                        "source": "external_api"
                    }
                else:
                    return {
                        "reply": "Thank you for sharing. I hear you.",
                        "emotion": "neutral",
                        "error": f"API returned {response.status_code}"
                    }
        except Exception as e:
            print(f"Error calling external AI API: {e}")
            return {
                "reply": "Thank you for sharing. I hear you.",
                "emotion": "neutral",
                "error": str(e)
            }
    
    def get_models_info(self) -> Dict[str, Any]:
        """Get info tentang loaded models"""
        return {
            "models_loaded": self.models_loaded,
            "use_external_api": self.use_external_api,
            "emotion_model": self.emotion_model.get_info() if not self.use_external_api else None,
            "response_model": self.response_model.get_info() if not self.use_external_api else None,
            "external_api_url": AI_URL if self.use_external_api else None
        }


# Global AI service instance
ai_service = None


async def init_ai_service() -> AIService:
    """Initialize AI service"""
    global ai_service
    if ai_service is None:
        ai_service = AIService()
        await ai_service.load_models()
    return ai_service


async def get_ai_service() -> AIService:
    """Get AI service instance"""
    global ai_service
    if ai_service is None:
        return await init_ai_service()
    return ai_service


async def shutdown_ai_service():
    """Shutdown AI service"""
    global ai_service
    if ai_service:
        await ai_service.unload_models()
        ai_service = None


async def get_ai_response(message: str) -> Dict[str, Any]:
    """Wrapper function untuk get AI response - untuk compatibility dengan chat_service.py"""
    service = await get_ai_service()
    return await service.get_ai_response(message)
