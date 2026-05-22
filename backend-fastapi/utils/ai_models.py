import torch
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
import logging
from typing import Dict, List
import numpy as np

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AIModelManager:
    """
    Mengelola semua AI models untuk HealMate
    Dioptimasi untuk memory dan speed
    """
    
    def __init__(self):
        """Initialize AI models"""
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        logger.info(f"🖥️ Using device: {self.device}")
        
        self._load_models()
    
    def _load_models(self):
        """Load semua models (bisa customize sesuai kebutuhan)"""
        try:
            logger.info("📦 Loading AI models...")
            
            # Model 1: Sentiment Analysis (untuk mood detection)
            self.sentiment_analyzer = pipeline(
                "sentiment-analysis",
                model="distilbert-base-uncased-finetuned-sst-2-english",
                device=0 if self.device == "cuda" else -1
            )
            logger.info("✅ Sentiment analyzer loaded")
            
            # Model 2: Zero-shot Classification (untuk emotion detection)
            # Bisa classify ke emotion apapun tanpa training ulang
            self.zero_shot_classifier = pipeline(
                "zero-shot-classification",
                model="facebook/bart-large-mnli",
                device=0 if self.device == "cuda" else -1
            )
            logger.info("✅ Zero-shot classifier loaded")
            
        except Exception as e:
            logger.error(f"❌ Error loading models: {e}")
            raise
    
    def analyze_sentiment(self, text: str) -> Dict:
        """
        Analisis sentiment text
        Return: {"label": "POSITIVE/NEGATIVE", "score": 0.95}
        """
        try:
            result = self.sentiment_analyzer(text)[0]
            return {
                "sentiment": result['label'].lower(),
                "confidence": round(float(result['score']), 2)
            }
        except Exception as e:
            logger.error(f"Error in sentiment analysis: {e}")
            return {"error": str(e)}
    
    def analyze_emotion(self, text: str, emotions: List[str] = None) -> Dict:
        """
        Classify emotion dari text
        emotions: list emotion yang ingin di-classify
        """
        if emotions is None:
            emotions = ["happy", "sad", "anxious", "calm", "stressed", "excited"]
        
        try:
            result = self.zero_shot_classifier(text, emotions)
            
            # Format hasil
            emotion_scores = {}
            for label, score in zip(result['labels'], result['scores']):
                emotion_scores[label] = round(float(score), 2)
            
            return {
                "primary_emotion": result['labels'][0],
                "confidence": round(float(result['scores'][0]), 2),
                "all_scores": emotion_scores
            }
        except Exception as e:
            logger.error(f"Error in emotion analysis: {e}")
            return {"error": str(e)}
    
    def generate_recommendation(self, emotion: str, sentiment: str) -> str:
        """
        Generate recommendation berdasarkan emotion & sentiment
        """
        recommendations = {
            "happy": "Keep up the positive energy! 🌟",
            "sad": "It's okay to feel down. Try talking to someone. 💙",
            "anxious": "Deep breathing exercises can help. Take it slow. 🧘",
            "calm": "Great! Maintain this peaceful state. 🌿",
            "stressed": "You're doing great. Take a break and rest. ☕",
            "excited": "That's wonderful energy! Channel it productively! 🚀"
        }
        
        return recommendations.get(emotion, "Remember to take care of yourself! 💜")

# Global instance (load sekali aja, efficient)
ai_manager = None

def get_ai_manager() -> AIModelManager:
    """Dependency injection untuk ai_manager"""
    global ai_manager
    if ai_manager is None:
        ai_manager = AIModelManager()
    return ai_manager