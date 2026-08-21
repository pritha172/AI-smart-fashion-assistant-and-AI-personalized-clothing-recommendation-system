from sqlalchemy import text
from app.database.connection import engine

try:
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 'MySQL Connected Successfully'"))

        for row in result:
            print(row[0])

except Exception as e:
    print("Connection Error")
    print(e)