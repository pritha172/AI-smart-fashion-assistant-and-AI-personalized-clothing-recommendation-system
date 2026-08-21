import cv2


def detect_color(image):

    image = cv2.resize(
        image,
        (100,100)
    )

    avg_color = image.mean(
        axis=0
    ).mean(
        axis=0
    )


    b,g,r = avg_color


    if r > 150 and g > 150 and b > 150:
        return "White"


    elif r < 70 and g < 70 and b < 70:
        return "Black"


    elif b > r and b > g:
        return "Blue"


    elif r > g and r > b:
        return "Red"


    else:
        return "Mixed"



def detect_category():

    # temporary AI logic
    # later replace with trained model

    return "Clothing"



def detect_season(category):

    if category in [
        "Jacket",
        "Blazer",
        "Coat"
    ]:
        return "Winter"


    return "All Season"



def detect_occasion(category):

    if category in [
        "Blazer",
        "Shirt"
    ]:
        return "Formal, Office"


    return "Casual"



def analyze_clothing(image_path):


    image = cv2.imread(
        image_path
    )


    if image is None:

        return {
            "error":"Image not found"
        }



    category = detect_category()


    color = detect_color(
        image
    )


    season = detect_season(
        category
    )


    occasion = detect_occasion(
        category
    )


    return {


        "category":category,


        "color":color,


        "season":season,


        "occasion":occasion


    }