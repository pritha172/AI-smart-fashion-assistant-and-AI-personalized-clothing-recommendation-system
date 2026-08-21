import sys
import os


sys.path.append(
    os.path.abspath("..")
)


from ai_models.clothing_attributes.tagging import generate_clothing_tags



image="uploads/wardrobe/test.jpg"



result = generate_clothing_tags(image)


print(result)