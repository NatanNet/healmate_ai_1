from datetime import datetime, timedelta
from collections import Counter
from bson import ObjectId
from database.mongodb import get_db

async def calculate_weekly_emotion(user_id: str):
    db = get_db()
    
    # Ambil waktu 7 hari ke belakang
    seven_days_ago = datetime.utcnow() - timedelta(days=7)

    cursor = db["chats"].find({
        "userId": ObjectId(user_id),
        "createdAt": {"$gte": seven_days_ago}
    })
    
    chats = list(cursor)

    days_map = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']
    weekly_data = {day: [] for day in days_map}

    # Kelompokkan emosi berdasarkan hari
    for chat in chats:
        emotion = chat.get("emotion")
        created_at = chat.get("createdAt") 
        
        if emotion and created_at:
            # Wajib ditambah 7 jam agar akurat dengan jam WIB (Gen-Z Indonesia)
            dt_wib = created_at + timedelta(hours=7)
            day_name = days_map[dt_wib.weekday()]
            weekly_data[day_name].append(emotion.lower())

    result = []
    for day in days_map:
        emotions_today = weekly_data[day]
        
        if emotions_today:
            total_chat = len(emotions_today)
            
            # Hitung kemunculan tiap emosi
            hitung_emosi = Counter(emotions_today)
            most_common_emotion, jumlah_muncul = hitung_emosi.most_common(1)[0]
            
            # LOGIKA BARU: Persentase dominan (Contoh: 5 Acceptance / 10 Total * 100 = 50%)
            persentase_dominan = round((jumlah_muncul / total_chat) * 100)
            
            result.append({
                "day": day,
                "height": persentase_dominan,
                "type": most_common_emotion
            })
        else:
            result.append({
                "day": day,
                "height": 0,
                "type": "empty"
            })

    return result