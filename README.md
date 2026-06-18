# FoodieAI - AI-Powered Restaurant Recommendation System

FoodieAI, kullanıcı davranışlarına, coğrafi konuma ve içerik özelliklerine dayalı olarak kişiselleştirilmiş restoran önerileri sunan hibrit bir tavsiye sistemidir. 

Proje, güçlü bir Python (FastAPI) arka ucundan (backend) ve modern bir React ön ucundan (frontend) oluşmaktadır.

## 🚀 Proje Özellikleri

- **Hibrit Öneri Motoru:** İçerik tabanlı filtreleme, popülerlik ve (isteğe bağlı) işbirlikçi filtreleme (Collaborative Filtering) yöntemlerini harmanlar.
- **Konum Tabanlı Arama:** Kullanıcının mevcut konumuna göre belirli bir yarıçap içindeki restoranları bulur ve mesafeyi hesaplar.
- **LLM Destekli Açıklamalar (Explanations):** Bir restoranın size neden önerildiğine dair yapay zeka (Google Generative AI) tarafından üretilmiş kişiselleştirilmiş açıklamalar sunar.
- **Modern Arayüz:** Filtreleme (Mutfak, Puan, Yorum Sayısı, Yarıçap), arama ve detay sayfalarına sahip duyarlı bir React uygulaması.

---

## 🛠️ Gereksinimler

Projeyi çalıştırmadan önce sisteminizde aşağıdakilerin yüklü olduğundan emin olun:

- **Python 3.10+**
- **Node.js (v16 veya üzeri) ve npm**
- **MongoDB Atlas Hesabı** (Veritabanı bağlantısı için)

---

## ⚙️ Kurulum ve Çalıştırma

### 1. Ortam Değişkenleri (.env)

Projenin kök dizininde (`backend` klasörünün içinde) bir `.env` dosyası oluşturun ve aşağıdaki değişkenleri kendi bilgilerinize göre doldurun:

```env
# MongoDB Atlas Bağlantısı
MONGODB_URI="mongodb+srv://<kullanici_adi>:<sifre>@<cluster_adresi>/?retryWrites=true&w=majority"
MONGODB_DB_NAME="restaurantsdb"

# API Portu
PORT=8000

# LLM API Key (Önerileri açıklamak için)
# GOOGLE_API_KEY="your_api_key_here"
```

### 2. Backend (FastAPI) Kurulumu

Arka uç, Python tabanlı FastAPI kullanılarak geliştirilmiştir ve `uvicorn` sunucusu ile çalıştırılır.

Terminali açın ve projenin ana dizininden `backend` klasörüne gidin:

```bash
cd backend
```

Gerekli Python kütüphanelerini yükleyin:

```bash
pip install -r requirements.txt
```

*(Opsiyonel)* Eğer veritabanınızda coğrafi indeks eksikse, bir defaya mahsus olmak üzere veritabanı şema güncelleme betiğini çalıştırın:

```bash
python scripts/update_db_schema.py
```

Backend sunucusunu başlatın:

```bash
uvicorn app.main:app --reload
```
*Sunucu varsayılan olarak `http://127.0.0.1:8000` adresinde çalışacaktır. API dokümantasyonuna `http://127.0.0.1:8000/docs` adresinden ulaşabilirsiniz.*

### 3. Frontend (React) Kurulumu

Ön uç, Vite ile oluşturulmuş bir React uygulamasıdır ve `npm` ile çalıştırılır.

Yeni bir terminal açın ve projenin ana dizininden `frontend` klasörüne gidin:

```bash
cd frontend
```

Gerekli npm paketlerini yükleyin:

```bash
npm install
```

Geliştirme (development) sunucusunu başlatın:

```bash
npm run dev
```
*(veya duruma göre `npm start`)*

*Sunucu varsayılan olarak `http://localhost:5173` veya terminalde belirtilen adreste çalışacaktır.*

---

## 🧭 Kullanım Senaryosu

1. Frontend adresine tarayıcınızdan gidin.
2. **Kayıt Ol / Giriş Yap:** Bir kullanıcı hesabı ile sisteme giriş yapın.
3. **Öneriler Alın:** "Recommendations" sayfasında konum izni vererek yakınınızdaki en iyi restoran önerilerini alın. Sol taraftaki slider'lar ile yarıçapı, minimum puanı ve mutfak türünü filtreleyin.
4. **Neden Önerildiğini Görün:** Bir restoran kartındaki "Why Recommended?" butonuna tıklayarak yapay zekanın o restoranı size neden önerdiğini okuyun.
5. **Arama Yapın:** "Search" sayfasından restoran adını yazarak yakınınızdaki eşleşen restoranları anında bulun.
6. **Detaylara Göz Atın:** Herhangi bir restoranın "Details" butonuna tıklayarak adres, son yorumlar ve genel puan gibi detaylı bilgilerine ulaşın.

---

## 🏗️ Proje Yapısı

- **`/backend`**: FastAPI uygulaması, Pydantic şemaları, MongoDB bağlantı ayarları, tavsiye algoritmaları ve LLM servis entegrasyonu.
- **`/frontend`**: React bileşenleri (Navbar, RestaurantCard, vb.), Sayfalar (Login, Recommendations, Search), Axios ile merkezi API iletişimi (`api.js`).
