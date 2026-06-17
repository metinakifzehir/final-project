import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# .env dosyasını yükle
load_dotenv()

class Settings(BaseSettings):
    # MongoDB Ayarları
    mongodb_uri: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017/")
    mongodb_db_name: str = os.getenv("MONGODB_DB_NAME", "restaurantsdb")

    # Gemini ve Redis Ayarları
    gemini_api_key: str | None = os.getenv("GEMINI_API_KEY")
    redis_url: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    
    # JWT Ayarları
    # Güçlü bir gizli anahtar oluşturmak için terminalde `openssl rand -hex 32` komutunu kullanabilirsiniz.
    jwt_secret_key: str = os.getenv("JWT_SECRET_KEY", "default_super_secret_key_for_development")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
