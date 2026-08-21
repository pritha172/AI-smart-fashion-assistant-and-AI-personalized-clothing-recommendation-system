import cv2
import numpy as np


def detect_skin_tone(image):

    # Check image
    if image is None:
        return "No image provided"


    # Convert BGR to HSV
    hsv = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2HSV
    )


    lower = np.array(
        [0, 20, 70]
    )


    upper = np.array(
        [20, 255, 255]
    )


    mask = cv2.inRange(
        hsv,
        lower,
        upper
    )


    pixels = image[mask > 0]


    if len(pixels) == 0:
        return "Unknown"


    average = np.mean(pixels)


    if average > 180:
        return "Fair"

    elif average > 140:
        return "Light"

    elif average > 100:
        return "Medium"

    elif average > 70:
        return "Brown"

    else:
        return "Dark"