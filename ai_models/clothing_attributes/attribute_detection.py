import cv2


def detect_attributes(image_path):


    image=cv2.imread(image_path)


    if image is None:

        return None



    hsv=cv2.cvtColor(

        image,

        cv2.COLOR_BGR2HSV

    )



    brightness=hsv[:,:,2].mean()



    if brightness > 180:

        color="Light"


    else:

        color="Dark"



    return {


        "category":"Clothing",


        "color":color,


        "season":"All Season"


    }