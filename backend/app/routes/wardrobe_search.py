from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session

import json
import os


from app.database import get_db

from app.models.wardrobe_embedding import WardrobeEmbedding

from app.services.embedding_service import generate_embedding

from app.services.similarity_service import calculate_similarity



router = APIRouter(

    prefix="/wardrobe-search",

    tags=["Wardrobe Search"]

)



@router.post("/similar")

async def search_similar(

    file: UploadFile = File(...),

    db: Session = Depends(get_db)

):


    temp_path = "uploads/temp.jpg"



    with open(temp_path,"wb") as buffer:

        buffer.write(
            await file.read()
        )



    new_embedding = generate_embedding(

        temp_path

    )



    items = db.query(
        WardrobeEmbedding
    ).all()



    results=[]



    for item in items:


        saved_vector=json.loads(

            item.embedding

        )


        similarity = calculate_similarity(

            new_embedding,

            saved_vector

        )


        results.append({

            "image":item.image_path,

            "similarity":similarity

        })



    results.sort(

        key=lambda x:x["similarity"],

        reverse=True

    )


    return {

        "similar_items":results[:5]

    }