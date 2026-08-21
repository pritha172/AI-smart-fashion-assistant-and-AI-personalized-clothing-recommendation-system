from fastapi import APIRouter,Depends

from sqlalchemy.orm import Session

from app.database import get_db

from app.models.user_preferences import UserPreference



router = APIRouter(
    prefix="/preferences",
    tags=["Preferences"]
)



@router.post("/")
def create_preferences(
    
    user_id:int,
    gender:str,
    age:int,
    favorite_color:str,
    style:str,
    occasion:str,
    weather:str,

    db:Session=Depends(get_db)

):


    preference = UserPreference(

        user_id=user_id,

        gender=gender,

        age=age,

        favorite_color=favorite_color,

        style=style,

        occasion=occasion,

        weather=weather

    )


    db.add(preference)

    db.commit()

    db.refresh(preference)



    return {

        "message":"Preferences saved",

        "id":preference.id

    }