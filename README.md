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

## ⚙️ Kurulum ve Çalıştırma (Yerel Geliştirme)

### 1. Ortam Değişkenleri (.env)

Projenin kök dizininde (`backend` klasörünün içinde) bir `.env` dosyası oluşturun ve aşağıdaki değişkenleri kendi bilgilerinize göre doldurun:

```env
# MongoDB Atlas Bağlantısı
MONGODB_URI="mongodb+srv://<kullanici_adi>:<sifre>@<cluster_adresi>/?retryWrites=true&w=majority"
MONGODB_DB_NAME="restaurantsdb"

# API Portu
PORT=8000

# Güvenlik (Kimlik doğrulama için)
JWT_SECRET_KEY="gizli_bir_anahtar_olusturun"

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

## 🚂 Canlıya Alma (Deployment to Railway)

Bu proje, bir "monorepo" olarak yapılandırılmıştır ve **Railway** platformunda tek tıkla canlıya alınabilir. Gerekli tüm yapılandırmalar projedeki `railway.json` dosyasında mevcuttur.

### Adım 1: GitHub'a Yükleyin
Projenizin tamamını (backend ve frontend dahil) kendi GitHub hesabınızda bir repository'ye yükleyin.

### Adım 2: Railway'de Proje Oluşturun
1. [Railway.app](https://railway.app/) adresine gidin ve giriş yapın.
2. "New Project" butonuna tıklayın.
3. "Deploy from GitHub repo" seçeneğini seçin.
4. Yüklediğiniz repository'yi seçin.
5. Railway, projedeki `railway.json` dosyasını otomatik olarak algılayacak ve iki ayrı servis (`backend` ve `frontend`) oluşturacaktır.

### Adım 3: Çevresel Değişkenleri Ayarlayın (Environment Variables)

Servisler oluşturulduktan sonra, her iki servis için de gerekli ortam değişkenlerini tanımlamanız gerekir.

#### **Backend Servisi İçin:**
Railway panosunda `backend` servisine tıklayın, **Variables** sekmesine gidin ve aşağıdaki değişkenleri ekleyin:
- `MONGODB_URI`: MongoDB Atlas bağlantı cümleniz.
- `MONGODB_DB_NAME`: Kullanacağınız veritabanı adı (örn: `restaurantsdb`).
- `JWT_SECRET_KEY`: Rastgele, güçlü bir güvenlik anahtarı.
- *(Varsa)* `GOOGLE_API_KEY`: LLM destekli açıklamalar için.

*(Not: `PORT` değişkeni Railway tarafından otomatik atanacaktır).*

#### **Frontend Servisi İçin:**
1. Öncelikle `backend` servisinizin Railway panosunda bir **Domain** (Public URL) aldığından emin olun (örn: `https://my-backend-production.up.railway.app`).
2. Daha sonra `frontend` servisine tıklayın, **Variables** sekmesine gidin ve aşağıdaki değişkeni ekleyin:
- `VITE_API_URL`: Backend servisinizin URL'sinin sonuna `/api/v1` ekleyerek yazın.
  *(Örnek: `https://my-backend-production.up.railway.app/api/v1`)*

### Adım 4: Yeniden Derleyin
Ortam değişkenlerini ayarladıktan sonra, değişikliklerin geçerli olması için sağ üst köşedeki **Deploy** butonuna tıklayarak (veya var olan deploy'ları tetikleyerek) her iki servisi de yeniden derleyin. İşlem tamamlandığında, frontend servisinizin Public URL'si üzerinden canlı uygulamanıza erişebilirsiniz!

---

## 🧭 Kullanım Senaryosu

1. Frontend adresine tarayıcınızdan gidin.
2. **Kayıt Ol / Giriş Yap:** Bir kullanıcı hesabı ile sisteme giriş yapın.
3. **Öneriler Alın:** "Recommendations" sayfasında konum izni vererek yakınınızdaki en iyi restoran önerilerini alın. Sol taraftaki slider'lar ile yarıçapı, minimum puanı ve mutfak türünü filtreleyin.
4. **Neden Önerildiğini Görün:** Bir restoran kartındaki "Why Recommended?" butonuna tıklayarak yapay zekanın o restoranı size neden önerdiğini okuyun.
5. **Arama Yapın:** "Search" sayfasından restoran adını yazarak yakınınızdaki eşleşen restoranları anında bulun.
6. **Detaylara Göz Atın:** Herhangi bir restoranın "Details" butonuna tıklayarak adres, son yorumlar ve genel puan gibi detaylı bilgilerine ulaşın.
