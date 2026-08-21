from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.wardrobe import Wardrobe

from ai_models.outfit_recommendation.outfit_engine import generate_outfit_recommendation
from ai_models.wardrobe_ai.wardrobe_checker import check_wardrobe
from ai_models.recommendation_system.outfit_generator import generate_outfit
from ai_models.recommendation_system.occasion_recommender import recommend_occasion


router = APIRouter(

    prefix="/outfit",

    tags=["Outfit"]

)


# =====================================
# AI OUTFIT RECOMMENDATION
# =====================================

@router.get("/recommend")

def recommend_outfit(

    db: Session = Depends(get_db)

):

    items = db.query(Wardrobe).all()

    wardrobe = []

    for item in items:

        wardrobe.append({

            "id": item.id,

            "category": item.category,

            "color": item.color,

            "image": item.image_url

        })

    result = generate_outfit_recommendation(

        wardrobe

    )

    return {

        "recommended_outfit": result

    }


# =====================================
# WARDROBE OUTFIT
# =====================================

@router.get("/wardrobe")

def wardrobe_outfit(

    db: Session = Depends(get_db)

):

    clothes = db.query(

        Wardrobe

    ).all()

    wardrobe = check_wardrobe(

        "",

        clothes

    )

    outfit = generate_outfit(

        wardrobe

    )

    outfit_data = {

        "top": outfit.get("top").category if outfit.get("top") else "",

        "bottom": outfit.get("bottom").category if outfit.get("bottom") else ""

    }

    occasion = recommend_occasion(

        outfit_data

    )

    return {

        "recommended_outfit": {

            "top": outfit.get("top").category if outfit.get("top") else None,

            "bottom": outfit.get("bottom").category if outfit.get("bottom") else None,

            "shoes": outfit.get("shoes").category if outfit.get("shoes") else None,

            "jacket": outfit.get("jacket").category if outfit.get("jacket") else None

        },

        "occasion": occasion

    }