import os
from dotenv import load_dotenv
load_dotenv() # <--- INI KUNCI AGAR API KEY GEMINI TERBACA!

from typing import Dict, Any
from datetime import datetime
import traceback
import httpx
from bson import ObjectId
import google.generativeai as genai

from database.mongodb import get_db
from utils.chatbot_engine import ChatbotEngine, EmotionDetector

# Ambil URL Ngrok dari config
try:
    from config import AI_URL
except ImportError:
    AI_URL = os.getenv("AI_URL", "http://localhost:8000")

# Setup Gemini AI secara mutlak
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
llm_model = None

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    llm_model = genai.GenerativeModel("gemini-3.1-flash-lite")
    print("✅ GEMINI API BERHASIL AKTIF!")
else:
    print("❌ ERROR: GEMINI API KEY KOSONG! Cek file .env")

async def process_chat(message: str, user_id: str) -> Dict[str, Any]:
    """
    Process chat message:
    1. Kirim teks ke Ngrok untuk deteksi Emosi & Healing Score
    2. Hasilkan balasan EKSKLUSIF menggunakan GEMINI
    3. Save ke database
    """
    print(f"\n{'='*60}")
    print(f"[START] PROCESS_CHAT")
    print(f"User Message: '{message}'")
    
    try:
        db = get_db()
        
        # ==========================================
        # STEP 1: DETEKSI EMOSI DARI NGROK (COLAB)
        # ==========================================
        print(f"\n[STEP 1] Memanggil AI Colab ({AI_URL}/predict)...")
        emotion = "anxiety" 
        confidence = 0.0
        healing_score = 0.5 
        message_en = message
        
        try:
            async with httpx.AsyncClient() as client:
                ai_response = await client.post(
                    f"{AI_URL}/predict", 
                    json={"text": message}, 
                    headers={"ngrok-skip-browser-warning": "true"},
                    timeout=15.0 
                )
                
                if ai_response.status_code == 200:
                    ai_result = ai_response.json()
                    emotion = ai_result.get("emotion", "anxiety").lower()
                    confidence = ai_result.get("confidence", 0.0)
                    healing_score = ai_result.get("healing_score", 0.5)
                    message_en = ai_result.get("text_english", message)
                    print(f"✓ Berhasil ambil data -> Emotion: {emotion} | Score: {healing_score}")
                else:
                    emotion, confidence = EmotionDetector.detect(message)
        except Exception as api_err:
            print(f"Ngrok gagal: {api_err}")
            emotion, confidence = EmotionDetector.detect(message)

        # ==========================================
        # STEP 2: BALASAN MURNI DARI GEMINI AI
        # ==========================================
        print(f"\n[STEP 2] Meminta jawaban dari Gemini...")
        intent = ChatbotEngine._detect_intent(message) # Hanya ambil intent untuk data
        ai_response_text = ""
        
        if llm_model:
            prompt = f"""
            Kamu adalah HealMate, asisten curhat AI yang suportif dan berempati.
            Tugasmu menemani user Gen-Z yang sedang melewati masa putus cinta.
            
            Kondisi User Saat Ini:
            - Sedang merasa: {emotion}
            - Tingkat pemulihan (Healing Score): {healing_score} (0.0=hancur, 1.0=ikhlas)
            
            Pesan user: "{message}"
            
            Instruksi Balasan:
            1. Balas dengan bahasa Indonesia sehari-hari, gunakan "aku" dan "kamu".
            2. Validasi perasaannya yang sedang '{emotion}' itu.
            3. Jawab singkat saja 1-3 kalimat. Seperti chat teman di WhatsApp. Jangan pakai format list/bullet.
            """
            
            try:
                gemini_response = await llm_model.generate_content_async(prompt)
                ai_response_text = gemini_response.text.strip()
                print(f"✓ GEMINI MENJAWAB: '{ai_response_text}'")
            except Exception as e:
                print(f"Gemini Error: {e}")
                ai_response_text = "Maaf ya, server lagi gangguan sebentar. Kamu mau cerita lagi?"
        else:
            ai_response_text = "API Key Gemini belum dipasang di sistem. cek .env!"

        # ==========================================
        # STEP 3: SIMPAN KE MONGODB
        # ==========================================
        print(f"\n[STEP 3] Menyimpan ke Database...")
        chat_doc = {
            "userId": ObjectId(user_id),
            "userMessage": message,
            "messageEN": message_en,
            "aiResponse": ai_response_text,
            "emotion": emotion,
            "confidence": confidence,
            "intent": intent,
            "healingScore": healing_score,
            "createdAt": datetime.utcnow()
        }
        
        result = db["chats"].insert_one(chat_doc)
        
        # ==========================================
        # STEP 4: KIRIM KE FRONTEND
        # ==========================================
        return {
            "status": "success",
            "chatId": str(result.inserted_id),
            "userMessage": message,
            "aiResponse": ai_response_text,
            "emotion": emotion,
            "confidence": confidence,
            "intent": intent,
            "healingScore": healing_score,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        print(traceback.format_exc())
        return {
            "status": "error",
            "userMessage": message,
            "aiResponse": "Duh, sistemku error. Coba ketik lagi ya.",
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
        return {
            "status": "error",
            "error": str(e)
        }