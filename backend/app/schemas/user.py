from pydantic import BaseModel
from typing import Optional

class UserReviewResponse(BaseModel):
    restaurant_id: str # Restoran ID'sini ekle
    restaurant_name: str
    rating: int
    text: Optional[str] = None
    time_description: str
