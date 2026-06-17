from fastapi import APIRouter, HTTPException, Depends
from app.schemas.explanation import ExplanationRequest, ExplanationResponse
from app.services.llm_service import generate_explanation
from app.database import get_database
from app.api.dependencies import get_current_user_optional

router = APIRouter()

@router.post("/", response_model=ExplanationResponse)
async def get_explanation(
    request: ExplanationRequest,
    current_user: dict | None = Depends(get_current_user_optional)
):
    """
    Belirli bir restoranın kullanıcıya neden önerildiğini LLM kullanarak açıklar.
    Geçerli bir token sağlanırsa, kullanıcının profili zenginleştirilir.
    """
    db = get_database()
    
    restaurant = await db.restaurants.find_one({"place_id": request.restaurant_id})
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restoran bulunamadı.")
        
    # Kullanıcı profili oluştur
    user_profile = {"user_id": "anonymous", "preferences": []}
    
    if current_user:
        # Eğer token ile bir kullanıcı geldiyse, profili onun bilgileriyle doldur
        user_profile["user_id"] = current_user["username"]
        
        # TODO: Kullanıcının favori kategorilerini veya geçmiş beğenilerini
        # veritabanından çekip 'preferences' alanını doldur.
        # Örnek: user_profile["preferences"] = await get_user_preferred_categories(db, current_user["username"])

    # LLM servisini çağır
    explanation = await generate_explanation(
        user_profile=user_profile, 
        restaurant=restaurant, 
        distance_km=request.distance_km
    )
    
    return ExplanationResponse(**explanation)
