import asyncio
import json
import os
import sys
import time

# Proje kök dizinini sys.path'e ekle (app modülünü bulabilmesi için)
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import google.generativeai as genai
from app.config import settings
from motor.motor_asyncio import AsyncIOMotorClient

# API Limitleri Ayarları
MAX_DAILY_REQUESTS = 480  # 490 olan sınıra güvenlik payı bırakıyoruz
WAIT_BETWEEN_REQUESTS = 5  # 13 istek / dakika limiti için her istek arası ~5 saniye bekleme süresi (60/13 = 4.6)

# Bu script veritabanındaki yorumları okur, LLM ile özetler ve 
# restoran dokümanına kaydeder (Görev 1).

async def summarize_restaurant_reviews():
    client = AsyncIOMotorClient(settings.mongodb_uri)
    db = client[settings.mongodb_db_name]
    
    if not settings.gemini_api_key:
        print("HATA: gemini_api_key ayarlanmamış. İşlem iptal edildi.")
        return

    # Gemini Client'ı yapılandır
    genai.configure(api_key=settings.gemini_api_key)
    
    # JSON döndürmeye zorlamak için model ayarı
    generation_config = genai.types.GenerationConfig(response_mime_type="application/json")
    model = genai.GenerativeModel('gemini-3.1-flash-lite', generation_config=generation_config)
    
    # Henüz özetlenmemiş restoranları bul (Günlük limit kadar al)
    cursor = db.restaurants.find({"llm_summary": {"$exists": False}}).limit(MAX_DAILY_REQUESTS) 
    restaurants = await cursor.to_list(length=MAX_DAILY_REQUESTS)
    
    if not restaurants:
        print("Özetlenecek yeni restoran bulunamadı.")
        return
        
    print(f"Toplam {len(restaurants)} restoran işlenmek üzere bulundu.")
    print(f"Uyarı: API limitleri gereği her istek arası {WAIT_BETWEEN_REQUESTS} saniye beklenilecektir.")

    daily_request_count = 0

    for rest in restaurants:
        if daily_request_count >= MAX_DAILY_REQUESTS:
            print(f"\nGünlük API limitine ({MAX_DAILY_REQUESTS} istek) ulaşıldı. İşlem durduruluyor.")
            break

        place_id = rest["place_id"]
        rest_name = rest.get("google_name", rest.get("original_name", "Bilinmeyen"))
        
        # Restorana ait yorumları çek
        reviews_cursor = db.reviews.find({"place_id": place_id}).limit(40) # En son 40 yorumu al
        reviews = await reviews_cursor.to_list(length=40)
        
        if not reviews:
            print(f"- {rest_name} için yorum bulunamadı, atlanıyor.")
            # Yorumu olmasa bile alanı boş olarak işaretleyelim ki tekrar tekrar denenmesin
            await db.restaurants.update_one(
                {"place_id": place_id},
                {"$set": {"llm_summary": {}}}
            )
            continue
            
        print(f"\n[{daily_request_count + 1}/{MAX_DAILY_REQUESTS}] {rest_name} özetleniyor ({len(reviews)} yorum)...")
        
        # Yorum metinlerini birleştir
        review_texts = "\n- ".join([r.get("review_text", "") for r in reviews if r.get("review_text")])
        
        # İlk 30000 karakteri al
        review_texts = review_texts[:30000] 
        
        prompt = (
            f"Aşağıdaki yorumları analiz et ve bu restoran ({rest_name}) hakkında JSON formatında bir özet çıkar.\n"
            "Çıktın **kesinlikle sadece** aşağıdaki formatta bir JSON olmalıdır.\n\n"
            "JSON Formatı:\n"
            "{\n"
            "  \"strengths\": \"En çok tekrar eden 2-3 olumlu tema\",\n"
            "  \"weaknesses\": \"Şikayetler ve tekrar eden 1-2 sorun\",\n"
            "  \"highlights\": [\"Öne çıkan en popüler 2-3 yemek\"],\n"
            "  \"ambiance\": \"Ortam, atmosfer ve hizmet kalitesi hakkında kısa özet\",\n"
            "  \"sentiment_score\": 1'den 10'a kadar genel duygu puanı (yorumların ortalaması gibi)\n"
            "}\n\n"
            f"Yorumlar:\n- {review_texts}"
        )
        
        try:
            response = await model.generate_content_async(prompt)
            daily_request_count += 1
            
            summary_json = json.loads(response.text)
            
            # Veritabanını güncelle
            await db.restaurants.update_one(
                {"place_id": place_id},
                {"$set": {"llm_summary": summary_json}}
            )
            print(f"  Başarılı! {rest_name} güncellendi.")
            
            # API Limitini aşmamak için bekleme süresi
            print(f"  Limit korunuyor, {WAIT_BETWEEN_REQUESTS} saniye bekleniyor...")
            await asyncio.sleep(WAIT_BETWEEN_REQUESTS)
            
        except Exception as e:
            print(f"  HATA: {rest_name} özetlenirken sorun oluştu: {e}")
            # Hata alsak bile bekleme süresini koymak güvenlidir
            await asyncio.sleep(WAIT_BETWEEN_REQUESTS)

    client.close()
    print("\nİşlem tamamlandı.")

if __name__ == "__main__":
    asyncio.run(summarize_restaurant_reviews())
