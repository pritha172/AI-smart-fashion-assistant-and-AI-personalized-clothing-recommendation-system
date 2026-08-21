from pydantic import BaseModel
from decimal import Decimal
from datetime import datetime


class ProductBase(BaseModel):

    name: str

    description: str | None = None

    category: str | None = None

    gender: str | None = None

    color: str | None = None

    size: str | None = None

    price: Decimal

    stock: int

    image_url: str | None = None

    brand: str | None = None



class ProductCreate(ProductBase):

    pass



class ProductResponse(ProductBase):

    id: int

    created_at: datetime | None = None


    class Config:

        from_attributes = True