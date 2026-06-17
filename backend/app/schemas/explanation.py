from pydantic import BaseModel, Field
from typing import List, Optional

class ExplanationRequest(BaseModel):
    user_id: Optional[str] = Field(default=None, description="Kullanıcı kimliği")
    restaurant_id: str = Field(..., description="Açıklama istenen restoranın ID'si")
    distance_km: float = Field(..., description="Kullanıcıya olan uzaklık (km)")

class ExplanationResponse(BaseModel):
    reason: str = Field(description="Neden önerildiğine dair 2-3 cümle")
    warning: Optional[str] = Field(description="Varsa dikkat edilmesi gereken bir zayıf yön")
    highlights: List[str] = Field(description="Öne çıkan yemekler veya özellikler")
