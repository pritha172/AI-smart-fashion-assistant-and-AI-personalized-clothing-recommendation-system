import os
import shutil
import json

from fastapi import APIRouter, UploadFile, File, Depends, Form, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.wardrobe import Wardrobe
from app.models.wardrobe_embedding import WardrobeEmbedding

from ai_models.embeddings.feature_extractor import extract_features
from ai_models.clothing_classifier.category_predictor import predict_category
from ai_models.color_detection.color_detector import detect_color
from app.services.occasion_detector import detect_occasions
from ai_models.image_processing.preprocessing import preprocess_image
from ai_models.clothing_segmentation.segmentation import detect_clothing_region


router = APIRouter(
    prefix="/wardrobe",
    tags=["Wardrobe"]
)

UPLOAD_FOLDER = "uploads/wardrobe"

UPPER_KEYWORDS = [
    "shirt", "t-shirt", "tshirt", "tee", "top", "blazer",
    "coat", "jacket", "hoodie", "sweatshirt"
]

LOWER_KEYWORDS = [
    "jean", "denim", "trouser", "pant", "chino",
    "skirt", "short"
]


def get_color_region(category_name, processed_image, full_image_path):
    """
    Decides which region of the image to run color detection on,
    based on the detected clothing category.
    """

    category_lower = (category_name or "").lower()

    is_upper = any(k in category_lower for k in UPPER_KEYWORDS)
    is_lower = any(k in category_lower for k in LOWER_KEYWORDS)

    # Dresses, sarees, kurtas, full-body wear -> use full image
    if not is_upper and not is_lower:
        return full_image_path

    regions = detect_clothing_region(processed_image)

    if regions is None:
        return full_image_path

    if is_upper:
        return regions["upper_body"]

    if is_lower:
        return regions["lower_body"]

    return full_image_path

# =====================================================
# UPLOAD WARDROBE
# =====================================================

@router.post("/upload")
async def upload_wardrobe(
    file: UploadFile = File(...),
    user_id: int = Form(...),
    db: Session = Depends(get_db)
):

    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    image_path = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    with open(image_path, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer
        )

    # =================================================
    # AI FEATURE EXTRACTION
    # =================================================

    features = extract_features(image_path)

    # =================================================
    # CLOTHING CLASSIFICATION
    # =================================================


    category_result = predict_category(image_path)

    category_name = category_result.get(
        "category",
        
    )
    

    # =================================================
    # COLOR DETECTION (region-aware)
    # =================================================

    processed_image = preprocess_image(image_path)

    color_region = get_color_region(
        category_name,
        processed_image,
        image_path
    )

    color = detect_color(
        color_region
    )

    


    # =====================================================
    # OCCASION DETECTION
    # =====================================================

    try:

        occasion = detect_occasions(
            category_name,
            color
        )

    except Exception as e:

        print(
            "Occasion detection error:",
            e
        )

        occasion = "Casual, Everyday"

    # =================================================
    # SAVE WARDROBE
    # =================================================

    wardrobe_item = Wardrobe(
        user_id=user_id,
        image_url=image_path,
        category=category_name,
        color=color,
        season="All",
        occasion=occasion,
        liked=False
    )

    db.add(wardrobe_item)
    db.commit()
    db.refresh(wardrobe_item)

    # =================================================
    # SAVE EMBEDDING
    # =================================================

    embedding_data = (
        features.tolist()
        if hasattr(features, "tolist")
        else features
    )

    embedding_item = WardrobeEmbedding(
        wardrobe_id=wardrobe_item.id,
        embedding=json.dumps(embedding_data)
    )

    db.add(embedding_item)
    db.commit()

    return {
        "message": "Wardrobe uploaded successfully",

        "wardrobe_id": wardrobe_item.id,

        "user_id": user_id,

        "category": category_name,

        "color": color,

        "occasion": occasion,

        "liked": bool(wardrobe_item.liked),

        "image": image_path,

        "feature_length": len(features)
    }


# =====================================================
# GET MY WARDROBE
# =====================================================

@router.get("/my-wardrobe")
def get_my_wardrobe(
    user_id: int,
    db: Session = Depends(get_db)
):

    clothes = db.query(Wardrobe).filter(
        Wardrobe.user_id == user_id
    ).all()

    wardrobe_list = []

    for item in clothes:

        wardrobe_list.append({
            "id": item.id,
            "user_id": item.user_id,
            "image_url": item.image_url,
            "category": item.category,
            "color": item.color,
            "fabric": item.fabric,
            "season": item.season,
            "occasion": item.occasion,
            "liked": item.liked
        })

    return {
        "user_id": user_id,
        "total_items": len(wardrobe_list),
        "wardrobe": wardrobe_list
    }


# =====================================================
# SEARCH MY WARDROBE
# =====================================================

