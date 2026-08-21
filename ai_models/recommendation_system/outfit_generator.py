import random


def generate_outfit(items):

    outfit = {}

    # =====================================
    # DRESS OUTFIT
    # =====================================

    if len(items.get("dresses", [])) > 0:

        outfit["dress"] = random.choice(
            items["dresses"]
        )

        # Add shoes if available
        if len(items.get("shoes", [])) > 0:

            outfit["shoes"] = random.choice(
                items["shoes"]
            )

        # Add jacket if available
        if len(items.get("jackets", [])) > 0:

            outfit["jacket"] = random.choice(
                items["jackets"]
            )

        return outfit

    # =====================================
    # TOP + BOTTOM OUTFIT
    # =====================================

    if len(items.get("tops", [])) > 0:

        outfit["top"] = random.choice(
            items["tops"]
        )

    if len(items.get("bottoms", [])) > 0:

        outfit["bottom"] = random.choice(
            items["bottoms"]
        )

    # =====================================
    # SHOES
    # =====================================

    if len(items.get("shoes", [])) > 0:

        outfit["shoes"] = random.choice(
            items["shoes"]
        )

    # =====================================
    # JACKET
    # =====================================

    if len(items.get("jackets", [])) > 0:

        outfit["jacket"] = random.choice(
            items["jackets"]
        )

    return outfit