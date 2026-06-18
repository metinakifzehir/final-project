import requests
from pymongo import MongoClient
import os
from dotenv import load_dotenv

# .env dosyasının yolu backend klasörünün içi olarak güncellendi
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path=dotenv_path)

# MONGODB_URI ve MONGODB_DB_NAME ortam değişkenlerini oku
MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("MONGODB_DB_NAME")
API_PORT = os.getenv("PORT", "8000") # FastAPI portu, varsayılan 8000

if not MONGODB_URI:
    raise ValueError("MONGODB_URI ortam değişkeni bulunamadı. Lütfen .env dosyasını ve yolunu kontrol edin.")
if not DB_NAME:
    raise ValueError("MONGODB_DB_NAME ortam değişkeni bulunamadı. Lütfen .env dosyasını kontrol edin.")

# MongoDB'ye bağlan
client = MongoClient(MONGODB_URI)
db = client[DB_NAME]
users_collection = db['users']

# API endpoint (Doğru URL prefix'i eklendi)
UPDATE_PASSWORD_URL = f'http://127.0.0.1:{API_PORT}/api/v1/auth/update-password'

def create_passwords():
    """
    'users' koleksiyonundaki her kullanıcı için 'username'i şifre olarak kullanarak
    mevcut kullanıcıların şifrelerini günceller.
    """
    # Sadece 'hashed_password' alanı olmayan veya null olan kullanıcıları seç
    query = {"hashed_password": {"$exists": False}}
    
    for user in users_collection.find(query):
        username = user.get('username')

        if not username:
            print(f"Kullanıcı adı bulunamadı: {user}")
            continue

        # Şifre güncelleme için gönderilecek veri
        payload = {
            'username': username,
            'password': username  # Şifre olarak username kullanılıyor
        }

        try:
            response = requests.put(UPDATE_PASSWORD_URL, json=payload)
            response.raise_for_status()  # HTTP hatalarında exception fırlat
            print(f"'{username}' kullanıcısının şifresi başarıyla güncellendi.")
        except requests.exceptions.RequestException as e:
            # API'den gelen hata mesajını yazdırmaya çalış
            error_detail = "Bilinmeyen bir hata oluştu."
            if e.response is not None:
                try:
                    error_detail = e.response.json().get('detail', e.response.text)
                except Exception:
                    error_detail = e.response.text
            else:
                error_detail = str(e)
            print(f"'{username}' kullanıcısının şifresi güncellenirken hata oluştu: {error_detail}")

if __name__ == '__main__':
    # python-dotenv kütüphanesinin yüklü olduğundan emin olun
    try:
        import dotenv
    except ImportError:
        print("Lütfen 'python-dotenv' kütüphanesini yükleyin: pip install python-dotenv")
        exit(1)

    create_passwords()
