def generate_outfit_recommendation(
    wardrobe_items,
    occasion="Casual"
):

    tops=[]
    bottoms=[]
    shoes=[]


    for item in wardrobe_items:


        category=item["category"].lower()


        if "shirt" in category or "top" in category:

            tops.append(item)


        elif "jeans" in category or "pant" in category:

            bottoms.append(item)


        elif "shoe" in category:

            shoes.append(item)



    recommendation={


        "occasion":occasion,


        "top":

        tops[0] if tops else "No top found",



        "bottom":

        bottoms[0] if bottoms else "No bottom found",



        "shoes":

        shoes[0] if shoes else "No shoes found",



        "style_score":"90%"


    }


    return recommendation