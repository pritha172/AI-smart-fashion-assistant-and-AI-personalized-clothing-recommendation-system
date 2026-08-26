import sys
import os

sys.path.append(
    os.path.abspath(
        os.path.join(
            os.path.dirname(__file__),
            "../../../"
        )
    )
)

from typing import Optional

from fastapi import APIRouter, UploadFile, File, Depends, Form
from sqlalchemy.orm import Session

import cv2
import numpy as np

from app.database import get_db

from app.models.user import User
from app.models.user_preferences import UserPreference
from app.models.analysis_history import AnalysisHistory
from app.models.wardrobe import Wardrobe

from ai_models.body_shape_detection.body_detection import detect_body_shape
from ai_models.face_analysis.face_detection import detect_face_shape
from ai_models.skin_tone_detection.skin_analysis import detect_skin_tone

from ai_models.recommendation_model.recommendation import get_recommendation

from app.services.todays_look import create_todays_look

from ai_models.wardrobe_ai.wardrobe_checker import check_wardrobe
from ai_models.recommendation_system.outfit_generator import generate_outfit

from app.services.product_recommendation import get_products_by_category


router = APIRouter(
    prefix="/ai",
    tags=["AI"]
)


@router.post("/analyze")
async def analyze_image(
    file: UploadFile = File(...),
    user_id: int = Form(...),
    db: Session = Depends(get_db)
):

    # =====================================================
    # 1. READ IMAGE
    # =====================================================

    contents = await file.read()

    np_image = np.frombuffer(
        contents,
        np.uint8
    )

    image = cv2.imdecode(
        np_image,
        cv2.IMREAD_COLOR
    )

    if image is None:
        return {
            "error": "Invalid image"
        }


    # =====================================================
    # 2. AI ANALYSIS
    # =====================================================

    body_result = detect_body_shape(image)

    face_result = detect_face_shape(image)

    skin_result = detect_skin_tone(image)


    # =====================================================
    # 3. GET REGISTERED USER
    # =====================================================

    user = db.query(
        User
    ).filter(
        User.id == user_id
    ).first()

    if not user:
        return {
            "error": "User not found"
        }


    # =====================================================
    # 4. GET USER GENDER
    # =====================================================

    gender = user.gender or "Female"


    # =====================================================
    # 5. GET USER PREFERENCES
    # =====================================================

    preference = db.query(
        UserPreference
    ).filter(
        UserPreference.user_id == user_id
    ).first()

    if preference:

        age = preference.age or 20

        favorite_color = (
            preference.favorite_color
            or "Black"
        )

        occasion = (
            preference.occasion
            or "Casual"
        )

        weather = (
            preference.weather
            or "Summer"
        )

    else:

        age = 20

        favorite_color = "Black"

        occasion = "Casual"

        weather = "Summer"


    # =====================================================
    # 6. AI PRODUCT RECOMMENDATION
    # =====================================================

    print(
        "\n================ RECOMMENDATION DEBUG ================"
    )

    print("Body Shape     :", body_result)
    print("Face Shape     :", face_result)
    print("Skin Tone      :", skin_result)
    print("Gender         :", gender)
    print("Age            :", age)
    print("Favorite Color :", favorite_color)
    print("Occasion       :", occasion)
    print("Weather        :", weather)

    print(
        "=======================================================\n"
    )


    recommended_category = get_recommendation(
        body_result,
        skin_result,
        gender,
        age,
        favorite_color,
        occasion,
        weather
    )


    print(
        ">>> RECOMMENDED CATEGORY:",
        recommended_category
    )

    print(
        "=======================================================\n"
    )


    # =====================================================
    # 7. GET USER WARDROBE
    # =====================================================

    wardrobe_items = db.query(
        Wardrobe
    ).filter(
        Wardrobe.user_id == user_id
    ).all()


    print(
        ">>> WARDROBE ITEMS:",
        len(wardrobe_items)
    )


    # =====================================================
    # 8. ORGANIZE WARDROBE
    # =====================================================

    wardrobe_groups = check_wardrobe(
        recommended_category,
        wardrobe_items
    )


    # =====================================================
    # 9. CONVERT WARDROBE TO DICTIONARY
    # =====================================================

    wardrobe_dict = {

        "tops": [
            {
                "id": item.id,
                "image_url": item.image_url,
                "category": item.category,
                "color": item.color,
                "fabric": item.fabric,
                "season": item.season,
                "occasion": item.occasion
            }
            for item in wardrobe_groups.get("tops", [])
        ],

        "bottoms": [
            {
                "id": item.id,
                "image_url": item.image_url,
                "category": item.category,
                "color": item.color,
                "fabric": item.fabric,
                "season": item.season,
                "occasion": item.occasion
            }
            for item in wardrobe_groups.get("bottoms", [])
        ],

        "shoes": [
            {
                "id": item.id,
                "image_url": item.image_url,
                "category": item.category,
                "color": item.color,
                "fabric": item.fabric,
                "season": item.season,
                "occasion": item.occasion
            }
            for item in wardrobe_groups.get("shoes", [])
        ],

        "jackets": [
            {
                "id": item.id,
                "image_url": item.image_url,
                "category": item.category,
                "color": item.color,
                "fabric": item.fabric,
                "season": item.season,
                "occasion": item.occasion
            }
            for item in wardrobe_groups.get("jackets", [])
        ],

        "dresses": [
            {
                "id": item.id,
                "image_url": item.image_url,
                "category": item.category,
                "color": item.color,
                "fabric": item.fabric,
                "season": item.season,
                "occasion": item.occasion
            }
            for item in wardrobe_groups.get("dresses", [])
        ]

    }


    # =====================================================
    # 10. GENERATE OUTFIT
    # =====================================================

    outfit = generate_outfit(
        wardrobe_dict
    )


    # =====================================================
    # 11. GENERATE TODAY'S LOOK
    # =====================================================

    todays_look = create_todays_look(
        body_shape=body_result,
        skin_tone=skin_result,
        face_shape=face_result,
        gender=gender,
        age=age,
        favorite_color=favorite_color,
        occasion=occasion,
        weather=weather,
        wardrobe_items=wardrobe_items
    )


    # =====================================================
    # 12. GET REAL PRODUCTS
    # =====================================================

    products = get_products_by_category(
        db,
        recommended_category,
        gender
    )


    product_list = []

    for product in products:

        product_list.append({

            "id": product.id,

            "name": product.name,

            "category": product.category,

            "color": product.color,

            "price": float(
                product.price or 0
            ),

            "image_url": product.image_url,

            "brand": product.brand,

            "product_url": product.product_url,

            "source": product.source,

            "rating": product.rating

        })


    # =====================================================
    # 13. SAVE ANALYSIS HISTORY
    # =====================================================

    history = AnalysisHistory(

        user_id=user_id,

        body_shape=body_result,

        face_shape=face_result,

        skin_tone=skin_result,

        recommended_category=recommended_category

    )


    db.add(history)

    db.commit()

    db.refresh(history)


    # =====================================================
    # 14. RETURN EVERYTHING
    # =====================================================

    return {

        "message": "AI analysis completed",

        "history_id": history.id,

        "user_id": user_id,

        # ================================================
        # USER INFORMATION
        # ================================================

        "gender": gender,

        "age": age,

        "favorite_color": favorite_color,

        "occasion": occasion,

        "weather": weather,


        # ================================================
        # AI ANALYSIS
        # ================================================

        "body_shape": body_result,

        "face_shape": face_result,

        "skin_tone": skin_result,


        # ================================================
        # OLD RECOMMENDATION
        # ================================================

        "recommended_category": recommended_category,


        # ================================================
        # PERSONALIZED STYLE
        # ================================================

        "preferred_colors": todays_look.get(
            "preferred_colors",
            []
        ),

        "recommended_top_styles": todays_look.get(
            "recommended_top_styles",
            []
        ),

        "recommended_bottom_styles": todays_look.get(
            "recommended_bottom_styles",
            []
        ),

        "recommended_necklines": todays_look.get(
            "recommended_necklines",
            []
        ),


        # ================================================
        # TODAY'S LOOK
        # ================================================

        "todays_look": todays_look.get(
            "outfit",
            {}
        ),


        # ================================================
        # REASONS
        # ================================================

        "reasons": todays_look.get(
            "reasons",
            []
        ),


        # ================================================
        # WEATHER ADVICE
        # ================================================

        "weather_advice": todays_look.get(
            "weather_advice",
            {}
        ),


        # ================================================
        # WARDROBE
        # ================================================

        "wardrobe": {

            "count": len(wardrobe_items),

            "tops": wardrobe_dict["tops"],

            "bottoms": wardrobe_dict["bottoms"],

            "shoes": wardrobe_dict["shoes"],

            "jackets": wardrobe_dict["jackets"],

            "dresses": wardrobe_dict["dresses"]

        },


        # ================================================
        # GENERATED OUTFIT
        # ================================================

        "outfit": outfit,


        # ================================================
        # REAL PRODUCTS
        # ================================================

        "products": product_list

    }