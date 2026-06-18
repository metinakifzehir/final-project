import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import close_mongodb_connection, connect_to_mongodb
from app.api.endpoints import recommendations, explanations, auth, restaurants, users

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Uygulama yaşam döngüsü yönetimi."""
    await connect_to_mongodb()
    yield
    await close_mongodb_connection()

# FastAPI uygulamasını oluştur
app = FastAPI(
    title="FoodieAI - Restoran Öneri Sistemi",
    description="Kullanıcı davranışlarına ve içeriğe dayalı hibrit öneri API'si.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS (Cross-Origin Resource Sharing) Ayarları
# FRONTEND_URL can be set as a Railway reference variable (e.g. ${{frontend.RAILWAY_PUBLIC_DOMAIN}})
# to dynamically resolve the frontend's public domain without hardcoding.
_frontend_url = os.getenv("FRONTEND_URL")

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://final-project-production-87cf.up.railway.app",
    "http://final-project-production-87cf.up.railway.app",
]

if _frontend_url:
    # Normalise: ensure both https and http variants are included
    _frontend_url = _frontend_url.rstrip("/")
    for _scheme in ("https://", "http://"):
        _origin = _frontend_url if _frontend_url.startswith(_scheme) else _scheme + _frontend_url.split("://")[-1]
        if _origin not in origins:
            origins.append(_origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Rotalarını (Router) dahil et
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"]) # Yeni kullanıcı router'ı
app.include_router(recommendations.router, prefix="/api/v1/recommendations", tags=["Recommendations"])
app.include_router(explanations.router, prefix="/api/v1/explanations", tags=["Explanations"])
app.include_router(restaurants.router, prefix="/api/v1/restaurants", tags=["Restaurants"])

@app.get("/", tags=["Root"])
async def root():
    """API'nin çalıştığını ve ana endpoint'leri gösteren kök dizin."""
    return {
        "message": "FoodieAI API'sine hoş geldiniz!",
        "docs_url": "/docs",
        "redoc_url": "/redoc",
    }
