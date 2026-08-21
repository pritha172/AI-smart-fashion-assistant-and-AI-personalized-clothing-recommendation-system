import numpy as np
from sklearn.metrics.pairwise import cosine_similarity


def calculate_similarity(
    new_embedding,
    saved_embedding
):


    new_vector = np.array(
        new_embedding
    ).reshape(1,-1)



    saved_vector = np.array(
        saved_embedding
    ).reshape(1,-1)



    score = cosine_similarity(

        new_vector,

        saved_vector

    )[0][0]


    return round(

        float(score)*100,

        2

    )