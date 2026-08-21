import tensorflow as tf
import numpy as np
import cv2
import os


MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "model",
    "clothing_model.h5"
)



model = None


if os.path.exists(MODEL_PATH):

    model = tf.keras.models.load_model(
        MODEL_PATH
    )



classes = [

    "Top",
    "Bottom",
    "Shoes",
    "Dress",
    "Jacket"

]



def classify_clothing(image_path):


    if model is None:

        return "Unknown"



    image = cv2.imread(
        image_path
    )


    image = cv2.resize(

        image,

        (224,224)

    )


    image = image / 255.0


    image = np.expand_dims(

        image,

        axis=0

    )



    prediction = model.predict(

        image

    )


    index = np.argmax(

        prediction

    )


    confidence = float(

        np.max(prediction)

    )



    return {

        "category":classes[index],

        "confidence":round(
            confidence*100,
            2
        )

    }