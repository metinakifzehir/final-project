import math
from typing import Tuple, List, Dict, Any
from app.database import get_database
from app.schemas.recommendation import RecommendationRequest, RestaurantResponse

# Yardımcı fonksiyon: Dünya üzerindeki iki nokta arasındaki mesafeyi (km) hesaplar
def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0 # Dünya yarıçapı (km)
    
    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)
    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)
    
    dlon = lon2_rad - lon1_rad
    dlat = lat2_rad - lat1_rad
    
    a = math.sin(dlat / 2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    distance = R * c
    return distance

async def get_user_review_count(db, user_link: str) -> int:
    """Kullanıcının yaptığı yorum sayısını döndürür."""
    if not user_link:
        return 0
    count = await db.reviews.count_documents({"user_link": user_link})
    return count

async def get_recommendations_for_user(request: RecommendationRequest) -> Tuple[List[RestaurantResponse], str]:
    db = get_database()
    
    # 1. Strateji Belirleme
    user_review_count = await get_user_review_count(db, request.user_id)
    
    if user_review_count < 3:
        strategy = "Strateji B (Soğuk Başlatma - Popülerlik & İçerik)"
        alpha = 0.0
    elif user_review_count < 10:
        strategy = "Strateji A (Hafif Hibrit)"
        alpha = 0.3
    elif user_review_count < 20:
        strategy = "Strateji A (Güçlü Hibrit)"
        alpha = 0.6
    else:
        strategy = "Strateji A (Baskın CF)"
        alpha = 0.75

    # 2. Aday Restoranları Filtreleme (Konum, Kategori, Puan)
    # GeoJSON kullanılmadığı için Bounding Box (Sınırlayıcı Kutu) yaklaşımı ile filtreleme yapıyoruz.
    # Bu yöntem, veritabanından tüm restoranları çekmek yerine sadece o bölgedekileri hızlıca çekmeyi sağlar.
    
    # 1 derece enlem yaklaşık 111 km'dir
    lat_degree_per_km = 1 / 111.0
    # 1 derece boylam, bulunduğumuz enleme göre değişir
    lon_degree_per_km = 1 / (111.0 * math.cos(math.radians(request.latitude)))
    
    min_lat = request.latitude - (request.radius_km * lat_degree_per_km)
    max_lat = request.latitude + (request.radius_km * lat_degree_per_km)
    min_lon = request.longitude - (request.radius_km * lon_degree_per_km)
    max_lon = request.longitude + (request.radius_km * lon_degree_per_km)

    query: Dict[str, Any] = {
        "latitude": {"$gte": min_lat, "$lte": max_lat},
        "longitude": {"$gte": min_lon, "$lte": max_lon}
    }
    
    if request.categories:
        # Virgülle ayrılmış string içinde arama yapmak için Regex kullanıyoruz
        # Örn: request.categories = ["Burger", "Pizza"] ise, "Burger|Pizza" gibi bir arama yapar.
        regex_pattern = "|".join(request.categories)
        query["category"] = {"$regex": regex_pattern, "$options": "i"}
        
    if request.min_rating:
        query["rating"] = {"$gte": request.min_rating}

    cursor = db.restaurants.find(query).limit(500) # Değerlendirme için ilk 500'ü al
    candidates = await cursor.to_list(length=500)
    
    scored_restaurants = []
    
    for doc in candidates:
        lat = doc.get("latitude", 0.0)
        lon = doc.get("longitude", 0.0)
        
        # Gerçek mesafeyi hesapla
        distance = calculate_distance(request.latitude, request.longitude, lat, lon)
        
        # Bounding box köşegenleri nedeniyle yarıçap dışına çıkanları ele (tam daire hesabı)
        if distance > request.radius_km:
            continue
            
        # Puanlama mantığı
        popularity_score = doc.get("rating_count", 0) * (doc.get("rating", 0) / 5.0)
        
        # TODO: ML Modeli entegrasyonu (CF ve CBF)
        cf_score = 0.7
        cbf_score = 0.3
        
        beta = 0.1
        final_score = (alpha * cf_score) + ((1 - alpha) * cbf_score) + (beta * popularity_score)
        
        scored_restaurants.append({
            "doc": doc,
            "score": final_score,
            "distance": distance
        })

    # Skora göre sırala ve en iyi Top-K'yi al
    scored_restaurants.sort(key=lambda x: x["score"], reverse=True)
    top_candidates = scored_restaurants[:request.top_k]
    
    # Yanıt formatına dönüştür
    response_list = []
    for item in top_candidates:
        doc = item["doc"]
        response_list.append(
            RestaurantResponse(
                id=doc.get("place_id", ""),
                name=doc.get("google_name", doc.get("original_name", "Bilinmeyen")),
                category=doc.get("category", "Genel"),
                rating=doc.get("rating", 0.0),
                distance_km=round(item["distance"], 2),
                is_open=(doc.get("business_status") == "OPERATIONAL")
            )
        )

    return response_list, strategy
