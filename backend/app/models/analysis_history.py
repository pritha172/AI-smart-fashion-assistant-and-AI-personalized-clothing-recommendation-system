from sqlalchemy import Column, Integer, String
from app.database.base import Base


class AnalysisHistory(Base):

    __tablename__ = "analysis_history"


    id = Column(
        Integer,
        primary_key=True,
        index=True
    )


    user_id = Column(
        Integer
    )


    body_shape = Column(
        String(50)
    )


    face_shape = Column(
        String(50)
    )


    skin_tone = Column(
        String(50)
    )


    recommended_category = Column(
        String(100)
    )