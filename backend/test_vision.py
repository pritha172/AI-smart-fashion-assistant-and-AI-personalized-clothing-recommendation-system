import sys
import os


# Access ai_models outside backend

sys.path.append(
    os.path.abspath(
        os.path.join(
            os.path.dirname(__file__),
            ".."
        )
    )
)


import cv2


from ai_models.image_processing.preprocessing import preprocess_image

from ai_models.clothing_segmentation.segmentation import detect_clothing_region



image_path = "uploads/wardrobe/test.jpg"



print("Loading image...")


processed = preprocess_image(
    image_path
)



if processed is None:

    print("Image loading failed")

    exit()



print("Image processed successfully")



result = detect_clothing_region(
    processed
)



if result:


    output_folder = "uploads/segmented"


    os.makedirs(
        output_folder,
        exist_ok=True
    )


    cv2.imwrite(

        f"{output_folder}/upper.png",

        cv2.cvtColor(
            result["upper_body"],
            cv2.COLOR_RGB2BGR
        )

    )


    cv2.imwrite(

        f"{output_folder}/lower.png",

        cv2.cvtColor(
            result["lower_body"],
            cv2.COLOR_RGB2BGR
        )

    )


    print("Segmentation Completed")

    print(
        "Check uploads/segmented folder"
    )


else:

    print("Segmentation failed")