# class User:

#     username:str
#     email:str
#     password:str
#     fullName:str

from datetime import datetime

class User:
    """Model untuk koleksi users di MongoDB"""
    
    def __init__(self, 
                 username: str, 
                 email: str, 
                 password_hash: str, 
                 full_name: str):
        self.username = username
        self.email = email
        self.password_hash = password_hash
        self.full_name = full_name
        self.created_at = datetime.utcnow()
    
    def to_dict(self):
        """Convert ke dictionary untuk di-insert ke MongoDB"""
        return {
            "username": self.username,
            "email": self.email,
            "password": self.password_hash, # Disimpan dalam bentuk hash rahasia
            "fullName": self.full_name,
            "createdAt": self.created_at
        }