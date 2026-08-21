import os
import cv2
import numpy as np
import tensorflow as tf

from tensorflow.keras.applications.mobilenet_v2 import preprocess_input


# ============================================================
# MODEL
# ============================================================

MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "model",
    "fashion_classifier.keras"
)

model = tf.keras.models.load_model(MODEL_PATH)


# IMPORTANT:
# Must match train_model.py class_indices
CLASS_NAMES = [
    "Bottom",
    "Dress",
    "Jacket",
    "Shoes",
    "Top"
]


# ============================================================
# PREDICT CATEGORY
# ============================================================

def predict_category(image_path):

    image = cv2.imread(image_path)

    if image is None:
        return {
            "category": "Unknown",
            "confidence": 0
        }

    # --------------------------------------------------------
    # Convert BGR → RGB
    # --------------------------------------------------------

    image_rgb = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2RGB
    )

    # --------------------------------------------------------
    # Resize
    # --------------------------------------------------------

    image_rgb = cv2.resize(
        image_rgb,
        (224, 224)
    )

    # --------------------------------------------------------
    # MobileNetV2 preprocessing
    # --------------------------------------------------------

    processed = preprocess_input(
        image_rgb.astype(np.float32)
    )

    processed = np.expand_dims(
        processed,
        axis=0
    )

    # --------------------------------------------------------
    # Prediction
    # --------------------------------------------------------

    prediction = model.predict(
        processed,
        verbose=0
    )[0]

    # --------------------------------------------------------
    # Print prediction scores
    # --------------------------------------------------------

    print("\n========== CLOTHING AI ==========")

    for i, name in enumerate(CLASS_NAMES):
        print(
            f"{name}: {prediction[i] * 100:.2f}%"
        )

    print("=================================\n")

    # --------------------------------------------------------
    # Get highest prediction
    # --------------------------------------------------------

    index = int(np.argmax(prediction))

    category = CLASS_NAMES[index]

    confidence = float(prediction[index])

    # --------------------------------------------------------
    # Return
    # --------------------------------------------------------

    return {
        "category": category,
        "confidence": round(
            confidence * 100,
            2
        )
    }