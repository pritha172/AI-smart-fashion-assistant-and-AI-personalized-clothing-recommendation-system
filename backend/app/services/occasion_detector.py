def detect_occasions(category, color):
    """
    AI-assisted rule-based occasion detection.

    Uses detected clothing category and color
    to determine suitable occasions.
    """

    category = (category or "").lower().strip()
    color = (color or "").lower().strip()

    occasions = []

    def add(*items):
        for item in items:
            if item not in occasions:
                occasions.append(item)

    # =====================================================
    # T-SHIRTS / TOPS
    # =====================================================

    if any(x in category for x in [
        "t-shirt",
        "tshirt",
        "tee"
    ]):
        add(
            "Casual",
            "Everyday",
            "College",
            "Travel",
            "Athleisure"
        )

        if any(x in color for x in [
            "black",
            "white",
            "navy",
            "dark"
        ]):
            add("Night Out")

    # =====================================================
    # SHIRTS
    # =====================================================

    elif "shirt" in category:

        add(
            "Casual",
            "Everyday",
            "College",
            "Travel",
            "Business Casual"
        )

        if any(x in color for x in [
            "white",
            "black",
            "navy",
            "blue",
            "grey",
            "gray"
        ]):
            add(
                "Office / Work",
                "Formal"
            )

        if any(x in color for x in [
            "white",
            "black",
            "navy"
        ]):
            add("Interview")

    # =====================================================
    # JEANS
    # =====================================================

    elif "jean" in category or "denim" in category:

        add(
            "Casual",
            "Everyday",
            "College",
            "Travel",
            "Outdoor"
        )

        add("Night Out")

    # =====================================================
    # TROUSERS / PANTS
    # =====================================================

    elif any(x in category for x in [
        "trouser",
        "pant",
        "formal pant",
        "chino"
    ]):

        add(
            "Casual",
            "Everyday",
            "Office / Work",
            "Business Casual"
        )

        if any(x in color for x in [
            "black",
            "navy",
            "grey",
            "gray",
            "charcoal"
        ]):
            add(
                "Formal",
                "Interview",
                "Ceremony"
            )

    # =====================================================
    # DRESSES
    # =====================================================

    elif "dress" in category:

        add(
            "Casual",
            "Date",
            "Dinner",
            "Party",
            "Brunch",
            "Vacation / Resort"
        )

        if any(x in color for x in [
            "black",
            "red",
            "burgundy",
            "maroon",
            "dark"
        ]):
            add("Night Out")

        if any(x in color for x in [
            "red",
            "pink",
            "gold",
            "maroon",
            "purple"
        ]):
            add(
                "Wedding",
                "Festive"
            )

    # =====================================================
    # SKIRTS
    # =====================================================

    elif "skirt" in category:

        add(
            "Casual",
            "College",
            "Brunch",
            "Date",
            "Party",
            "Vacation / Resort"
        )

    # =====================================================
    # BLAZER / COAT / JACKET
    # =====================================================

    elif any(x in category for x in [
        "blazer",
        "coat"
    ]):

        add(
            "Office / Work",
            "Business Casual",
            "Formal",
            "Interview",
            "Ceremony"
        )

        if any(x in color for x in [
            "black",
            "navy",
            "charcoal",
            "grey",
            "gray"
        ]):
            add("Formal")

    elif "jacket" in category:

        add(
            "Casual",
            "Everyday",
            "Travel",
            "Outdoor",
            "College",
            "Night Out"
        )

    # =====================================================
    # HOODIE / SWEATSHIRT
    # =====================================================

    elif any(x in category for x in [
        "hoodie",
        "sweatshirt"
    ]):

        add(
            "Casual",
            "Everyday",
            "College",
            "Travel",
            "Outdoor",
            "Athleisure"
        )

    # =====================================================
    # SHORTS
    # =====================================================

    elif "short" in category:

        add(
            "Casual",
            "Everyday",
            "Beach",
            "Vacation / Resort",
            "Travel",
            "Outdoor",
            "Athleisure"
        )

    # =====================================================
    # SHOES
    # =====================================================

    elif any(x in category for x in [
        "shoe",
        "sneaker",
        "trainer"
    ]):

        add(
            "Casual",
            "Everyday",
            "College",
            "Travel",
            "Outdoor",
            "Athleisure"
        )

    elif any(x in category for x in [
        "formal shoe",
        "loafer",
        "oxford"
    ]):

        add(
            "Office / Work",
            "Business Casual",
            "Formal",
            "Interview",
            "Ceremony"
        )

    # =====================================================
    # SAREE / KURTA / ETHNIC WEAR
    # =====================================================

    elif any(x in category for x in [
        "saree",
        "sari",
        "kurta",
        "kurti",
        "lehenga",
        "salwar",
        "sherwani",
        "ethnic",
        "traditional"
    ]):

        add(
            "Traditional / Ethnic",
            "Festive",
            "Religious / Cultural",
            "Wedding",
            "Ceremony"
        )

    # =====================================================
    # SPORTSWEAR
    # =====================================================

    elif any(x in category for x in [
        "sports",
        "gym",
        "activewear",
        "track"
    ]):

        add(
            "Sports / Gym",
            "Athleisure",
            "Outdoor",
            "Everyday"
        )

    # =====================================================
    # SWIMWEAR
    # =====================================================

    elif any(x in category for x in [
        "swim",
        "swimwear",
        "bikini"
    ]):

        add(
            "Beach",
            "Vacation / Resort",
            "Sports / Gym"
        )

    # =====================================================
    # LOUNGE / SLEEPWEAR
    # =====================================================

    elif any(x in category for x in [
        "lounge",
        "sleep",
        "nightwear",
        "pajama",
        "pyjama"
    ]):

        add(
            "Home / Lounge",
            "Sleepwear"
        )

    # =====================================================
    # UNKNOWN CATEGORY
    # =====================================================

    if not occasions:
        add(
            "Casual",
            "Everyday"
        )

    return ", ".join(occasions)