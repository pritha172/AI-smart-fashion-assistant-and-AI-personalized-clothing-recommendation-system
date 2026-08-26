# ============================================================
# TODAY'S LOOK RECOMMENDATION ENGINE
# ============================================================


BODY_SHAPE_STYLES = {

    "hourglass": {
        "tops": [
            "fitted top",
            "wrap top",
            "v-neck top"
        ],
        "bottoms": [
            "high-waist bottom",
            "straight-leg bottom",
            "bootcut bottom"
        ]
    },

    "pear": {
        "tops": [
            "structured top",
            "boat-neck top",
            "bright-colored top"
        ],
        "bottoms": [
            "straight-leg bottom",
            "wide-leg bottom",
            "dark bottom"
        ]
    },

    "apple": {
        "tops": [
            "v-neck top",
            "flowy top",
            "empire-waist top"
        ],
        "bottoms": [
            "straight-leg bottom",
            "bootcut bottom",
            "mid-rise bottom"
        ]
    },

    "rectangle": {
        "tops": [
            "layered top",
            "peplum top",
            "fitted top"
        ],
        "bottoms": [
            "high-waist bottom",
            "wide-leg bottom",
            "bootcut bottom"
        ]
    },

    "inverted triangle": {
        "tops": [
            "simple v-neck top",
            "soft draped top",
            "minimal top"
        ],
        "bottoms": [
            "wide-leg bottom",
            "bootcut bottom",
            "straight-leg bottom"
        ]
    },

    "default": {
        "tops": [
            "well-fitted top",
            "v-neck top",
            "structured top"
        ],
        "bottoms": [
            "straight-leg bottom",
            "regular-fit bottom"
        ]
    }
}


FACE_SHAPE_STYLES = {

    "oval": [
        "v-neck",
        "round neck",
        "boat neck"
    ],

    "round": [
        "v-neck",
        "square neck",
        "open collar"
    ],

    "square": [
        "round neck",
        "v-neck",
        "soft neckline"
    ],

    "heart": [
        "v-neck",
        "boat neck",
        "sweetheart neckline"
    ],

    "diamond": [
        "v-neck",
        "boat neck",
        "open neckline"
    ],

    "oblong": [
        "round neck",
        "boat neck",
        "high neckline"
    ],

    "default": [
        "v-neck",
        "round neck"
    ]
}


SKIN_TONE_COLORS = {

    "fair": [
        "navy",
        "emerald",
        "burgundy",
        "black",
        "royal blue"
    ],

    "light": [
        "navy",
        "green",
        "burgundy",
        "black",
        "blue"
    ],

    "medium": [
        "black",
        "navy",
        "olive",
        "maroon",
        "cream",
        "teal"
    ],

    "wheatish": [
        "navy",
        "olive",
        "maroon",
        "teal",
        "black",
        "cream"
    ],

    "dusky": [
        "white",
        "cream",
        "royal blue",
        "emerald",
        "maroon",
        "mustard"
    ],

    "deep": [
        "white",
        "cream",
        "royal blue",
        "emerald",
        "mustard",
        "red"
    ],

    "dark": [
        "white",
        "cream",
        "royal blue",
        "emerald",
        "mustard",
        "red"
    ],

    "default": [
        "black",
        "white",
        "navy",
        "blue",
        "green"
    ]
}


# ============================================================
# NORMALIZATION
# ============================================================

def normalize(value):
    return str(value or "").strip().lower()


# ============================================================
# STYLE FUNCTIONS
# ============================================================

def get_body_styles(body_shape):

    body_shape = normalize(body_shape)

    for key in BODY_SHAPE_STYLES:

        if key in body_shape:
            return BODY_SHAPE_STYLES[key]

    return BODY_SHAPE_STYLES["default"]


def get_face_styles(face_shape):

    face_shape = normalize(face_shape)

    for key in FACE_SHAPE_STYLES:

        if key in face_shape:
            return FACE_SHAPE_STYLES[key]

    return FACE_SHAPE_STYLES["default"]


