import os
import shutil


# =====================================================
# PATHS
# =====================================================

SOURCE_FOLDER = "ai_models/clothing_classifier/dataset/processed"

OUTPUT_FOLDER = "ai_models/clothing_classifier/dataset/five_class"


# =====================================================
# MAXIMUM IMAGES PER FINAL CATEGORY
# =====================================================

MAX_IMAGES = 250


# =====================================================
# OLD DATASET → NEW 5 CATEGORIES
# =====================================================

category_mapping = {

    "Top": [
        "tshirts",
        "shirts",
        "kurta"
    ],

    "Bottom": [
        "jeans",
        "trousers"
    ],

    "Shoes": [
        "shoes"
    ],

    "Dress": [
        "dresses"
    ],

    "Jacket": [
        "jackets"
    ]

}


# =====================================================
# CREATE OUTPUT FOLDERS
# =====================================================

for category in category_mapping:

    folder = os.path.join(
        OUTPUT_FOLDER,
        category
    )

    os.makedirs(
        folder,
        exist_ok=True
    )


# =====================================================
# COPY IMAGES
# =====================================================

total_copied = 0


for new_category, old_categories in category_mapping.items():

    count = 0

    print("\n===================================")
    print(f"Creating category: {new_category}")
    print("===================================")


    for old_category in old_categories:

        source_path = os.path.join(
            SOURCE_FOLDER,
            old_category
        )


        if not os.path.exists(source_path):

            print(
                f"Source folder not found: {source_path}"
            )

            continue


        files = [

            file
            for file in os.listdir(source_path)

            if file.lower().endswith(
                (".jpg", ".jpeg", ".png")
            )

        ]


        for file in files:

            if count >= MAX_IMAGES:

                break


            source_file = os.path.join(
                source_path,
                file
            )


            # Give every copied image a unique name
            new_name = (
                f"{new_category.lower()}_{count + 1}.jpg"
            )


            destination_file = os.path.join(
                OUTPUT_FOLDER,
                new_category,
                new_name
            )


            shutil.copy2(
                source_file,
                destination_file
            )


            count += 1
            total_copied += 1


        if count >= MAX_IMAGES:

            break


    print(
        f"{new_category}: {count}/{MAX_IMAGES} images"
    )


# =====================================================
# FINAL RESULT
# =====================================================

print("\n===================================")
print("5-CLASS DATASET CREATED")
print("===================================")

print(
    f"Total images copied: {total_copied}"
)


for category in category_mapping:

    folder = os.path.join(
        OUTPUT_FOLDER,
        category
    )


    count = len([

        file
        for file in os.listdir(folder)

        if file.lower().endswith(
            (".jpg", ".jpeg", ".png")
        )

    ])


    print(
        f"{category}: {count} images"
    )