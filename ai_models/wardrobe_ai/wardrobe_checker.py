def check_wardrobe(uploaded_category, wardrobe_items):

    tops = []
    bottoms = []
    shoes = []
    jackets = []
    dresses = []

    for item in wardrobe_items:

        category = (item.category or "").strip().lower()

        # ==============================
        # TOPS
        # ==============================

        if category in [
            "top",
            "shirt",
            "tshirt",
            "t-shirt",
            "t shirt",
            "kurta",
            "blouse",
            "sweater",
            "hoodie"
        ]:

            tops.append(item)

        # ==============================
        # BOTTOMS
        # ==============================

        elif category in [
            "bottom",
            "jeans",
            "trousers",
            "pants",
            "shorts",
            "skirt",
            "leggings"
        ]:

            bottoms.append(item)

        # ==============================
        # SHOES
        # ==============================

        elif category in [
            "shoe",
            "shoes",
            "sneakers",
            "sandal",
            "sandals",
            "boots",
            "heels"
        ]:

            shoes.append(item)

        # ==============================
        # JACKETS
        # ==============================

        elif category in [
            "jacket",
            "coat",
            "blazer"
        ]:

            jackets.append(item)

        # ==============================
        # DRESSES
        # ==============================

        elif category in [
            "dress",
            "gown",
            "frock"
        ]:

            dresses.append(item)

    return {

        "tops": tops,

        "bottoms": bottoms,

        "shoes": shoes,

        "jackets": jackets,

        "dresses": dresses

    }