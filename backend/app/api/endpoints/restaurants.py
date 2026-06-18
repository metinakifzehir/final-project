from fastapi import APIRouter, Query, HTTPException
from typing import List, Optional
from app.database import get_database
from app.schemas.recommendation import RestaurantResponse
from app.schemas.restaurant import RestaurantDetailResponse, ReviewResponse
import math

router = APIRouter()

@router.get("/search", response_model=List[RestaurantResponse])
async def search_restaurants(
    query: str = Query(..., min_length=2, description="Aranacak restoran adı parçası"),
    latitude: float = Query(..., description="Kullanıcının enlem konumu"),
    longitude: float = Query(..., description="Kullanıcının boylam konumu"),
    radius_km: float = Query(10.0, description="Arama yapılacak maksimum yarıçap (km)"),
    categories: Optional[List[str]] = Query(None, description="Filtrelenecek kategoriler"),
    min_rating: Optional[float] = Query(None, ge=1.0, le=5.0, description="Minimum Google puanı"),
    min_reviews: Optional[int] = Query(None, ge=0, description="Minimum yorum sayısı")
):
    """
    Veritabanında restoran adına ve diğer filtrelere göre arama yapar.
    """
    db = get_database()
    
    geo_query_point = {"type": "Point", "coordinates": [longitude, latitude]}
    query_filter = {
        "google_name": {"$regex": query, "$options": "i"},
        "location": {
            "$nearSphere": {
                "$geometry": geo_query_point,
                "$maxDistance": radius_km * 1000
            }
        }
    }

    # Ek filtreleri sorguya ekle
    if categories:
        query_filter["category"] = {"$in": categories}
    if min_rating is not None:
        query_filter["rating"] = {"$gte": min_rating}
    if min_reviews is not None:
        query_filter["rating_count"] = {"$gte": min_reviews}

    restaurants_cursor = db.restaurants.find(query_filter).limit(20)
    restaurants = await restaurants_cursor.to_list(length=20)
    
    response_list = []
    for doc in restaurants:
        distance = math.sqrt((doc.get("latitude", 0) - latitude)**2 + (doc.get("longitude", 0) - longitude)**2) * 111.0
        response_list.append(
            RestaurantResponse(
                id=doc.get("place_id", ""),
                name=doc.get("google_name", "Bilinmeyen"),
                category=doc.get("category", "Genel"),
                rating=doc.get("rating", 0.0),
                rating_count=doc.get("rating_count", 0),
                distance_km=round(distance, 2),
                is_open=(doc.get("business_status") == "OPERATIONAL")
            )
        )
    return response_list

@router.get("/{place_id}", response_model=RestaurantDetailResponse)
async def get_restaurant_details(place_id: str):
    db = get_database()
    restaurant = await db.restaurants.find_one({"place_id": place_id})
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restoran bulunamadı.")
        
    reviews_cursor = db.reviews.find({"place_id": place_id}).sort("time", -1).limit(50)
    reviews = await reviews_cursor.to_list(length=50)
    
    user_links = [rev.get("user_link") for rev in reviews if rev.get("user_link")]
    users_map = {}
    if user_links:
        users_cursor = db.users.find({"author_link": {"$in": user_links}})
        users_map = {user["author_link"]: user.get("author_name", "Bilinmeyen") async for user in users_cursor}

    review_responses = []
    for rev in reviews:
        user_link = rev.get("user_link")
        author_name = users_map.get(user_link, "Bilinmeyen Kullanıcı")
        review_responses.append(
            ReviewResponse(
                author_name=author_name,
                rating=rev.get("rating", 0),
                text=rev.get("review_text", ""),
                time_description=rev.get("time_description", "recently")
            )
        )
    
    return RestaurantDetailResponse(
        id=restaurant.get("place_id", ""),
        name=restaurant.get("google_name", "Bilinmeyen"),
        category=restaurant.get("category", "Genel"),
        rating=restaurant.get("rating", 0.0),
        rating_count=restaurant.get("rating_count", 0),
        address=restaurant.get("address", "Adres bilgisi yok"),
        phone_number=restaurant.get("phone_number", "Telefon bilgisi yok"),
        is_open=(restaurant.get("business_status") == "OPERATIONAL"),
        reviews=review_responses
    )
