from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    ForeignKey,
    DateTime
)

from sqlalchemy.sql import func

from app.database import Base


class Wardrobe(Base):

    __tablename__ = "wardrobe"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    image_url = Column(
        String(500),
        nullable=False
    )

    category = Column(
        String(100),
        nullable=True
    )

    color = Column(
        String(100),
        nullable=True
    )

    fabric = Column(
        String(100),
        nullable=True
    )

    season = Column(
        String(100),
        nullable=True
    )

    occasion = Column(
        String(100),
        nullable=True
    )

    liked = Column(
        Boolean,
        default=False,
        nullable=False
    )

    created_at = Column(
        DateTime,
        server_default=func.now()
    )