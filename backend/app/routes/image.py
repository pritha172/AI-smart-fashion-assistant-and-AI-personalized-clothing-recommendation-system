from fastapi import APIRouter, UploadFile, File
import shutil
import os

router = APIRouter(
    tags=["Image Upload"]
)


BODY_FOLDER = "uploads/body"
FACE_FOLDER = "uploads/face"


os.makedirs(BODY_FOLDER, exist_ok=True)
os.makedirs(FACE_FOLDER, exist_ok=True)


# -------------------------
# Upload Body Image
# -------------------------

@router.post("/upload/body")
def upload_body_image(file: UploadFile = File(...)):

    file_path = f"{BODY_FOLDER}/{file.filename}"

    with open(file_path, "wb") as buffer:

        shutil.copyfileobj(file.file, buffer)

    return {

        "message": "Body image uploaded successfully",

        "filename": file.filename

    }


# -------------------------
# Upload Face Image
# -------------------------

@router.post("/upload/face")
def upload_face_image(file: UploadFile = File(...)):

    file_path = f"{FACE_FOLDER}/{file.filename}"

    with open(file_path, "wb") as buffer:

        shutil.copyfileobj(file.file, buffer)

    return {

        "message": "Face image uploaded successfully",

        "filename": file.filename

    }