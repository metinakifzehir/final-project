import os
from pymongo import MongoClient
from dotenv import load_dotenv

def update_restaurant_schema():
    """
    'restaurants' koleksiyonundaki dokümanlara, mevcut 'longitude' ve 'latitude'
    alanlarını kullanarak GeoJSON formatında bir 'location' alanı ekler.
    Ayrıca 'location' alanı üzerinde bir 2dsphere indeksi oluşturur.
    """
    # .env dosyasının yolu backend klasörünün içi olarak güncellendi
    dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
    load_dotenv(dotenv_path=dotenv_path)

    MONGODB_URI = os.getenv("MONGODB_URI")
    DB_NAME = os.getenv("MONGODB_DB_NAME")

    if not MONGODB_URI or not DB_NAME:
        print("Hata: MONGODB_URI veya MONGODB_DB_NAME ortam değişkenleri bulunamadı.")
        return

    print("MongoDB'ye bağlanılıyor...")
    client = MongoClient(MONGODB_URI)
    db = client[DB_NAME]
    restaurants_collection = db['restaurants']
    print(f"'{DB_NAME}' veritabanındaki 'restaurants' koleksiyonuna bağlanıldı.")

    query = {"location": {"$exists": False}, "longitude": {"$exists": True}, "latitude": {"$exists": True}}
    total_docs = restaurants_collection.count_documents(query)
    
    if total_docs == 0:
        print("Tüm dokümanlar zaten 'location' alanına sahip. İşlem yapılmadı.")
        index_info = restaurants_collection.index_information()
        if "location_2dsphere" not in index_info:
            print("'location_2dsphere' indeksi bulunamadı. Oluşturuluyor...")
            restaurants_collection.create_index([("location", "2dsphere")])
            print("İndeks başarıyla oluşturuldu.")
        else:
            print("'location_2dsphere' indeksi zaten mevcut.")
        return

    print(f"Güncellenecek {total_docs} doküman bulundu. İşlem başlatılıyor...")
    
    updated_count = 0
    for restaurant in restaurants_collection.find(query):
        try:
            longitude = float(restaurant['longitude'])
            latitude = float(restaurant['latitude'])
            
            restaurants_collection.update_one(
                {'_id': restaurant['_id']},
                {
                    '$set': {
                        'location': {
                            'type': 'Point',
                            'coordinates': [longitude, latitude]
                        }
                    }
                }
            )
            updated_count += 1
            if updated_count % 100 == 0:
                print(f"{updated_count}/{total_docs} doküman güncellendi...")
        except (ValueError, KeyError) as e:
            print(f"Doküman {restaurant['_id']} işlenirken hata oluştu: {e}. Atlanıyor.")

    print(f"Toplam {updated_count} doküman başarıyla güncellendi.")

    print("'location' alanı üzerinde '2dsphere' indeksi oluşturuluyor...")
    try:
        restaurants_collection.create_index([("location", "2dsphere")])
        print("İndeks başarıyla oluşturuldu.")
    except Exception as e:
        print(f"İndeks oluşturulurken bir hata oluştu: {e}")

if __name__ == '__main__':
    try:
        import dotenv
    except ImportError:
        print("Lütfen 'python-dotenv' kütüphanesini yükleyin: pip install python-dotenv")
        exit(1)
        
    update_restaurant_schema()
