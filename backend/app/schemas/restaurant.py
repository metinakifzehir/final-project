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
    rating_count: Optional[int] = None # Yeni alan
    address: Optional[str] = None
    phone_number: Optional[str] = None
    is_open: Optional[bool] = None
    reviews: List[ReviewResponse]
