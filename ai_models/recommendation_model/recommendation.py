import os
import joblib
import pandas as pd


# Get current recommendation_model folder path

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)


# Load model and encoders

model = joblib.load(
    os.path.join(
        BASE_DIR,
        "model.pkl"
    )
)


encoders = joblib.load(
    os.path.join(
        BASE_DIR,
        "encoders.pkl"
    )
)

print(encoders.keys())

def get_recommendation(
    body_shape,
    skin_tone,
    gender,
    age,
    favorite_color,
    occasion,
    weather
):

    gender = (gender or "").lower()
    occasion = (occasion or "").lower()
    weather = (weather or "").lower()

    # ============================================
    # SMART RULES
    # ============================================

    if occasion in ["party", "date", "wedding", "festive"]:
        if gender == "female":
            return "Dress"
        return "Blazer"

    if occasion in ["office", "interview", "formal"]:
        if gender == "female":
            return "Top"
        return "Formal Shirt"

    if occasion in ["college", "casual", "travel", "everyday"]:

        if weather == "winter":
            return "Jacket"

        # Don't always recommend jeans
        if gender == "female":
            return "Top"
        else:
            return "T Shirt"

    # ============================================
    # FALLBACK TO TRAINED MODEL
    # ============================================

    data = pd.DataFrame(
        [[
            body_shape.title(),
            skin_tone.title(),
            gender.title(),
            age,
            favorite_color.title(),
            occasion.title(),
            weather.title()
        ]],
        columns=[
            "body_shape",
            "skin_tone",
            "gender",
            "age",
            "favorite_color",
            "occasion",
            "weather"
        ]
    )

    for column in data.columns:
        data[column] = encoders[column].transform(data[column])

    prediction = model.predict(data)

    result = encoders["recommended_product"].inverse_transform(prediction)

    return result[0]