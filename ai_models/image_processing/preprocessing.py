import cv2
import os


def preprocess_image(image_path):

    image = cv2.imread(image_path)


    if image is None:

        return None



    # Resize image for AI processing

    image = cv2.resize(
        image,
        (512,512)
    )


    # Convert to RGB

    image = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2RGB
    )


    return image