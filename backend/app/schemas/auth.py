from pydantic import BaseModel, Field

class RegisterRequest(BaseModel):
    full_name: str = Field(..., min_length=3, description="Kullanıcının tam adı")
    username: str = Field(..., min_length=3, description="Kullanıcı adı")
    password: str = Field(..., min_length=6, description="Şifre")

class LoginRequest(BaseModel):
    username: str = Field(..., description="Kullanıcı adı")
    password: str = Field(..., description="Şifre")

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None
