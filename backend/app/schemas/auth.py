from pydantic import BaseModel, Field

class RegisterRequest(BaseModel):
    author_name: str = Field(..., min_length=3, description="Yazarın tam adı")
    username: str = Field(..., min_length=3, description="Kullanıcı adı")
    password: str = Field(..., min_length=6, description="Şifre")

class LoginRequest(BaseModel):
    username: str = Field(..., description="Kullanıcı adı")
    password: str = Field(..., description="Şifre")

class UpdatePasswordRequest(BaseModel):
    username: str = Field(..., description="Güncellenecek kullanıcının adı")
    password: str = Field(..., min_length=6, description="Yeni şifre")

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None
