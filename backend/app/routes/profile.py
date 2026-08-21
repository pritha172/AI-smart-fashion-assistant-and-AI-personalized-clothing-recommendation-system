from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import SessionLocal
from app.models.user import User
from app.models.wardrobe import Wardrobe
from app.models.cart import Cart
from app.models.analysis_history import AnalysisHistory


router = APIRouter()


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


@router.get("/profile/{user_id}")
def get_profile(
    user_id: int,
    db: Session = Depends(get_db)
):

    # Find user
    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )


    # Count wardrobe items
    wardrobe_count = db.query(Wardrobe).filter(
        Wardrobe.user_id == user_id
    ).count()


    # Count cart items
    cart_count = db.query(Cart).filter(
        Cart.user_id == user_id
    ).count()


    # Get latest AI analysis
    analysis = db.query(AnalysisHistory).filter(
        AnalysisHistory.user_id == user_id
    ).order_by(
        AnalysisHistory.id.desc()
    ).first()


    # Default AI information
    body_shape = "Not analyzed"
    face_shape = "Not analyzed"
    skin_tone = "Not analyzed"


    if analysis:

        body_shape = analysis.body_shape or "Not analyzed"

        face_shape = analysis.face_shape or "Not analyzed"

        skin_tone = analysis.skin_tone or "Not analyzed"


    return {

        "user": {

            "id": user.id,

            "name": user.name,

            "email": user.email,

            "gender": user.gender

        },

        "wardrobe_count": wardrobe_count,

        "cart_count": cart_count,

        "analysis": {

            "body_shape": body_shape,

            "face_shape": face_shape,

            "skin_tone": skin_tone

        }

    }