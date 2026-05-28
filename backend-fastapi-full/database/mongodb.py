from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError
from config import MONGODB_URI

# agar koneksi tidak dibuat berulang kali
client = None
db = None



def get_db():

    global client
    global db

    try:

        if client is None:

            client = MongoClient(

                MONGODB_URI,

                serverSelectionTimeoutMS=5000  # koneksi MongoDB time out 5 detik
            )

            client.admin.command(   # cek mongodb apakah terbuhung
                "ping"
            )

            db = client[
                "healmate"   # database mongodb
            ]

        return db


    except ServerSelectionTimeoutError:

        raise Exception(

            "MongoDB server connection timeout"

        )

    except Exception as e:

        raise Exception(

            f"MongoDB connection failed: {str(e)}"
        )