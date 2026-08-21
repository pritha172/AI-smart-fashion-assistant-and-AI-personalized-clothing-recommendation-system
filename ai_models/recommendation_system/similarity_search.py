import numpy as np
import json



def cosine_similarity(a,b):


    a=np.array(a)

    b=np.array(b)


    return np.dot(a,b)/(

        np.linalg.norm(a)
        *
        np.linalg.norm(b)

    )




def find_similar(
    uploaded_embedding,
    database_embeddings
):


    results=[]



    for item in database_embeddings:


        score=cosine_similarity(

            uploaded_embedding,

            json.loads(
                item.embedding
            )

        )


        results.append({

            "wardrobe_id":
            item.wardrobe_id,

            "score":
            float(score)

        })



    results.sort(

        key=lambda x:x["score"],

        reverse=True

    )


    return results[:5]