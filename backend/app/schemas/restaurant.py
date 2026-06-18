from pydantic import BaseModel, Field
from typing import List, Optional

class ReviewResponse(BaseModel):
    author_name: str
    rating: int
    text: Optional[str] = None
    time_description: str

class RestaurantDetailResponse(BaseModel):
    id: str
    name: str
    category: str
    rating: float
    rating_count: Optional[int] = None
    address: Optional[str] = None
    phone_number: Optional[str] = None
    is_open: Optional[bool] = None
    reviews: List[ReviewResponse]

class ReviewCreateRequest(BaseModel):
    rating: int = Field(..., ge=1, le=5, description="Verilen puan (1-5 arası)")
    text: Optional[str] = Field(None, description="Yorum metni")
