from sqlalchemy import Column, Integer, String, Float

from app.database.base import Base



class Product(Base):

    __tablename__ = "products"


    id = Column(
        Integer,
        primary_key=True,
        index=True
    )


    name = Column(
        String(100)
    )


    category = Column(
        String(50)
    )

    gender = Column(
    String(20)
)


    color = Column(
        String(50)
    )


    price = Column(
        Float
    )


    image_url = Column(
        String(255)
    )

    brand = Column(
        String(100)
    )

    product_url = Column(
        String(500)
    )


    source = Column(
        String(100)
    )


    rating = Column(
        Float
    )