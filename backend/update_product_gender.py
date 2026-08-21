from sqlalchemy import text
from app.database.session import engine

with engine.begin() as db:
    db.execute(
        text("""
            UPDATE products
            SET gender = :gender
            WHERE id = :id
        """),
        [
            {"id": 1, "gender": "Female"},
            {"id": 3, "gender": "Female"},
            {"id": 4, "gender": "Male"},
            {"id": 5, "gender": "Female"},
            {"id": 6, "gender": "Male"},
            {"id": 7, "gender": "Female"},
            {"id": 8, "gender": "Male"},
        ]
    )

print("Product genders updated successfully")