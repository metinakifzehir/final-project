import math
from typing import Tuple, List, Dict, Any
from app.database import get_database
from app.schemas.recommendation import RecommendationRequest, RestaurantResponse

# --- Puanlama Fonksiyonları ---

async def get_user_preferred_categories(db, user_id: str) -> set:
    """
    Kullanıcının yüksek puan (>= 4 yıldız) verdiği yorumlara dayanarak
    tercih ettiği kategorileri bulan yardımcı fonksiyon.
    """
    if not user_id:
        return set()

    # Kullanıcının yüksek puanlı yorumlarını bul
    high_rated_reviews_cursor = db.reviews.find(
        {"user_link": user_id, "rating": {"$gte": 4}},
        {"place_id": 1, "_id": 0}
    )
    # Bu yorumlardaki restoranların place_id'lerini topla (en fazla 100 yorum)
    high_rated_place_ids = [review['place_id'] for review in await high_rated_reviews_cursor.to_list(length=100)]

    if not high_rated_place_ids:
        return set()

    # Bu restoranların kategorilerini veritabanından çek
    restaurants_cursor = db.restaurants.find(
        {"place_id": {"$in": high_rated_place_ids}},
        {"category": 1, "_id": 0}
    )
    
    # Kategorileri bir set olarak topla
    preferred_categories = {
        restaurant['category'] 
        for restaurant in await restaurants_cursor.to_list(length=100) 
        if 'category' in restaurant
    }
    
    return preferred_categories

async def get_content_based_filtering_score(candidate_restaurant: dict, preferred_categories: set) -> float:
    """
    İçerik Tabanlı Filtreleme (CBF) skorunu hesaplar.
    Bu skor, restoranın kategorisinin kullanıcının geçmişte beğendiği
    restoranların kategorileriyle ne kadar eşleştiğine dayanır.
    """
    candidate_category = candidate_restaurant.get("category")
    if not candidate_category:
        return 0.1  # Restoranın kategorisi yoksa düşük puan ver

    if not preferred_categories:
        # Yeni kullanıcı veya hiç yüksek puanlı yorumu yoksa, nötr bir skor dön.
        return 0.5

    if candidate_category in preferred_categories:
        return 1.0  # Kategori tam eşleşiyorsa en yüksek puan
    else:
        return 0.2  # Eşleşmiyorsa düşük puan

async def get_collaborative_filtering_score(db, user_id: str, candidate_restaurant_id: str) -> float:
    """
    Basitleştirilmiş kullanıcı-tabanlı İşbirlikçi Filtreleme (CF) skorunu hesaplar.
    Aday restoranı puanlayan en benzer kullanıcının verdiği puana göre bir skor üretir.
    """
    # 1. Aday restoran için yapılmış tüm yorumları bul
    candidate_reviews_cursor = db.reviews.find(
        {"place_id": candidate_restaurant_id},
        {"user_link": 1, "rating": 1, "_id": 0}
    )
    candidate_reviews = await candidate_reviews_cursor.to_list(length=500)

    if not candidate_reviews:
        return 0.5  # Restoran hiç yorum almamışsa nötr skor

    # Aday restoranı puanlayan kullanıcıları ve verdikleri puanları bir map'te sakla
    raters_of_candidate = {review['user_link']: review['rating'] for review in candidate_reviews}

    # 2. Ana kullanıcımızın daha önce puanladığı tüm restoranları bul
    target_user_reviews_cursor = db.reviews.find({"user_link": user_id}, {"place_id": 1, "_id": 0})
    target_user_places = {review['place_id'] for review in await target_user_reviews_cursor.to_list(length=500)}

    if not target_user_places:
        return 0.5  # Ana kullanıcı hiç yorum yapmamışsa nötr skor

    # 3. Aday restoranı puanlayanlar arasından en benzer kullanıcıyı bul
    most_similar_user_id = None
    max_common_reviews = 0

    # Veritabanı yükünü azaltmak için tüm potansiyel benzer kullanıcıların yorumlarını tek seferde çek
    all_raters_reviews_cursor = db.reviews.find(
        {"user_link": {"$in": list(raters_of_candidate.keys())}},
        {"user_link": 1, "place_id": 1, "_id": 0}
    )
    
    # Yorumları kullanıcı bazında grupla
    raters_reviews_map = {}
    for review in await all_raters_reviews_cursor.to_list(length=2000):
        rater_id = review['user_link']
        if rater_id not in raters_reviews_map:
            raters_reviews_map[rater_id] = set()
        raters_reviews_map[rater_id].add(review['place_id'])

    # En benzer kullanıcıyı bulmak için döngü
    for rater_id, rater_places in raters_reviews_map.items():
        if rater_id == user_id:
            continue  # Kendisiyle karşılaştırma
        
        common_reviews_count = len(target_user_places.intersection(rater_places))
        
        if common_reviews_count > max_common_reviews:
            max_common_reviews = common_reviews_count
            most_similar_user_id = rater_id

    # 4. En benzer kullanıcının verdiği puana göre skoru hesapla
    if most_similar_user_id and max_common_reviews > 0:
        predicted_rating = raters_of_candidate[most_similar_user_id]
        # Puanı (1-5) 0.0-1.0 aralığına normalize et
        return (predicted_rating - 1) / 4.0
    else:
        # Benzer kullanıcı bulunamazsa, restoranın ortalama puanını kullan
        restaurant_doc = await db.restaurants.find_one({"place_id": candidate_restaurant_id}, {"rating": 1})
        if restaurant_doc and 'rating' in restaurant_doc:
            avg_rating = restaurant_doc['rating']
            return (avg_rating - 1) / 4.0
        return 0.5 # Hiçbir bilgi yoksa nötr skor

