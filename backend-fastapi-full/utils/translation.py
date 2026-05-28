"""Translation service untuk Indonesia <-> English"""

import httpx
from typing import Optional
import asyncio

class TranslationService:
    """Service untuk translate text antara Indonesian dan English"""
    
    # Simple keyword mapping untuk fallback
    KEYWORD_MAPPING = {
        # Common Indonesian words
        "halo": "hello",
        "apa kabar": "how are you",
        "baik": "good",
        "baik-baik saja": "i'm fine",
        "sedih": "sad",
        "senang": "happy",
        "cemas": "anxious",
        "stress": "stress",
        "ingin": "want",
        "tidak": "not",
        "bisa": "can",
        "tolong": "help",
        "sakit": "hurt",
        "takut": "afraid",
        "lelah": "tired",
        "capek": "tired",
        "kesal": "upset",
        "depresi": "depression",
        "putus asa": "hopeless",
        "kecewa": "disappointed",
        "marah": "angry",
        "terima kasih": "thank you",
        "sama-sama": "you're welcome",
        "apa": "what",
        "siapa": "who",
        "dimana": "where",
        "kapan": "when",
        "bagaimana": "how",
    }
    
    @staticmethod
    async def translate_to_english(text: str) -> str:
        """Translate Indonesian text to English"""
        try:
            # Try using MyMemory API (free, no auth needed)
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    "https://api.mymemory.translated.net/get",
                    params={
                        "q": text,
                        "langpair": "id|en"
                    },
                    timeout=5.0
                )
                
                if response.status_code == 200:
                    result = response.json()
                    if result.get("responseStatus") == 200:
                        return result.get("responseData", {}).get("translatedText", text)
        except Exception as e:
            print(f"Translation service error: {e}")
        
        # Fallback ke simple keyword mapping
        return TranslationService._simple_translate(text, to_english=True)
    
    @staticmethod
    async def translate_to_indonesian(text: str) -> str:
        """Translate English text to Indonesian"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    "https://api.mymemory.translated.net/get",
                    params={
                        "q": text,
                        "langpair": "en|id"
                    },
                    timeout=5.0
                )
                
                if response.status_code == 200:
                    result = response.json()
                    if result.get("responseStatus") == 200:
                        return result.get("responseData", {}).get("translatedText", text)
        except Exception as e:
            print(f"Translation service error: {e}")
        
        # Fallback
        return TranslationService._simple_translate(text, to_english=False)
    
    @staticmethod
    def _simple_translate(text: str, to_english: bool = True) -> str:
        """Simple keyword-based translation as fallback"""
        result = text.lower()
        
        if to_english:
            for id_word, en_word in TranslationService.KEYWORD_MAPPING.items():
                result = result.replace(id_word, en_word)
        else:
            # Reverse mapping
            for id_word, en_word in TranslationService.KEYWORD_MAPPING.items():
                result = result.replace(en_word, id_word)
        
        return result

# Export function untuk mudah digunakan
async def translate_id_to_en(text: str) -> str:
    return await TranslationService.translate_to_english(text)

async def translate_en_to_id(text: str) -> str:
    return await TranslationService.translate_to_indonesian(text)