from passlib.context import CryptContext
from app.database import get_database
from app.schemas.auth import RegisterRequest, LoginRequest

# Şifre hashleme için context oluştur
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    """Düz metin şifreyi hash'lenmiş olanla karşılaştırır."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    """Verilen şifreyi hash'ler."""
    return pwd_context.hash(password)

async def register_user(request: RegisterRequest):
    """Yeni bir kullanıcıyı veritabanına kaydeder."""
    db = get_database()
    
    # Kullanıcı adı zaten var mı diye kontrol et
    if await db.users.find_one({"username": request.username}):
        raise ValueError("Bu kullanıcı adı zaten mevcut.")
        
    # Şifreyi hash'le
    hashed_password = get_password_hash(request.password)
    
    # Yeni kullanıcı dokümanı oluştur
    new_user = {
        "full_name": request.full_name,
        "username": request.username,
        "hashed_password": hashed_password,
        # author_link gibi eski sistemle uyumluluk için alanlar eklenebilir
        # "author_link": f"internal_user_{request.username}" 
    }
    
    await db.users.insert_one(new_user)
    return new_user

async def authenticate_user(request: LoginRequest):
    """Kullanıcıyı doğrular ve kullanıcı bilgilerini döndürür."""
    db = get_database()
    
    user = await db.users.find_one({"username": request.username})
    if not user:
        return None # Kullanıcı bulunamadı
        
    if not verify_password(request.password, user["hashed_password"]):
        return None # Şifre yanlış
        
    return user
