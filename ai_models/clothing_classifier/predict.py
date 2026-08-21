import os
import numpy as np
import tensorflow as tf

from tensorflow.keras.preprocessing import image


MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "model",
    "fashion_classifier.keras"
)


model = tf.keras.models.load_model(MODEL_PATH)


CLASS_NAMES = [
    "Top",
    "Bottom",
    "Shoes",
    "Dress",
    "Jacket"
]


def predict_category(image_path):

    img = image.load_img(
        image_path,
        target_size=(224, 224)
    )

    img_array = image.img_to_array(img)

    img_array = np.expand_dims(
        img_array,
        axis=0
    )

    img_array = img_array / 255.0

    prediction = model.predict(img_array)

    class_index = np.argmax(prediction)

    confidence = float(np.max(prediction))

    return {
        "category": CLASS_NAMES[class_index],
        "confidence": round(confidence * 100, 2)
    }