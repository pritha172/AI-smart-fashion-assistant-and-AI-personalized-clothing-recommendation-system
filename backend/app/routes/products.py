from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.database import get_db

from app.models.product import Product



router = APIRouter(
    prefix="/products",
    tags=["Products"]
)



@router.get("/")
def get_products(
    db: Session = Depends(get_db)
):


    products = db.query(
        Product
    ).all()



    product_list = []



    for product in products:


        product_list.append({


            "id": product.id,


            "name": product.name,


            "category": product.category,


            "color": product.color,


            "price": float(product.price),


            "image_url": product.image_url,


            "brand": product.brand,


            "product_url": product.product_url,


            "source": product.source,


            "rating": product.rating


        })



    return product_list