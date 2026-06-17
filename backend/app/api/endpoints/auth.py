from fastapi import APIRouter, Depends, HTTPException, status
from datetime import timedelta

from app.schemas.auth import RegisterRequest, LoginRequest, Token
from app.services import auth_service
from app.services.jwt_service import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter()

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(request: RegisterRequest):
    """
    Yeni kullanıcı kaydı oluşturur.
    - **full_name**: Kullanıcının tam adı.
    - **username**: Benzersiz kullanıcı adı.
    - **password**: En az 6 karakterli şifre.
    """
    try:
        await auth_service.register_user(request)
        return {"message": "Kullanıcı başarıyla oluşturuldu."}
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

@router.post("/login", response_model=Token)
async def login_for_access_token(request: LoginRequest):
    """
    Kullanıcı girişi yapar ve bir JWT access token döndürür.
    """
    user = await auth_service.authenticate_user(request)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Kullanıcı adı veya şifre hatalı",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}
