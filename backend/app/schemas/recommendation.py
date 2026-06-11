from pydantic import BaseModel, Field
from typing import List, Optional

class RecommendationRequest(BaseModel):
    user_id: Optional[str] = Field(default=None, description="Kullanıcı kimliği (opsiyonel, soğuk başlatma için)")
    latitude: float = Field(..., description="Kullanıcının enlem konumu")
    longitude: float = Field(..., description="Kullanıcının boylam konumu")
    radius_km: float = Field(default=1.0, ge=0.5, le=5.0, description="Arama yarıçapı (km)")
    categories: Optional[List[str]] = Field(default=None, description="Filtrelenecek kategoriler")
    min_rating: Optional[float] = Field(default=3.5, ge=1.0, le=5.0, description="Minimum Google puanı")
    top_k: int = Field(default=5, ge=3, le=20, description="Döndürülecek sonuç sayısı")

class RestaurantResponse(BaseModel):
    id: str
    name: str
    category: str
    rating: float
    distance_km: float
    is_open: Optional[bool] = None
    
class RecommendationResponse(BaseModel):
    recommendations: List[RestaurantResponse]
    strategy_used: str = Field(description="Kullanılan öneri stratejisi (örn: Strateji A - Hibrit, Strateji B - Popülerlik)")