def get_skin_colors(skin_tone):

    skin_tone = normalize(skin_tone)

    for key in SKIN_TONE_COLORS:

        if key in skin_tone:
            return SKIN_TONE_COLORS[key]

    return SKIN_TONE_COLORS["default"]


# ============================================================
# COLOR MATCH
# ============================================================

def color_matches(item_color, preferred_colors):

    color = normalize(item_color)

    if not color:
        return False

    for preferred in preferred_colors:

        if preferred in color or color in preferred:
            return True

    return False


# ============================================================
# CATEGORY MATCH
# ============================================================

def category_is(item, category):

    item_category = normalize(item.category)

    return category in item_category


# ============================================================
# WEATHER
# ============================================================

def get_weather_advice(weather):

    # Handle missing weather
    if not weather:
        return {
            "type": "unknown",
            "advice": "Weather information is unavailable."
        }

    # If weather is accidentally a string such as "Summer"
    if isinstance(weather, str):

        condition = normalize(weather)

        if "summer" in condition or "hot" in condition:
            return {
                "type": "hot",
                "advice": "The weather is warm, so lightweight and breathable clothing is recommended."
            }

        if "winter" in condition or "cold" in condition:
            return {
                "type": "cold",
                "advice": "The weather is cool, so warmer clothing or an additional layer is recommended."
            }

        if "rain" in condition:
            return {
                "type": "rain",
                "advice": "Rain is expected, so practical clothing and suitable footwear are recommended."
            }

        return {
            "type": "unknown",
            "advice": f"The current weather is {weather}, so a comfortable everyday outfit is recommended."
        }

    temperature = weather.get("temperature")

    precipitation = weather.get("precipitation") or 0

    condition = normalize(
        weather.get("condition")
    )

    if temperature is None:

        return {
            "type": "unknown",
            "advice": "Weather information is unavailable."
        }

    if (
        precipitation > 0
        or "rain" in condition
        or "thunder" in condition
    ):

        return {
            "type": "rain",
            "advice": "Rain is expected, so practical clothing with suitable footwear and optional outerwear is recommended."
        }

    if temperature >= 30:

        return {
            "type": "hot",
            "advice": "The weather is hot, so lightweight and breathable clothing is recommended."
        }

    if temperature >= 24:

        return {
            "type": "warm",
            "advice": "The weather is warm and comfortable, so a lightweight everyday outfit is suitable."
        }

    if temperature >= 18:

        return {
            "type": "mild",
            "advice": "The temperature is mild, making a regular top and bottom combination suitable."
        }

    return {
        "type": "cold",
        "advice": "The weather is cool, so warmer clothing or an additional layer is recommended."
    }


# ============================================================
# FIND ITEMS
# ============================================================

def find_items(wardrobe, category):

    return [
        item
        for item in wardrobe
        if category_is(item, category)
    ]


# ============================================================
# SELECT BEST ITEM
# ============================================================

def choose_best_item(items, preferred_colors):

    if not items:
        return None

    # First preference: suitable color
    for item in items:

        if color_matches(
            item.color,
            preferred_colors
        ):
            return item

    # Otherwise use first available item
    return items[0]


# ============================================================
# TODAY'S LOOK
# ============================================================