# --- Yardımcı Fonksiyonlar ---

def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0
    lat1_rad, lon1_rad, lat2_rad, lon2_rad = map(math.radians, [lat1, lon1, lat2, lon2])
    dlon = lon2_rad - lon1_rad
    dlat = lat2_rad - lat1_rad
    a = math.sin(dlat / 2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

async def get_user_review_count(db, user_link: str) -> int:
    if not user_link:
        return 0
    return await db.reviews.count_documents({"user_link": user_link})

# --- Ana Öneri Fonksiyonu ---

async def get_recommendations_for_user(request: RecommendationRequest) -> Tuple[List[RestaurantResponse], str]:
    db = get_database()
    
    # 1. Strateji ve Kullanıcı Profili Hazırlama
    user_review_count = await get_user_review_count(db, request.user_id)
    preferred_categories = await get_user_preferred_categories(db, request.user_id)
    
    if user_review_count < 3:
        strategy, alpha = "Strateji B (Soğuk Başlatma - Popülerlik & İçerik)", 0.0
    elif user_review_count < 10:
        strategy, alpha = "Strateji A (Hafif Hibrit)", 0.3
    elif user_review_count < 20:
        strategy, alpha = "Strateji A (Güçlü Hibrit)", 0.6
    else:
        strategy, alpha = "Strateji A (Baskın CF)", 0.75

    # 2. Aday Restoranları Filtreleme
    lat_degree_per_km = 1 / 111.0
    lon_degree_per_km = 1 / (111.0 * math.cos(math.radians(request.latitude)))
    
    min_lat, max_lat = request.latitude - (request.radius_km * lat_degree_per_km), request.latitude + (request.radius_km * lat_degree_per_km)
    min_lon, max_lon = request.longitude - (request.radius_km * lon_degree_per_km), request.longitude + (request.radius_km * lon_degree_per_km)

    query: Dict[str, Any] = {
        "latitude": {"$gte": min_lat, "$lte": max_lat},
        "longitude": {"$gte": min_lon, "$lte": max_lon}
    }
    
    if request.categories:
        query["category"] = {"$regex": "|".join(request.categories), "$options": "i"}
    if request.min_rating:
        query["rating"] = {"$gte": request.min_rating}

    candidates = await db.restaurants.find(query).limit(500).to_list(length=500)
    
    scored_restaurants = []
    for doc in candidates:
        distance = calculate_distance(request.latitude, request.longitude, doc.get("latitude", 0.0), doc.get("longitude", 0.0))
        
        if distance > request.radius_km:
            continue
            
        # 3. Puanlama
        # Popülerlik skorunu normalize etmek için logaritmik ölçek kullanalım
        raw_popularity = doc.get("rating_count", 0)
        popularity_score = math.log1p(raw_popularity) / 10.0 if raw_popularity > 0 else 0.0
        popularity_score = min(popularity_score, 1.0)
        
        # ML Modeli Entegrasyonu
        cf_score = await get_collaborative_filtering_score(db, request.user_id, doc.get("place_id"))
        cbf_score = await get_content_based_filtering_score(doc, preferred_categories)
        
        beta = 0.1
        final_score = (alpha * cf_score) + ((1 - alpha) * cbf_score) + (beta * popularity_score)
        
        scored_restaurants.append({"doc": doc, "score": final_score, "distance": distance})

    # 4. Sıralama ve Sonuçları Hazırlama
    scored_restaurants.sort(key=lambda x: x["score"], reverse=True)
    top_candidates = scored_restaurants[:request.top_k]
    
    response_list = [
        RestaurantResponse(
            id=item["doc"].get("place_id", ""),
            name=item["doc"].get("google_name", item["doc"].get("original_name", "Bilinmeyen")),
            category=item["doc"].get("category", "Genel"),
            rating=item["doc"].get("rating", 0.0),
            distance_km=round(item["distance"], 2),
            is_open=(item["doc"].get("business_status") == "OPERATIONAL")
        ) for item in top_candidates
    ]

    return response_list, strategy
