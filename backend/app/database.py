from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.config import settings

class DB:
    client: AsyncIOMotorClient = None
    db: AsyncIOMotorDatabase = None

db_manager = DB()

async def connect_to_mongodb():
    """Veritabanı bağlantısını başlatır."""
    db_manager.client = AsyncIOMotorClient(settings.mongodb_uri)
    db_manager.db = db_manager.client[settings.mongodb_db_name]
    print(f"MongoDB'ye bağlandı: {settings.mongodb_db_name}")

async def close_mongodb_connection():
    """Veritabanı bağlantısını kapatır."""
    db_manager.client.close()
    print("MongoDB bağlantısı kapatıldı.")

def get_database() -> AsyncIOMotorDatabase:
    """Aktif veritabanı nesnesini döndürür."""
    return db_manager.db
