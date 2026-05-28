"""Base model interface untuk AI models"""

from abc import ABC, abstractmethod
from typing import Dict, Any, Optional


class BaseAIModel(ABC):
    """Base class untuk semua AI models"""
    
    def __init__(self, name: str, version: str = "1.0"):
        self.name = name
        self.version = version
        self.is_loaded = False
    
    @abstractmethod
    async def load(self) -> bool:
        """Load model - implement di subclass"""
        pass
    
    @abstractmethod
    async def predict(self, input_data: str) -> Dict[str, Any]:
        """Predict menggunakan model - implement di subclass"""
        pass
    
    @abstractmethod
    async def unload(self) -> bool:
        """Unload model - implement di subclass"""
        pass
    
    def get_info(self) -> Dict[str, Any]:
        """Get model info"""
        return {
            "name": self.name,
            "version": self.version,
            "is_loaded": self.is_loaded
        }


class DummyAIModel(BaseAIModel):
    """Dummy model untuk testing - akan diganti dengan real model"""
    
    def __init__(self):
        super().__init__("dummy_model", "1.0")
    
    async def load(self) -> bool:
        """Load dummy model"""
        self.is_loaded = True
        return True
    
    async def predict(self, input_data: str) -> Dict[str, Any]:
        """Return dummy prediction"""
        return {
            "response": "Thank you for sharing. I hear you.",
            "emotion": "neutral",
            "confidence": 0.5
        }
    
    async def unload(self) -> bool:
        """Unload dummy model"""
        self.is_loaded = False
        return True
