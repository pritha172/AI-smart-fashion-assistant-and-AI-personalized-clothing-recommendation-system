from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.cart import Cart
from app.models.product import Product


router = APIRouter(
    prefix="/cart",
    tags=["Cart"]
)


# =====================================================
# ADD PRODUCT TO CART
# =====================================================

@router.post("/add")
def add_cart(
    user_id: int,
    product_id: int,
    db: Session = Depends(get_db)
):

    # -------------------------------------------------
    # CHECK USER ID
    # -------------------------------------------------

    if user_id <= 0:
        raise HTTPException(
            status_code=400,
            detail="Invalid user ID"
        )

    # -------------------------------------------------
    # CHECK PRODUCT EXISTS
    # -------------------------------------------------

    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if product is None:

        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    # -------------------------------------------------
    # CHECK IF ALREADY IN THIS USER'S CART
    # -------------------------------------------------

    existing_item = db.query(Cart).filter(
        Cart.user_id == user_id,
        Cart.product_id == product_id
    ).first()

    # -------------------------------------------------
    # IF EXISTS, INCREASE QUANTITY
    # -------------------------------------------------

    if existing_item:

        existing_item.quantity += 1

        db.commit()
        db.refresh(existing_item)

        return {
            "message": "Product quantity increased",
            "cart_id": existing_item.id,
            "user_id": user_id,
            "product_id": product_id,
            "quantity": existing_item.quantity
        }

    # -------------------------------------------------
    # OTHERWISE CREATE NEW CART ITEM
    # -------------------------------------------------

    new_item = Cart(
        user_id=user_id,
        product_id=product_id,
        quantity=1
    )

    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    return {
        "message": "Product added to cart",
        "cart_id": new_item.id,
        "user_id": user_id,
        "product_id": product_id,
        "quantity": new_item.quantity
    }


# =====================================================
# GET MY CART
# =====================================================

@router.get("/")
def get_my_cart(
    user_id: int = Query(...),
    db: Session = Depends(get_db)
):

    # -------------------------------------------------
    # GET ONLY THIS USER'S CART
    # -------------------------------------------------

    cart_items = db.query(Cart).filter(
        Cart.user_id == user_id
    ).all()

    cart_list = []

    total = 0.0

    for item in cart_items:

        # ---------------------------------------------
        # GET PRODUCT
        # ---------------------------------------------

        product = db.query(Product).filter(
            Product.id == item.product_id
        ).first()

        if product is None:
            continue

        item_total = (
            float(product.price or 0)
            * int(item.quantity or 1)
        )

        total += item_total

        cart_list.append({

            "cart_id": item.id,

            "product_id": product.id,

            "name": product.name,

            "category": product.category,

            "color": product.color,

            "price": float(product.price or 0),

            "image_url": product.image_url,

            "brand": product.brand,

            "product_url": product.product_url,

            "source": product.source,

            "rating": product.rating,

            "quantity": int(item.quantity or 1),

            "item_total": item_total

        })

    return {

        "user_id": user_id,

        "total_items": len(cart_list),

        "total": total,

        "cart": cart_list

    }


# =====================================================
# REMOVE PRODUCT FROM CART
# =====================================================

@router.delete("/{cart_id}")
def remove_from_cart(
    cart_id: int,

    user_id: int = Query(...),

    db: Session = Depends(get_db)
):

    # -------------------------------------------------
    # FIND CART ITEM BELONGING TO THIS USER
    # -------------------------------------------------

    cart_item = db.query(Cart).filter(
        Cart.id == cart_id,
        Cart.user_id == user_id
    ).first()

    if cart_item is None:

        raise HTTPException(
            status_code=404,
            detail="Cart item not found for this user"
        )

    # -------------------------------------------------
    # DELETE
    # -------------------------------------------------

    db.delete(cart_item)

    db.commit()

    return {

        "message":
        "Product removed from cart",

        "cart_id":
        cart_id,

        "user_id":
        user_id

    }