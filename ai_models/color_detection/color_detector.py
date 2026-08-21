import cv2
import numpy as np


def detect_color(image_input):

    # =====================================================
    # LOAD IMAGE
    # =====================================================

    if isinstance(image_input, str):

        image = cv2.imread(image_input)

        if image is None:
            return "Unknown"

        image = cv2.cvtColor(
            image,
            cv2.COLOR_BGR2RGB
        )

    else:

        image = image_input

        if image is None or image.size == 0:
            return "Unknown"

        if image.dtype != np.uint8:

            image = np.clip(
                image,
                0,
                255
            ).astype(np.uint8)

    # =====================================================
    # RESIZE
    # =====================================================

    image = cv2.resize(
        image,
        (300, 300)
    )

    # =====================================================
    # USE CENTRAL REGION
    # =====================================================

    h_img, w_img = image.shape[:2]

    y1 = int(h_img * 0.15)
    y2 = int(h_img * 0.85)

    x1 = int(w_img * 0.15)
    x2 = int(w_img * 0.85)

    crop = image[
        y1:y2,
        x1:x2
    ]

    # =====================================================
    # HSV
    # =====================================================

    hsv = cv2.cvtColor(
        crop,
        cv2.COLOR_RGB2HSV
    )

    h, s, v = cv2.split(hsv)

    # =====================================================
    # REMOVE EXTREME BACKGROUND
    # =====================================================

    valid_mask = ~(
        (s < 10) &
        (v > 245)
    )

    # =====================================================
    # REMOVE VERY DARK EDGE/BACKGROUND PIXELS
    # =====================================================

    valid_mask &= ~(
        (v < 15)
    )

    if np.count_nonzero(valid_mask) < 100:

        return "Unknown"

    garment_h = h[valid_mask]
    garment_s = s[valid_mask]
    garment_v = v[valid_mask]

    # =====================================================
    # BLACK
    # =====================================================

    black_ratio = np.mean(
        garment_v < 55
    )

    if black_ratio > 0.40:

        return "Black"

    # =====================================================
    # WHITE
    # =====================================================

    white_ratio = np.mean(
        (garment_s < 35) &
        (garment_v > 180)
    )

    if white_ratio > 0.40:

        return "White"

    # =====================================================
    # GREY
    # =====================================================

    grey_ratio = np.mean(
        (garment_s < 35) &
        (garment_v >= 55) &
        (garment_v <= 190)
    )

    if grey_ratio > 0.40:

        if np.mean(garment_v) > 140:
            return "Light Grey"

        return "Grey"

    # =====================================================
    # COLORFUL PIXELS
    # =====================================================

    colorful = garment_s > 35

    if np.count_nonzero(colorful) < (
        len(garment_s) * 0.10
    ):

        return "Grey"

    colorful_h = garment_h[colorful]
    colorful_s = garment_s[colorful]
    colorful_v = garment_v[colorful]

    # =====================================================
    # MEDIAN HSV
    # =====================================================

    dominant_h = float(
        np.median(colorful_h)
    )

    dominant_s = float(
        np.median(colorful_s)
    )

    dominant_v = float(
        np.median(colorful_v)
    )

    return classify_hsv(
        dominant_h,
        dominant_s,
        dominant_v
    )


# =========================================================
# HSV CLASSIFICATION
# =========================================================

def classify_hsv(h, s, v):

    # BLACK

    if v < 55:
        return "Black"

    # WHITE

    if s < 35 and v > 180:
        return "White"

    # GREY

    if s < 35:

        if v < 130:
            return "Grey"

        return "Light Grey"

    dark = v < 100

    # BLUE / NAVY

    if 100 <= h <= 130:

        if dark:
            return "Navy"

        return "Blue"

    # PURPLE

    if 130 < h <= 155:
        return "Purple"

    # RED / MAROON

    if h > 155 or h <= 5:

        if dark:
            return "Maroon"

        return "Red"

    # ORANGE / BROWN

    if 5 < h <= 20:

        if dark:
            return "Brown"

        return "Orange"

    # YELLOW

    if 20 < h <= 35:
        return "Yellow"

    # GREEN

    if 35 < h <= 85:

        if dark:
            return "Dark Green"

        return "Green"

    # TEAL

    if 85 < h < 100:
        return "Teal"

    return "Mixed"