def recommend_outfit(

    body_shape,

    skin_tone,

    occasion,

    wardrobe_items

):


    recommendations=[]



    for item in wardrobe_items:


        if occasion.lower()=="party":

            if item.category in [

                "Shirt",

                "Gown",

                "Dress"

            ]:

                recommendations.append(item)



        elif occasion.lower()=="casual":


            if item.category in [

                "Jeans",

                "Top",

                "Tshirt"

            ]:

                recommendations.append(item)



    return recommendations[:3]