from fastapi import APIRouter, HTTPException
from app.schemas.explanation import ExplanationRequest, ExplanationResponse
from app.services.llm_service import generate_explanation
from app.database import get_database

router = APIRouter()

@router.post("/", response_model=ExplanationResponse)
async def get_explanation(request: ExplanationRequest):
    """
    Belirli bir restoranın kullanıcıya neden önerildiğini LLM kullanarak açıklar.
    """
    db = get_database()
    
    # Restoranı veritabanından bul (Artık place_id kullanıyoruz)
    restaurant = await db.restaurants.find_one({"place_id": request.restaurant_id})
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restoran bulunamadı.")
        
    # Kullanıcı profilini çek (eğer user_id varsa)
    user_profile = {"user_id": request.user_id, "preferences": []}
    if request.user_id:
        user = await db.users.find_one({"author_link": request.user_id})
        if user:
            # Kullanıcının daha önceki yorumlarına bakarak veya favori kategorilerine bakarak eklenebilir
            user_profile["preferences"] = user.get("favorite_categories", [])
            
    # LLM servisini çağır
    explanation = await generate_explanation(
        user_profile=user_profile, 
        restaurant=restaurant, 
        distance_km=request.distance_km
    )
    
    return ExplanationResponse(**explanation)
