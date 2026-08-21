from sqlalchemy.orm import Session

from app.models.product import Product


def get_products_by_category(
    db: Session,
    category: str,
    gender: str
):
    """
    Get all products belonging to the analyzed user's gender.

    Female analysis -> all Female products
    Male analysis   -> all Male products

    The recommended category is kept for the AI recommendation,
    but products are filtered only by gender.
    """

    products = db.query(Product).filter(
        Product.gender == gender
    ).all()

    return products