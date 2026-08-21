import tensorflow as tf
import numpy as np

from keras.utils import load_img, img_to_array


# Load MobileNetV2 model

model = tf.keras.applications.MobileNetV2(

    weights="imagenet",

    include_top=False,

    pooling="avg"

)



def extract_features(image_path):


    # Load image

    img = load_img(

        image_path,

        target_size=(224, 224)

    )


    # Convert image to array

    img_array = img_to_array(img)



    # Add batch dimension

    img_array = np.expand_dims(

        img_array,

        axis=0

    )



    # Preprocess for MobileNetV2

    img_array = tf.keras.applications.mobilenet_v2.preprocess_input(

        img_array

    )



    # Extract features

    features = model.predict(

        img_array

    )


    # Return 1280 vector

    return features[0].tolist()