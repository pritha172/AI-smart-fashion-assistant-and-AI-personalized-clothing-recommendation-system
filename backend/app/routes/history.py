from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.database import get_db

from app.models.analysis_history import AnalysisHistory



router = APIRouter(
    prefix="/history",
    tags=["History"]
)



@router.get("/")
def get_history(

    db:Session = Depends(get_db)

):


    history = db.query(
        AnalysisHistory
    ).all()



    history_list=[]


    for item in history:

        history_list.append({

            "id":item.id,

            "user_id":item.user_id,

            "body_shape":item.body_shape,

            "face_shape":item.face_shape,

            "skin_tone":item.skin_tone,

            "recommended_category":item.recommended_category

        })


    return {

        "history":history_list

    }


    history = db.query(
        AnalysisHistory
    ).filter(

        AnalysisHistory.user_id == user_id

    ).all()



    history_list = []


    for item in history:


        history_list.append({

            "id": item.id,

            "body_shape": item.body_shape,

            "face_shape": item.face_shape,

            "skin_tone": item.skin_tone,

            "recommended_category": item.recommended_category

        })



    return {

        "history": history_list

    }