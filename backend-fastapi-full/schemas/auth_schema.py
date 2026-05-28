from pydantic import BaseModel

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str
    fullName: str


class LoginRequest(BaseModel):
    email: str
    password: str