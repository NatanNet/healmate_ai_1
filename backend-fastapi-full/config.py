import os
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb+srv://healmate_user:zujiqQ6BH1e3Cee2@cluster0.hpjnij3.mongodb.net/healmate?retryWrites=true&w=majority")
APP_NAME = "HealMate API"
DEBUG = os.getenv("DEBUG", "false").lower() == "true"
