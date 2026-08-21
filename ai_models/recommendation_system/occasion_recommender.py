def recommend_occasion(outfit):

    top = outfit.get("top", "")
    bottom = outfit.get("bottom", "")

    if top == "shirt" and bottom == "trousers":

        return "Office"

    elif top == "shirt" and bottom == "jeans":

        return "College"

    elif top == "tshirt":

        return "Casual"

    elif top == "kurta":

        return "Festival"

    elif top == "dress":

        return "Party"

    else:

        return "Everyday Wear"