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

from fastapi import APIRouter, UploadFile, File, Depends, Form, HTTPException
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
from typing import Optional

from app.models.wardrobe import Wardrobe
from app.services.weather_service import get_current_weather
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
    # 5. GET OTHER USER PREFERENCES
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

    print("\n================ RECOMMENDATION DEBUG ================")
    print("Body Shape     :", body_result)
    print("Skin Tone      :", skin_result)
    print("Gender         :", gender)
    print("Age            :", age)
    print("Favorite Color :", favorite_color)
    print("Occasion       :", occasion)
    print("Weather        :", weather)
    print("=======================================================\n")

    recommended_category = get_recommendation(
        body_result,
        skin_result,
        gender,
        age,
        favorite_color,
        occasion,
        weather
    )

    print(">>> RECOMMENDED CATEGORY:", recommended_category)
    print("=======================================================\n")


    # =====================================================
    # 7. GET USER WARDROBE
    # =====================================================

    wardrobe_items = db.query(
        Wardrobe
    ).filter(
        Wardrobe.user_id == user_id
    ).all()

    # =====================================================
    # GET USER'S COMPLETE WARDROBE
    # =====================================================

    wardrobe = db.query(Wardrobe).filter(
        Wardrobe.user_id == user_id
    ).all()

    # =====================================================
    # 8. ORGANIZE WARDROBE
    # =====================================================

    wardrobe_groups = check_wardrobe(
        recommended_category,
        wardrobe_items
    )


    # =====================================================
    # 9. GENERATE OUTFIT
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
            for item in wardrobe_groups["tops"]
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
            for item in wardrobe_groups["bottoms"]
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
            for item in wardrobe_groups["shoes"]
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
            for item in wardrobe_groups["jackets"]
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
            for item in wardrobe_groups["dresses"]
        ]

    }


    outfit = generate_outfit(
        wardrobe_dict
    )

    # =====================================================
    # 10. GENERATE TODAY'S LOOK
    # =====================================================

    todays_look = create_todays_look(
        body_shape=body_result,
        skin_tone=skin_result,
        gender=gender,
        age=age,
        favorite_color=favorite_color,
        occasion=occasion,
        weather=weather,
        wardrobe=wardrobe_dict
    )
    


    # =====================================================
    # 11. GET REAL PRODUCTS
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

            "price": float(product.price or 0),

            "image_url": product.image_url,

            "brand": product.brand,

            "product_url": product.product_url,

            "source": product.source,

            "rating": product.rating

        })


    # =====================================================
    # 12. SAVE ANALYSIS HISTORY
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
    # 13. RETURN EVERYTHING
    # =====================================================

    return {

        "message": "AI analysis completed",

        "history_id": history.id,

        "user_id": user_id,

        "gender": gender,

        "body_shape": body_result,

        "face_shape": face_result,

        "skin_tone": skin_result,

        "recommended_category": recommended_category,

        "wardrobe": {

            "count": len(wardrobe_items),

            "tops": wardrobe_dict["tops"],

            "bottoms": wardrobe_dict["bottoms"],

            "shoes": wardrobe_dict["shoes"],

            "jackets": wardrobe_dict["jackets"],

            "dresses": wardrobe_dict["dresses"],

            "recommended_top_styles": todays_look["recommended_top_styles"],
            
            "recommended_bottom_styles": todays_look["recommended_bottom_styles"],
            
            "recommended_necklines": todays_look["recommended_necklines"],
            
            "preferred_colors": todays_look["preferred_colors"],
            
            "todays_look": todays_look["outfit"],
            
            "reasons": todays_look["reasons"]

        },

        "outfit": outfit,

        "products": product_list

    }