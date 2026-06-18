import math
from typing import Tuple, List, Dict, Any
from app.database import get_database
from app.schemas.recommendation import RecommendationRequest, RestaurantResponse
import asyncio

async def get_user_preferred_categories(db, user_id: str) -> set:
    if not user_id: return set()
    pipeline = [
        {"$match": {"user_link": user_id, "rating": {"$gte": 4}}},
        {"$limit": 100},
        {"$lookup": {"from": "restaurants", "localField": "place_id", "foreignField": "place_id", "as": "r_info"}},
        {"$unwind": "$r_info"},
        {"$group": {"_id": "$r_info.category"}}
    ]
    result = await db.reviews.aggregate(pipeline).to_list(length=50)
    return {item['_id'] for item in result if item['_id']}

async def get_content_based_filtering_score(candidate_restaurant: dict, preferred_categories: set) -> float:
    candidate_category = candidate_restaurant.get("category")
    if not candidate_category or not preferred_categories: return 0.5
    return 1.0 if candidate_category in preferred_categories else 0.2

async def get_batch_collaborative_filtering_scores(db, user_id: str, candidate_ids: List[str]) -> Dict[str, float]:
    if not user_id or not candidate_ids: return {}
    target_user_reviews_cursor = db.reviews.find({"user_link": user_id}, {"place_id": 1, "_id": 0})
    target_user_places = {review['place_id'] for review in await target_user_reviews_cursor.to_list(length=500)}
    if not target_user_places: return {}
    pipeline = [
        {"$match": {"place_id": {"$in": candidate_ids}}},
        {"$lookup": {"from": "reviews", "localField": "user_link", "foreignField": "user_link", "as": "similar_user_reviews"}},
        {"$unwind": "$similar_user_reviews"},
        {"$match": {"similar_user_reviews.place_id": {"$in": list(target_user_places)}}},
        {"$group": {
            "_id": {"candidate_id": "$place_id", "similar_user_id": "$user_link"},
            "rating_by_similar_user": {"$first": "$rating"},
            "common_reviews_count": {"$sum": 1}
        }},
        {"$sort": {"common_reviews_count": -1}},
        {"$group": {
            "_id": "$_id.candidate_id",
            "most_similar_user_rating": {"$first": "$rating_by_similar_user"}
        }}
    ]
    results = await db.reviews.aggregate(pipeline).to_list(length=2000)
    return {item['_id']: (item['most_similar_user_rating'] - 1) / 4.0 for item in results}

async def get_recommendations_for_user(request: RecommendationRequest) -> Tuple[List[RestaurantResponse], str]:
    db = get_database()
    user_review_count_task = db.reviews.count_documents({"user_link": request.user_id})
    preferred_categories_task = get_user_preferred_categories(db, request.user_id)
    user_review_count, preferred_categories = await asyncio.gather(user_review_count_task, preferred_categories_task)
    
    if user_review_count < 3: strategy, alpha = "Strateji B (Popülerlik & İçerik)", 0.0
    else: strategy, alpha = "Strateji A (Hibrit: CF & İçerik & Popülerlik)", 0.5

    geo_query_point = {"type": "Point", "coordinates": [request.longitude, request.latitude]}
    query = {
        "location": {"$nearSphere": {"$geometry": geo_query_point, "$maxDistance": request.radius_km * 1000}},
        "rating": {"$gte": request.min_rating}
    }
    if request.categories: query["category"] = {"$in": request.categories}

    candidates = await db.restaurants.find(query).limit(200).to_list(length=200)
    if not candidates: return [], "Filtrelere uyan sonuç bulunamadı."

    candidate_ids = [c.get("place_id") for c in candidates]
    cf_scores = await get_batch_collaborative_filtering_scores(db, request.user_id, candidate_ids)
    
    scored_restaurants = []
    for doc in candidates:
        place_id = doc.get("place_id")
        popularity_score = math.log1p(doc.get("rating_count", 0)) / 10.0
        cbf_score = await get_content_based_filtering_score(doc, preferred_categories)
        cf_score = cf_scores.get(place_id, (doc.get("rating", 3.0) - 1) / 4.0)
        final_score = (alpha * cf_score) + ((1 - alpha) * cbf_score) + (0.1 * popularity_score)
        scored_restaurants.append({"doc": doc, "score": final_score})

    scored_restaurants.sort(key=lambda x: x["score"], reverse=True)
    top_candidates = scored_restaurants[:request.top_k]
    
    response_list = []
    for item in top_candidates:
        doc = item["doc"]
        distance = math.sqrt((doc.get("latitude", 0) - request.latitude)**2 + (doc.get("longitude", 0) - request.longitude)**2) * 111.0
        response_list.append(RestaurantResponse(
            id=doc.get("place_id", ""),
            name=doc.get("google_name", "Bilinmeyen"),
            category=doc.get("category", "Genel"),
            rating=doc.get("rating", 0.0),
            rating_count=doc.get("rating_count", 0), # rating_count eklendi
            distance_km=round(distance, 2),
            is_open=(doc.get("business_status") == "OPERATIONAL")
        ))
    return response_list, strategy
