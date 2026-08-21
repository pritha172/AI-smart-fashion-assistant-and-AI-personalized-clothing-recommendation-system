from sqlalchemy import Column,Integer,String,ForeignKey

from app.database.base import Base



class UserPreference(Base):

    __tablename__="user_preferences"


    id = Column(
        Integer,
        primary_key=True,
        index=True
    )


    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )


    gender = Column(
        String(20)
    )


    age = Column(
        Integer
    )


    favorite_color = Column(
        String(50)
    )


    style = Column(
        String(50)
    )


    occasion = Column(
        String(50)
    )


    weather = Column(
        String(50)
    )