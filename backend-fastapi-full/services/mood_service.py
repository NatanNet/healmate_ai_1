from datetime import datetime, timedelta, timezone
from collections import Counter
from bson import ObjectId
from database.mongodb import get_db

async def calculate_weekly_emotion(user_id: str, weeks_ago: int = 0):
    db = get_db()
    
    # =======================================================
    # LOGIKA KALENDER MINGGUAN (Bukan sekadar 7 hari ke belakang)
    # =======================================================
    # 1. Tentukan waktu saat ini di zona waktu WIB (UTC+7)
    tz_wib = timezone(timedelta(hours=7))
    now_wib = datetime.now(tz_wib)
    
    # 2. Hitung mundur minggu berdasarkan parameter dari React
    target_date_wib = now_wib - timedelta(weeks=weeks_ago)
    
    # 3. Kunci Hari SENIN (awal minggu) pada jam 00:00:00 WIB
    start_of_week_wib = target_date_wib - timedelta(days=target_date_wib.weekday())
    start_of_week_wib = start_of_week_wib.replace(hour=0, minute=0, second=0, microsecond=0)
    
    # 4. Kunci Hari MINGGU (akhir minggu) pada jam 23:59:59 WIB
    end_of_week_wib = start_of_week_wib + timedelta(days=6, hours=23, minutes=59, seconds=59)

    # 5. Konversi kembali ke UTC karena MongoDB menyimpan data dalam UTC
    start_utc = start_of_week_wib.astimezone(timezone.utc).replace(tzinfo=None)
    end_utc = end_of_week_wib.astimezone(timezone.utc).replace(tzinfo=None)

    # Query menggunakan batasan tanggal dari Senin sampai Minggu
    cursor = db["chats"].find({
        "userId": ObjectId(user_id),
        "createdAt": {
            "$gte": start_utc,
            "$lte": end_utc
        },
        "intent": {"$ne": "baseline"} # Typo 'inten' diperbaiki jadi 'intent'
    })
    
    chats = list(cursor)

    days_map = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']
    weekly_data = {day: [] for day in days_map}

    # Kelompokkan emosi berdasarkan hari
    for chat in chats:
        emotion = chat.get("emotion")
        created_at = chat.get("createdAt") 
        
        if emotion and created_at:
            # Wajib ditambah 7 jam agar akurat dengan jam WIB 
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
            
            # Persentase dominan (Contoh: 5 Acceptance / 10 Total * 100 = 50%)
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