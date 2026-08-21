from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.database import get_db

from app.models.wardrobe import Wardrobe

from app.services.wardrobe_recommendation import recommend_outfit

from app.models.wardrobe_embedding import WardrobeEmbedding

from ai_models.recommendation_system.similarity_search import find_similar


router=APIRouter(

prefix="/recommend",

tags=["AI Recommendation"]

)



@router.get("/outfit")

def get_outfit(

occasion:str,

db:Session=Depends(get_db)

):


    clothes=db.query(

        Wardrobe

    ).all()



    result=recommend_outfit(

        "Rectangle",

        "Light",

        occasion,

        clothes

    )


    return {

        "recommended_outfit":[

            item.category

            for item in result

        ]

    }

router=APIRouter(

prefix="/recommendation",

tags=["Recommendation"]

)

