from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import SessionLocal
from app.models.user import User
from app.schemas.user_schema import UserCreate, UserLogin
from app.utils.security import hash_password, verify_password


router = APIRouter()


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# =========================
# REGISTER
# =========================

@router.post("/register")
def register(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    # Check if email already exists
    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:

        return {
            "error": "Email already registered"
        }


    hashed = hash_password(user.password)


    new_user = User(

        name=user.name,

        email=user.email,

        password=hashed,

        gender=user.gender

    )


    db.add(new_user)

    db.commit()

    db.refresh(new_user)


    return {

        "message": "User registered successfully",

        "user": {

            "id": new_user.id,

            "name": new_user.name,

            "email": new_user.email,

            "gender": new_user.gender

        }

    }


# =========================
# LOGIN
# =========================

@router.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()


    if not existing_user:

        return {
            "error": "User not found"
        }


    if not verify_password(
        user.password,
        existing_user.password
    ):

        return {
            "error": "Wrong password"
        }


    # Return complete user information
    return {

        "message": "Login successful",

        "user": {

            "id": existing_user.id,

            "name": existing_user.name,

            "email": existing_user.email,

            "gender": existing_user.gender

        }

    }