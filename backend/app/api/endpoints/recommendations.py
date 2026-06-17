from fastapi import APIRouter, Depends
from app.schemas.recommendation import RecommendationRequest, RecommendationResponse
from app.services.recommendation_service import get_recommendations_for_user
from app.api.dependencies import get_current_user

router = APIRouter()

@router.post("/", response_model=RecommendationResponse)
async def get_recommendations(
    request: RecommendationRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Kullanıcının konumuna, tercihlerine ve geçmişine göre restoran önerileri sunar.
    Bu endpoint korunmaktadır ve geçerli bir JWT gerektirir.
    """
    # İstekteki user_id'yi, token'dan gelen güvenilir kullanıcı adı ile değiştir.
    request.user_id = current_user["username"]
    
    recommendations, strategy = await get_recommendations_for_user(request)
    
    return RecommendationResponse(recommendations=recommendations, strategy_used=strategy)
