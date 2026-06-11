from fastapi import APIRouter, HTTPException
from app.schemas.recommendation import RecommendationRequest, RecommendationResponse
from app.services.recommendation_service import get_recommendations_for_user

router = APIRouter()

@router.post("/", response_model=RecommendationResponse)
async def get_recommendations(request: RecommendationRequest):
    """
    Kullanıcının konumuna, tercihlerine ve geçmişine göre restoran önerileri sunar.
    """
    recommendations, strategy = await get_recommendations_for_user(request)
    
    if not recommendations:
        # Hata döndürmek yerine boş liste ve bilgi dönebiliriz, frontend daha rahat yönetir
        return RecommendationResponse(recommendations=[], strategy_used=strategy)
    
    return RecommendationResponse(recommendations=recommendations, strategy_used=strategy)
