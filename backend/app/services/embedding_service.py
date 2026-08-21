import sys
import os
import json

sys.path.append(
    os.path.abspath(
        os.path.join(
            os.path.dirname(__file__),
            "../../../"
        )
    )
)


from ai_models.embeddings.feature_extractor import extract_features



def generate_embedding(image_path):

    vector = extract_features(
        image_path
    )

    return vector

def convert_embedding(vector):

    return json.dumps(vector)