def create_todays_look(
    body_shape,
    skin_tone,
    gender=None,
    age=None,
    favorite_color=None,
    occasion=None,
    weather=None,
    wardrobe_items=None,
    face_shape=None
):

    # --------------------------------------------------------
    # SAFETY
    # --------------------------------------------------------

    wardrobe = wardrobe_items or []

    # --------------------------------------------------------
    # PERSONALIZED STYLE
    # --------------------------------------------------------

    body_styles = get_body_styles(
        body_shape
    )

    face_styles = get_face_styles(
        face_shape
    )

    preferred_colors = get_skin_colors(
        skin_tone
    )

    # Add user's favorite color
    if favorite_color:

        fav = normalize(favorite_color)

        if fav and fav not in preferred_colors:

            preferred_colors.insert(
                0,
                fav
            )

    # --------------------------------------------------------
    # WEATHER
    # --------------------------------------------------------

    weather_advice = get_weather_advice(
        weather
    )

    # --------------------------------------------------------
    # FIND WHOLE WARDROBE
    # --------------------------------------------------------

    tops = find_items(
        wardrobe,
        "top"
    )

    bottoms = find_items(
        wardrobe,
        "bottom"
    )

    dresses = find_items(
        wardrobe,
        "dress"
    )

    shoes = find_items(
        wardrobe,
        "shoe"
    )

    jackets = find_items(
        wardrobe,
        "jacket"
    )

    # --------------------------------------------------------
    # SELECT ITEMS
    # --------------------------------------------------------

    dress = choose_best_item(
        dresses,
        preferred_colors
    )

    top = choose_best_item(
        tops,
        preferred_colors
    )

    bottom = choose_best_item(
        bottoms,
        preferred_colors
    )

    shoe = choose_best_item(
        shoes,
        preferred_colors
    )

    # --------------------------------------------------------
    # RESULT
    # --------------------------------------------------------

    outfit = {}

    reasons = []

    # --------------------------------------------------------
    # DRESS
    # --------------------------------------------------------

    if dress:

        outfit["type"] = "dress"

        outfit["dress"] = {
            "id": dress.id,
            "category": dress.category,
            "color": dress.color,
            "image_url": dress.image_url
        }

        if shoe:

            outfit["shoes"] = {
                "id": shoe.id,
                "category": shoe.category,
                "color": shoe.color,
                "image_url": shoe.image_url
            }

        reasons.append(
            f"The {dress.color or 'selected'} dress matches "
            f"colors recommended for your {skin_tone or 'detected'} skin tone."
        )

    # --------------------------------------------------------
    # TOP + BOTTOM
    # --------------------------------------------------------

    elif top and bottom:

        outfit["type"] = "top_bottom"

        outfit["top"] = {
            "id": top.id,
            "category": top.category,
            "color": top.color,
            "image_url": top.image_url
        }

        outfit["bottom"] = {
            "id": bottom.id,
            "category": bottom.category,
            "color": bottom.color,
            "image_url": bottom.image_url
        }

        if shoe:

            outfit["shoes"] = {
                "id": shoe.id,
                "category": shoe.category,
                "color": shoe.color,
                "image_url": shoe.image_url
            }

        reasons.append(
            f"The {top.category} suits your "
            f"{body_shape or 'detected'} body shape."
        )

        reasons.append(
            f"Recommended top styling includes "
            f"{body_styles['tops'][0]}."
        )

        reasons.append(
            f"For your {face_shape or 'detected'} face shape, "
            f"{face_styles[0]} styles are recommended."
        )

        reasons.append(
            f"The {top.color or 'selected'} color works with "
            f"colors recommended for your {skin_tone or 'detected'} skin tone."
        )

        reasons.append(
            f"The {bottom.color or 'selected'} bottom creates a "
            f"balanced combination with the selected top."
        )

    else:

        outfit["type"] = "category_only"

        reasons.append(
            "There are not enough suitable wardrobe items to create a complete outfit."
        )

    # --------------------------------------------------------
    # WEATHER REASON
    # --------------------------------------------------------

    reasons.append(
        weather_advice["advice"]
    )

    # --------------------------------------------------------
    # JACKET FOR COLD WEATHER
    # --------------------------------------------------------

    if (
        weather_advice["type"] == "cold"
        and jackets
    ):

        jacket = choose_best_item(
            jackets,
            preferred_colors
        )

        outfit["jacket"] = {
            "id": jacket.id,
            "category": jacket.category,
            "color": jacket.color,
            "image_url": jacket.image_url
        }

        reasons.append(
            "A jacket is included because the weather is cool."
        )

    # --------------------------------------------------------
    # FINAL RESPONSE
    # --------------------------------------------------------

    return {

        "outfit": outfit,

        "preferred_colors": preferred_colors,

        "recommended_top_styles":
            body_styles["tops"],

        "recommended_bottom_styles":
            body_styles["bottoms"],

        "recommended_necklines":
            face_styles,

        "reasons":
            reasons,

        "weather_advice":
            weather_advice
    }