from sqlalchemy import Column, Integer, Text

from app.database.base import Base



class WardrobeEmbedding(Base):


    __tablename__ = "wardrobe_embeddings"


    id = Column(

        Integer,

        primary_key=True

    )


    wardrobe_id = Column(

        Integer

    )


    embedding = Column(

        Text

    )