from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database.base import Base
from app.database.session import engine

# -----------------------------
# IMPORT MODELS
# -----------------------------

from app.models import user
from app.models import product
from app.models import cart
from app.models import wishlist
from app.models import order
from app.models import user_preferences
from app.models import analysis_history
from app.models import wardrobe
from app.models import wardrobe_embedding

# -----------------------------
# IMPORT ROUTES
# -----------------------------

from app.routes import auth
from app.routes import products
from app.routes import cart as cart_routes
from app.routes import wishlist as wishlist_routes
from app.routes import order
from app.routes import preferences
from app.routes import history
from app.routes import ai_analysis
from app.routes import wardrobe as wardrobe_routes
from app.routes import image
from app.routes import wardrobe_search
from app.routes import classifier
from app.routes import recommendation
from app.routes import outfit
from app.routes import profile


# -----------------------------
# CREATE DATABASE TABLES
# -----------------------------

Base.metadata.create_all(bind=engine)

# -----------------------------
# CREATE FASTAPI APP
# -----------------------------

app = FastAPI(
    title="AI Smart Fashion Assistant"
)

# -----------------------------
# CORS CONFIGURATION
# -----------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# -----------------------------
# STATIC FILES
# -----------------------------

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)

# -----------------------------
# INCLUDE ROUTERS
# -----------------------------

app.include_router(auth.router)

app.include_router(products.router)

app.include_router(cart_routes.router)

app.include_router(wishlist_routes.router)

app.include_router(order.router)

app.include_router(preferences.router)

app.include_router(history.router)

app.include_router(ai_analysis.router)

app.include_router(wardrobe_routes.router)

app.include_router(image.router)

app.include_router(wardrobe_search.router)

app.include_router(classifier.router)

app.include_router(recommendation.router)

app.include_router(outfit.router)

app.include_router(profile.router)

# -----------------------------
# HOME API
# -----------------------------

@app.get("/")
def home():
    return {
        "message": "AI Smart Fashion Assistant API Running"
    }