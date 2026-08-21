from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database.base import Base


DATABASE_URL = "mysql+pymysql://root:gilgamesh#007@localhost:3306/ai_fashion"


engine = create_engine(
    DATABASE_URL,
    echo=True
)


SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)



def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()