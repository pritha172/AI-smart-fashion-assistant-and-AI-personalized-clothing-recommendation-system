import cv2


def detect_clothing_region(image):

    if image is None:
        return None

    height, width = image.shape[:2]

    # =====================================================
    # UPPER BODY
    # =====================================================

    upper_body = image[
        int(height * 0.10):
        int(height * 0.58),
        0:width
    ]

    # =====================================================
    # LOWER BODY
    # =====================================================

    lower_body = image[
        int(height * 0.42):
        int(height * 0.95),
        0:width
    ]

    return {
        "upper_body": upper_body,
        "lower_body": lower_body
    }