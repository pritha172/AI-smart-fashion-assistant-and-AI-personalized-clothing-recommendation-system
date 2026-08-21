import cv2


def generate_clothing_tags(image_path):


    image = cv2.imread(image_path)


    if image is None:

        return None



    hsv = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2HSV
    )


    brightness = hsv[:,:,2].mean()



    # Color detection

    if brightness > 200:

        color = "White"


    elif brightness > 120:

        color = "Light Color"


    else:

        color = "Dark Color"



    # Basic category detection

    height, width = image.shape[:2]


    if height > width:

        category = "Dress"

    else:

        category = "Top"



    return {


        "category": category,

        "color": color,

        "fabric": "Unknown",

        "style": "Casual",

        "season": "All Season"

    }