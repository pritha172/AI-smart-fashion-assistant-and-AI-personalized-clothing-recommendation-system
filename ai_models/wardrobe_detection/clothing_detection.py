import cv2
import numpy as np


def detect_clothing(image):

    if image is None:

        return {

            "category": "Unknown",

            "color": "Unknown",

            "fabric": "Unknown",

            "season": "Unknown",

            "style": "Unknown"

        }


    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

    average = np.mean(hsv[:, :, 2])


    if average > 180:

        color = "White"

    elif average > 130:

        color = "Light"

    else:

        color = "Dark"


    height, width = image.shape[:2]

    ratio = width / height


    if ratio > 0.90:

        category = "T-Shirt"

    elif ratio > 0.75:

        category = "Shirt"

    else:

        category = "Dress"


    # Temporary fabric detection
    if category in ["T-Shirt", "Shirt"]:

        fabric = "Cotton"

    else:

        fabric = "Denim"


    if color == "Dark":

        season = "Winter"

    else:

        season = "Summer"


    style = "Casual"


    return {

        "category": category,

        "color": color,

        "fabric": fabric,

        "season": season,

        "style": style

    }