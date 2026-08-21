import joblib
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

encoders = joblib.load(
    os.path.join(BASE_DIR, "encoders.pkl")
)

for key in encoders:
    print(key, ":", encoders[key].classes_)