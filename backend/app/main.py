from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.config import settings
from app.database import close_mongodb_connection, connect_to_mongodb, get_database
from app.api.endpoints import recommendations, explanations

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongodb()
    yield
    await close_mongodb_connection()


app = FastAPI(
    title="LLM Tabanli Restoran Oneri Sistemi",
    description="Ankara il merkezi odakli hibrit oneri API",
    version="0.1.0",
    lifespan=lifespan,
)

app.include_router(recommendations.router, prefix="/api/v1/recommendations", tags=["Recommendations"])
app.include_router(explanations.router, prefix="/api/v1/explanations", tags=["Explanations"])

@app.get("/health")
async def health_check():
    db = get_database()
    await db.command("ping")
    collections = await db.list_collection_names()

    return {
        "status": "ok",
        "database": settings.mongodb_db_name,
        "collections": len(collections),
    }


@app.get("/")
async def root():
    return {
        "message": "Restoran Oneri Sistemi API",
        "docs": "/docs",
        "health": "/health",
    }
