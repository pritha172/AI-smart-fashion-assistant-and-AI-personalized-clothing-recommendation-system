import sys
import os


# connect ai_models folder outside backend
sys.path.append(
    os.path.abspath(
        os.path.join(
            os.path.dirname(__file__),
            "../"
        )
    )
)


from ai_models.embeddings.feature_extractor import extract_features



image_path =  "uploads/wardrobe/test.jpg.jpeg"


features = extract_features(image_path)


print("Feature length:")
print(len(features))


print("First 10 values:")
print(features[:10])