@router.get("/search")
def search_wardrobe(
    user_id: int,
    query: str = "",
    db: Session = Depends(get_db)
):

    clothes = db.query(Wardrobe).filter(
        Wardrobe.user_id == user_id
    ).all()

    query = query.lower().strip()

    # If search is empty, return all wardrobe items
    if not query:
        matched_clothes = clothes

    else:

        # Split search into individual words
        search_words = query.split()

        matched_clothes = []

        for item in clothes:

            searchable_text = " ".join([
                str(item.category or ""),
                str(item.color or ""),
                str(item.fabric or ""),
                str(item.season or ""),
                str(item.occasion or "")
            ]).lower()

            # Every search word must exist somewhere
            # in the item's wardrobe information
            match = all(
                word in searchable_text
                for word in search_words
            )

            if match:
                matched_clothes.append(item)

    wardrobe_list = []

    for item in matched_clothes:

        wardrobe_list.append({
            "id": item.id,
            "user_id": item.user_id,
            "image_url": item.image_url,
            "category": item.category,
            "color": item.color,
            "fabric": item.fabric,
            "season": item.season,
            "occasion": item.occasion,
            "liked": item.liked
        })

    return {
        "user_id": user_id,
        "query": query,
        "total_items": len(wardrobe_list),
        "wardrobe": wardrobe_list
    }


# =====================================================
# GET ALL WARDROBE
# =====================================================

@router.get("/all")
def get_all_wardrobe(
    user_id: int,
    db: Session = Depends(get_db)
):

    clothes = db.query(Wardrobe).filter(
        Wardrobe.user_id == user_id
    ).all()

    wardrobe_list = []

    for item in clothes:

        wardrobe_list.append({
            "id": item.id,
            "user_id": item.user_id,
            "image_url": item.image_url,
            "category": item.category,
            "color": item.color,
            "fabric": item.fabric,
            "season": item.season,
            "occasion": item.occasion,
            "liked": item.liked
        })

    return wardrobe_list
# =====================================================
# GET WARDROBE BY OCCASION
# =====================================================

@router.get("/by-occasion")
def get_wardrobe_by_occasion(
    user_id: int,
    occasion: str,
    db: Session = Depends(get_db)
):

    occasion = occasion.strip().lower()

    clothes = db.query(Wardrobe).filter(
        Wardrobe.user_id == user_id
    ).all()

    wardrobe_list = []

    for item in clothes:

        item_occasions = [
            o.strip().lower()
            for o in str(item.occasion or "").split(",")
        ]

        if occasion in item_occasions:

            wardrobe_list.append({
                "id": item.id,
                "user_id": item.user_id,
                "image_url": item.image_url,
                "category": item.category,
                "color": item.color,
                "fabric": item.fabric,
                "season": item.season,
                "occasion": item.occasion,
                "liked": item.liked
            })

    return {
        "user_id": user_id,
        "occasion": occasion,
        "total_items": len(wardrobe_list),
        "wardrobe": wardrobe_list
    }


# =====================================================
# LIKE / UNLIKE WARDROBE ITEM
# =====================================================

@router.put("/{wardrobe_id}/like")
def toggle_like(
    wardrobe_id: int,
    user_id: int,
    db: Session = Depends(get_db)
):

    item = db.query(Wardrobe).filter(
        Wardrobe.id == wardrobe_id,
        Wardrobe.user_id == user_id
    ).first()

    if item is None:
        raise HTTPException(
            status_code=404,
            detail="Wardrobe item not found for this user"
        )

    item.liked = not bool(item.liked)

    db.commit()
    db.refresh(item)

    return {
        "message": "Wardrobe like status updated",
        "wardrobe_id": item.id,
        "liked": bool(item.liked)
    }

# =====================================================
# DELETE WARDROBE ITEM
# =====================================================

@router.delete("/{wardrobe_id}")
def delete_wardrobe(
    wardrobe_id: int,
    user_id: int,
    db: Session = Depends(get_db)
):

    item = db.query(Wardrobe).filter(
        Wardrobe.id == wardrobe_id,
        Wardrobe.user_id == user_id
    ).first()

    if item is None:
        raise HTTPException(
            status_code=404,
            detail="Wardrobe item not found for this user"
        )

    # =================================================
    # DELETE EMBEDDING
    # =================================================

    db.query(WardrobeEmbedding).filter(
        WardrobeEmbedding.wardrobe_id == wardrobe_id
    ).delete(
        synchronize_session=False
    )

    # =================================================
    # DELETE IMAGE
    # =================================================

    if item.image_url:

        image_path = item.image_url.replace(
            "/",
            os.sep
        )

        if os.path.exists(image_path):

            try:
                os.remove(image_path)
            except Exception:
                pass

    # =================================================
    # DELETE DATABASE RECORD
    # =================================================

    db.delete(item)
    db.commit()

    return {
        "message": "Wardrobe item deleted successfully",
        "wardrobe_id": wardrobe_id
    }
