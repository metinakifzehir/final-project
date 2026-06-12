import json
import redis.asyncio as redis
import google.generativeai as genai
from app.config import settings

# Redis bağlantısı
redis_client = redis.from_url(settings.redis_url, decode_responses=True)

# Gemini Client'ı yapılandır
if settings.gemini_api_key:
    genai.configure(api_key=settings.gemini_api_key)

async def generate_explanation(user_profile: dict, restaurant: dict, distance_km: float) -> dict:
    """
    Kullanıcı profiline ve restoran detaylarına göre Gemini'dan açıklama üretir.
    Sonuçlar aynı kullanıcı ve restoran için Redis'te önbelleklenir.
    """
    user_id = user_profile.get("user_id", "anonymous")
    # Restoran ID'si için place_id kullanalım
    restaurant_id = restaurant.get("place_id", "")
    
    cache_key = f"explanation:{user_id}:{restaurant_id}"
    
    try:
        cached_result = await redis_client.get(cache_key)
        if cached_result:
            return json.loads(cached_result)
    except Exception as e:
        print(f"Redis bağlantı hatası: {e}")

    # Gemini için Prompt hazırlığı
    prompt = (
        "Sen uzman bir restoran rehberisin. Sana verilen kullanıcı profili ve restoran "
        "bilgilerini kullanarak, kullanıcının bu restoranı neden sevebileceğine dair "
        "kısa, samimi ve ikna edici bir açıklama yapacaksın. Çıktın **sadece** JSON formatında olmalı.\n\n"
        "JSON Şablonu:\n"
        "{\n"
        "  \"reason\": \"2-3 cümlelik olumlu gerekçe\",\n"
        "  \"warning\": \"Eğer restoranın zayıf bir yönü varsa 1 cümlelik uyarı (yoksa null)\",\n"
        "  \"highlights\": [\"Öne çıkan yemeklerin listesi (array)\"]\n"
        "}\n\n"
        "--- Girdi Bilgileri ---\n"
        f"Kullanıcı Profili: {', '.join(user_profile.get('preferences', [])) or 'Genel öneri arıyor.'}\n"
        f"Önerilen Restoran: {restaurant.get('google_name', 'Bilinmeyen')} (Kategori: {restaurant.get('category', 'Genel')}, Puan: {restaurant.get('rating', '?')})\n"
        f"Mesafe: {distance_km:.2f} km\n"
        f"Restoran Özeti: {restaurant.get('llm_summary', 'Henüz detaylı özet yok.')}\n"
        "--- Çıktı (Sadece JSON) ---"
    )

    if not settings.gemini_api_key:
        # API key yoksa mock dön
        mock_response = {
            "reason": f"{restaurant.get('google_name', 'Bu restoran')}, tercih ettiğin kategorilere uyuyor ve genel puanı oldukça yüksek. {distance_km:.2f} km yakınında olması da bir avantaj.",
            "warning": "Öğle saatlerinde biraz kalabalık olabilir.",
            "highlights": ["Spesiyal menü", "Tatlılar"]
        }
        return mock_response

    try:
        model = genai.GenerativeModel('gemini-3.1-flash-lite')
        # Gemini'nin JSON modunu kullanmak için generation_config ayarı
        generation_config = genai.types.GenerationConfig(response_mime_type="application/json")
        
        response = await model.generate_content_async(prompt, generation_config=generation_config)
        
        # Gemini'den gelen text'i JSON'a çevir
        result_json = json.loads(response.text)
        
        # Redis'e kaydet (1 haftalık TTL)
        try:
            await redis_client.setex(cache_key, 604800, json.dumps(result_json))
        except Exception as e:
            print(f"Redis yazma hatası: {e}")
            
        return result_json
        
    except Exception as e:
        print(f"Gemini API Hatası: {e}")
        return {
            "reason": "Sana uygun olabileceğini düşündüğümüz popüler bir mekan.",
            "warning": None,
            "highlights": []
        }
