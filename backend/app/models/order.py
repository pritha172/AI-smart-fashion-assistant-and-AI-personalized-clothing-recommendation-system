from sqlalchemy import Column,Integer,ForeignKey,Numeric,String,DateTime

from sqlalchemy.sql import func

from app.database.base import Base



class Order(Base):

    __tablename__="orders"


    id=Column(
        Integer,
        primary_key=True
    )


    user_id=Column(
        Integer,
        ForeignKey("users.id")
    )


    total_price=Column(
        Numeric(10,2)
    )


    status=Column(
        String(50),
        default="Placed"
    )


    created_at=Column(
        DateTime,
        server_default=func.now()
    )