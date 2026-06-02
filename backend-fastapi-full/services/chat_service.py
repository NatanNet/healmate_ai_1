import os
from dotenv import load_dotenv
load_dotenv() # <--- INI KUNCI AGAR API KEY GEMINI TERBACA!

from typing import Dict, Any
from datetime import datetime, timedelta
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
    2. Hasilkan balasan EKSKLUSIF menggunakan GEMINI (DENGAN MEMORI 7 HARI)
    3. Save ke database
    """
    print(f"\n{'='*60}")
    print(f"[START] PROCESS_CHAT")
    print(f"User Message: '{message}'")
    
    try:
        db = get_db()
        
       # ==========================================
        # STEP 1: DETEKSI EMOSI DARI HUGGING FACE API
        # ==========================================
        print(f"\n[STEP 1] Memanggil Model AI ({AI_URL}/predict)...")
        emotion = "anxiety" 
        confidence = 0.0
        healing_score = 0.5 
        message_en = message
        
        #tambahan
        counselor_response = ""
        activity_suggestions = []
        
        try:
            async with httpx.AsyncClient() as client:
                # Memanggil API Hugging Face
                ai_response = await client.post(
                    f"{AI_URL}/predict", 
                    json={"text": message}, 
                    timeout=15.0 # proses kirim chat ke sistem
                )
                
                if ai_response.status_code == 200:
                    ai_result = ai_response.json()
                    emotion = ai_result.get("emotion", "anxiety").lower()
                    confidence = ai_result.get("confidence", 0.0)
                    healing_score = ai_result.get("healing_score", 0.5)
                    message_en = ai_result.get("text_english", message)
                    
                    # update 31 mei terbaru
                    counselor_response = ai_result.get("counselor_response", "")
                    activity_suggestions = ai_result.get("activity_suggestions", [])
                    
                    print(f"✓ Berhasil ambil data -> Emotion: {emotion} | Score: {healing_score}")
                else:
                    emotion, confidence = EmotionDetector.detect(message)
        except Exception as api_err:
            print(f"API Model gagal: {api_err}")
            emotion, confidence = EmotionDetector.detect(message)

        # ==========================================
        # STEP 2: BALASAN MURNI DARI GEMINI AI (DENGAN MEMORI)
        # ==========================================
        print(f"\n[STEP 2] Meminta jawaban dari Gemini...")
        intent = ChatbotEngine._detect_intent(message) # Hanya ambil intent untuk data
        ai_response_text = ""
        
        if llm_model:
            # LOGIKA MEMORI AI untuk Menyimpan history chat
            # Mengambil maksimal 50 chat dalam 7 hari terakhir sebagai konteks ingatan
            seven_days_ago = datetime.utcnow() - timedelta(days=7)
            
            recent_chats = list(db["chats"].find({
                "userId": ObjectId(user_id),
                "createdAt": {"$gte": seven_days_ago} 
            }).sort("createdAt", -1).limit(50))  # Limit 50 adalah jumlah chatnya, tak buat 50 karena supaya tidak keberatan memorinya
            
            # Membalikkan urutan agar chat terlama ada di atas, yang terbaru di bawah
            recent_chats.reverse()
            
            # Merangkai memori menjadi teks untuk dibaca Gemini
            history_text = ""
            for chat in recent_chats:
                if chat.get("intent") != "baseline": # Abaikan chat bayangan dari pop-up
                    user_msg = chat.get("userMessage", "")
                    ai_msg = chat.get("aiResponse", "")
                    history_text += f"User: {user_msg}\nHealMate: {ai_msg}\n"
            
            # Jika belum ada riwayat (user baru)
            if not history_text.strip():
                history_text = "(Ini adalah awal obrolan, belum ada riwayat)"

            # --- MENYUSUN PROMPT DENGAN MEMORI ---
            prompt = f"""
            Kamu adalah HealMate — konselor digital yang hangat, empatik, dan non-judgmental, 
            khusus mendampingi orang yang sedang pulih dari putus cinta
            Tugasmu menemani user Gen-Z yang sedang melewati masa putus cinta.
            
            Kondisi User Saat Ini:
            - Sedang merasa: {emotion}
            - Tingkat pemulihan (Healing Score): {healing_score} (0.0=hancur, 1.0=ikhlas)
            - Saran respon dari psikologi: "counselor_response" = "{counselor_response}"
            
            Konteks pengguna:
            - Emosi utama yang terdeteksi: {emotion}
            
            --- RIWAYAT OBROLAN 7 HARI TERAKHIR ---
            {history_text}
            ---------------------------------------
            
            Pesan user SEKARANG: "{message}"
            
            Instruksi Balasan:
            1. Perhatikan riwayat obrolan di atas agar nyambung. Jika user menyebut "dia", rujuk pada konteks riwayat sebelumnya.
            2. Balas dengan bahasa Indonesia sehari-hari, gunakan "aku" dan "kamu".
            3. Validasi perasaannya yang sedang dalam fase '{emotion}' itu.
            4. Panjang: 3-5 kalimat saja. Gunakan bahasa yang santai namun penuh perhatian, jangan sebut label emosi secara eksplisit. Jangan gunakan bullet point.
            5. Dimulai dengan memvalidasi perasaan mereka secara tulus (bukan klise).
            6. Menunjukkan bahwa kamu benar-benar mendengar dan memahami.
            7. Memberikan satu kalimat penyemangat yang hangat dan realistis — BUKAN toxic positivity.
            8. Terasa seperti pesan dari teman yang bijak, bukan ceramah.
            """
            
            try:
                gemini_response = await llm_model.generate_content_async(prompt)
                ai_response_text = gemini_response.text.strip()
                print(f" AI MENJAWAB: '{ai_response_text}'")
            except Exception as e:
                print(f"Gemini Error: {e}")
                ai_response_text = "Maaf ya, server lagi gangguan sebentar. Kamu mau cerita lagi?"
        else:
            ai_response_text = "API Key belum dipasang di sistem. cek .env!"

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
            "activitySuggestions": activity_suggestions, # Simpan saran aktivitas 
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
            "activitySuggestions": activity_suggestions,
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