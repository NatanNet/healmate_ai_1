from datetime import datetime, timedelta
from collections import Counter
from bson import ObjectId
from database.mongodb import get_db

async def calculate_weekly_emotion(user_id: str):
    # 1. Panggil koneksi database sesuai standar di chat_service.py
    db = get_db()
    
    # 2. Tentukan batas waktu (7 hari ke belakang dari hari ini)
    seven_days_ago = datetime.utcnow() - timedelta(days=7)

    # 3. Ambil data dari MongoDB
    # PENTING: Gunakan 'userId' dengan ObjectId dan 'createdAt' sesuai struktur insert di chat_service.py
    cursor = db["chats"].find({
        "userId": ObjectId(user_id),
        # "userId": user_id,
        "createdAt": {"$gte": seven_days_ago}
    })
    
    # Eksekusi kursor menjadi list (karena kamu menggunakan PyMongo standard/sinkron)
    chats = list(cursor)

    # 4. Siapkan struktur hari (0 = Senin, 6 = Minggu)
    days_map = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']
    weekly_data = {day: [] for day in days_map}

    # 5. Kelompokkan emosi berdasarkan hari
    for chat in chats:
        emotion = chat.get("emotion")
        created_at = chat.get("createdAt") # Sesuai dengan field di DB
        
        if emotion and created_at:
            day_name = days_map[created_at.weekday()]
            weekly_data[day_name].append(emotion.lower())

    # 6. Format hasil akhir untuk Frontend
    result = []
    for day in days_map:
        emotions_today = weekly_data[day]
        
        if emotions_today:
            # Ambil emosi yang paling sering muncul di hari tersebut
            most_common_emotion = Counter(emotions_today).most_common(1)[0][0]
            
            # Hitung persentase dinamis (misal: nilai dasar 40%, tiap 1 chat tambah 15%, maks 100%)
            dynamic_height = min(100, 40 + (len(emotions_today) * 15))
            
            result.append({
                "day": day,
                "height": dynamic_height,
                "type": most_common_emotion
            })
        else:
            # Jika tidak ada chat di hari itu
            result.append({
                "day": day,
                "height": 0,
                "type": "empty"
            })

    return result