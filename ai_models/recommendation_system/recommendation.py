def get_recommendation(
    body_shape,
    face_shape,
    skin_tone
):

    result = {

        "tops": [],

        "bottoms": [],

        "shoes": [],

        "accessories": []

    }


    # Body Shape Recommendation

    if body_shape == "Rectangle":

        result["tops"] = [
            "Peplum Top",
            "Layered Shirt"
        ]

        result["bottoms"] = [
            "Wide Leg Jeans",
            "Straight Pants"
        ]


    elif body_shape == "Pear":

        result["tops"] = [
            "Puff Sleeve Top",
            "Off Shoulder Top"
        ]

        result["bottoms"] = [
            "Straight Jeans",
            "Bootcut Pants"
        ]


    elif body_shape == "Hourglass":

        result["tops"] = [
            "Fitted Top"
        ]

        result["bottoms"] = [
            "High Waist Jeans"
        ]


    else:

        result["tops"] = [
            "Casual Shirt"
        ]

        result["bottoms"] = [
            "Blue Jeans"
        ]



    # Shoes

    result["shoes"] = [

        "White Sneakers"

    ]


    # Skin Tone Based Accessories

    if skin_tone == "Fair":

        result["accessories"] = [

            "Silver Watch"

        ]


    else:

        result["accessories"] = [

            "Gold Watch"

        ]


    return result