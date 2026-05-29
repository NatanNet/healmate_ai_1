from datetime import datetime, timezone
from database.mongodb import get_db

async def create_timecapsule_service(user_id: str, data: dict):
    """Fungsi untuk menyimpan kapsul baru ke MongoDB menggunakan PyMongo"""
    db = get_db()
    # Menggunakan koleksi timecapsules'
    collection = db.timecapsules 
    
    # Menyiapkan kerangka data sesuai model
    new_capsule = {
        "userId": user_id,
        "title": data["title"],
        "content": data["content"],
        "openDate": data["openDate"], 
        "tags": data.get("tags", []),
        "isOpened": False,
        "createdAt": datetime.now(timezone.utc),
        "openedAt": None
    }
    
    # 1. MENYIMPAN DATA (Tanpa await karena pakai PyMongo)
    result = collection.insert_one(new_capsule)
    
    # Format ulang agar ID dari MongoDB (_id) bisa dibaca oleh Frontend (id)
    new_capsule["id"] = str(result.inserted_id)
    new_capsule["_id"] = str(result.inserted_id) 
    
    return new_capsule

async def get_user_timecapsules_service(user_id: str):
    """Fungsi untuk mengambil semua kapsul milik user menggunakan PyMongo"""
    db = get_db()
    collection = db.timecapsules
    
    # 2. MENGAMBIL DATA (Tanpa await karena pakai PyMongo)
    cursor = collection.find({"userId": user_id}).sort("createdAt", -1)
    
    capsules = []
    # Melakukan perulangan langsung pada cursor
    for doc in cursor:
        doc["id"] = str(doc["_id"])
        del doc["_id"] # Hapus _id asli MongoDB agar sesuai schema Pydantic
        capsules.append(doc)
        
    return capsules