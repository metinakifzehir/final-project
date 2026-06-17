from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import close_mongodb_connection, connect_to_mongodb
from app.api.endpoints import recommendations, explanations, auth

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
# Frontend'in (React) backend'e (FastAPI) erişebilmesi için gereklidir.
origins = [
    "http://localhost:5173",  # React geliştirme sunucusunun varsayılan adresi
    "http://localhost:3000",  # Alternatif React geliştirme adresi
    # "https://your-production-frontend-url.com", # Eğer canlıya çıkarsanız buraya ekleyin
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Tüm metodlara (GET, POST, vb.) izin ver
    allow_headers=["*"],  # Tüm başlıklara izin ver
)

# API Rotalarını (Router) dahil et
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(recommendations.router, prefix="/api/v1/recommendations", tags=["Recommendations"])
app.include_router(explanations.router, prefix="/api/v1/explanations", tags=["Explanations"])

@app.get("/", tags=["Root"])
async def root():
    """API'nin çalıştığını ve ana endpoint'leri gösteren kök dizin."""
    return {
        "message": "FoodieAI API'sine hoş geldiniz!",
        "docs_url": "/docs",
        "redoc_url": "/redoc",
    }
