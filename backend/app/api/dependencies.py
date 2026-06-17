from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.services import jwt_service
from app.database import get_database

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")
oauth2_scheme_optional = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)

async def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    Token'ı doğrular ve mevcut kullanıcıyı döndürür. Token zorunludur.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    username = jwt_service.decode_token(token)
    if username is None:
        raise credentials_exception
    
    db = get_database()
    user = await db.users.find_one({"username": username})
    
    if user is None:
        raise credentials_exception
        
    return user

async def get_current_user_optional(token: str | None = Depends(oauth2_scheme_optional)):
    """
    Varsa token'ı doğrular ve kullanıcıyı döndürür. Token yoksa None döndürür.
    """
    if not token:
        return None
        
    username = jwt_service.decode_token(token)
    if username is None:
        return None
    
    db = get_database()
    user = await db.users.find_one({"username": username})
    return user
