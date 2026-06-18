from passlib.context import CryptContext
from app.database import get_database
from app.schemas.auth import RegisterRequest, LoginRequest

# Şifre hashleme için context oluştur
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    """Düz metin şifreyi hash'lenmiş olanla karşılaştırır."""
    # Doğrulama sırasında da şifrenin kısaltılması gerekir
    return pwd_context.verify(plain_password[:72], hashed_password)

def get_password_hash(password):
    """Verilen şifreyi hash'ler. bcrypt 72 byte limitine uymak için kısaltılır."""
    return pwd_context.hash(password[:72])

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
        "author_name": request.author_name,
        "username": request.username,
        "hashed_password": hashed_password,
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

async def update_password(username: str, password: str):
    """Bir kullanıcının şifresini günceller."""
    db = get_database()
    
    # Kullanıcıyı bul
    user = await db.users.find_one({"username": username})
    if not user:
        raise ValueError("Kullanıcı bulunamadı.")
        
    # Yeni şifreyi hash'le
    hashed_password = get_password_hash(password)
    
    # Şifreyi güncelle
    await db.users.update_one(
        {"username": username},
        {"$set": {"hashed_password": hashed_password}}
    )
    
    return await db.users.find_one({"username": username})
