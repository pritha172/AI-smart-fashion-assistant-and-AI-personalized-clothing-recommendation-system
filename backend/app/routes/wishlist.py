from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.database import get_db

from app.models.wishlist import Wishlist



router = APIRouter(
    prefix="/wishlist",
    tags=["Wishlist"]
)



@router.post("/add")
def add_wishlist(

    user_id:int,

    product_id:int,

    db:Session = Depends(get_db)

):


    item = Wishlist(

        user_id=user_id,

        product_id=product_id

    )


    db.add(item)

    db.commit()

    db.refresh(item)


    return {

        "message":"Added to wishlist",

        "id":item.id

    }