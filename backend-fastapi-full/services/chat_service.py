from typing import Dict, Any
from datetime import datetime
import traceback
from database.mongodb import get_db
from utils.translation import translate_id_to_en, translate_en_to_id
from utils.chatbot_engine import ChatbotEngine
from services.ai_service import get_ai_response as get_ai_response_service
from bson import ObjectId


async def process_chat(message: str, user_id: str) -> Dict[str, Any]:
    """
    Process chat message dengan flow:
    1. Translate ID -> EN
    2. Process dengan chatbot engine
    3. Save ke database
    4. Return response
    """
    print(f"\n{'='*60}")
    print(f"[START] PROCESS_CHAT")
    print(f"User Message: '{message}'")
    print(f"User ID: {user_id}")
    
    try:
        db = get_db()
        
        # Step 1: Translate
        print(f"\n[STEP 1] Translating Indonesian -> English...")
        message_en = await translate_id_to_en(message)
        print(f"✓ Translation Result: '{message_en}'")
        
        # Step 2: Process dengan chatbot engine  / kalau LLM jadi, ini diubah AI Service dan translate dihapus
        print(f"\n[STEP 2] Calling ChatbotEngine.process_message()...")
        print(f"Input to ChatbotEngine: '{message_en}'")
        
        chatbot_result = ChatbotEngine.process_message(message_en)
        print(f"✓ ChatbotEngine Result: {chatbot_result}")
        
        # Step 2b: Get AI response dari AI service
        print(f"\n[STEP 2B] Getting AI response dari AI service...")
        ai_message_post = await get_ai_response_service(message_en)
        print(f"✓ AI Service Result: {ai_message_post}")
        
        # Extract fields dari AI service response
        ai_response_id = chatbot_result.get("response", "Default response")
        emotion = ai_message_post.get("emotion", "neutral")
        confidence = ai_message_post.get("confidence", 0.00000)
        intent = chatbot_result.get("intent", "default")

        print(f"\n[EXTRACT] Emotion: {emotion} | Intent: {intent} | Confidence: {confidence}")
        print(f"[EXTRACT] Response: '{ai_response_id}'")
        
        # Step 3: Save ke database
        print(f"\n[STEP 3] Saving to MongoDB...")
        chat_doc = {
            "userId": ObjectId(user_id),
            "userMessage": message,
            "messageEN": message_en,
            "aiResponse": ai_response_id,
            "emotion": emotion,
            "confidence": confidence,
            "intent": intent,
            "createdAt": datetime.utcnow()
        }
        
        result = db["chats"].insert_one(chat_doc)
        print(f"✓ Saved to MongoDB with ID: {result.inserted_id}")
        
        response_data = {
            "status": "success",
            "chatId": str(result.inserted_id),
            "userMessage": message,
            "aiResponse": ai_response_id,
            "emotion": emotion,
            "confidence": confidence,
            "intent": intent,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        print(f"\n[SUCCESS] Response: {response_data}")
        print(f"{'='*60}\n")
        
        return response_data
        
    except Exception as e:
        print(f"\n{'='*60}")
        print(f"❌ ERROR in process_chat:")
        print(f"Exception Type: {type(e).__name__}")
        print(f"Exception Message: {str(e)}")
        print(f"\nFull Traceback:")
        print(traceback.format_exc())
        print(f"{'='*60}\n")
        
        return {
            "status": "error",
            "userMessage": message,
            "aiResponse": "Maaf, ada error. Coba lagi ya?",
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat()
        }


async def get_chat_history(user_id: str, limit: int = 50, skip: int = 0) -> Dict[str, Any]:
    """Get chat history"""
    try:
        db = get_db()
        chats = list(db["chats"].find(
            {"userId": ObjectId(user_id)}
        ).sort("createdAt", -1).skip(skip).limit(limit))
        
        for chat in chats:
            chat["_id"] = str(chat["_id"])
            chat["userId"] = str(chat["userId"])
        
        return {
            "status": "success",
            "count": len(chats),
            "chats": chats
        }
    except Exception as e:
        print(f"Error getting history: {e}")
        return {
            "status": "error",
            "error": str(e)
        }