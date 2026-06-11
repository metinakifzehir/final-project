from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.config import settings

_client: AsyncIOMotorClient | None = None


async def connect_to_mongodb() -> None:
    global _client

    _client = AsyncIOMotorClient(settings.mongodb_uri)
    await _client.admin.command("ping")


async def close_mongodb_connection() -> None:
    global _client

    if _client is not None:
        _client.close()
        _client = None


def get_client() -> AsyncIOMotorClient:
    if _client is None:
        raise RuntimeError("MongoDB baglantisi kurulmamis. Uygulama baslatilmamis olabilir.")
    return _client


def get_database() -> AsyncIOMotorDatabase:
    return get_client()[settings.mongodb_db_name]
