from fastapi import APIRouter

router = APIRouter(

    prefix="/classifier",

    tags=["Clothing Classifier"]

)


@router.get("/status")

def classifier_status():

    return {

        "message":"Clothing Classifier Ready"

    }