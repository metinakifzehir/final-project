from fastapi import APIRouter, Depends
from typing import List
from app.database import get_database
from app.schemas.user import UserReviewResponse
from app.api.dependencies import get_current_user

router = APIRouter()

@router.get("/me/reviews", response_model=List[UserReviewResponse])
async def get_my_reviews(current_user: dict = Depends(get_current_user)):
    """
    Giriş yapmış kullanıcının geçmiş tüm yorumlarını ve puanlamalarını getirir.
    """
    db = get_database()
    user_id = current_user["username"]
    
    query = {"user_link": {"$regex": str(user_id)}}
    reviews_cursor = db.reviews.find(query).sort("time", -1)
    reviews = await reviews_cursor.to_list(length=200)
    
    place_ids = [rev.get("place_id") for rev in reviews if rev.get("place_id")]
    restaurants_map = {}
    if place_ids:
        restaurants_cursor = db.restaurants.find({"place_id": {"$in": place_ids}}, {"place_id": 1, "google_name": 1})
        restaurants_map = {r["place_id"]: r.get("google_name", "Bilinmeyen Restoran") async for r in restaurants_cursor}

    response_list = []
    for rev in reviews:
        place_id = rev.get("place_id")
        if not place_id: continue # place_id yoksa bu yorumu atla

        response_list.append(
            UserReviewResponse(
                restaurant_id=place_id, # Yanıta restaurant_id'yi ekle
                restaurant_name=restaurants_map.get(place_id, "Bilinmeyen Restoran"),
                rating=rev.get("rating", 0),
                text=rev.get("review_text", ""),
                time_description=rev.get("time_description", "recently")
            )
        )
    
    return response_list
