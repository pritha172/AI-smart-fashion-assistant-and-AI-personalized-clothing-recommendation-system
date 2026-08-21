import sys
import os


sys.path.append(
    os.path.abspath(
        "../"
    )
)


from ai_models.clothing_analysis.clothing_classifier import analyze_clothing



image_path = "uploads/wardrobe/test.jpg.jpeg"



result = analyze_clothing(
    image_path
)


print(result)