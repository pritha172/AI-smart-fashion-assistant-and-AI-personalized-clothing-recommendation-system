import os
import tensorflow as tf

from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, Dropout, GlobalAveragePooling2D
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau


# ============================================================
# SETTINGS
# ============================================================

DATASET_PATH = os.path.join(
    "ai_models",
    "clothing_classifier",
    "dataset",
    "five_class"
)

MODEL_FOLDER = os.path.join(
    "ai_models",
    "clothing_classifier",
    "model"
)

MODEL_PATH = os.path.join(
    MODEL_FOLDER,
    "fashion_classifier.keras"
)

IMAGE_SIZE = (224, 224)

BATCH_SIZE = 32

EPOCHS = 20


# ============================================================
# CHECK DATASET
# ============================================================

print("\n===================================")
print("CLOTHING CLASSIFIER TRAINING")
print("===================================")

print("\nDataset path:")
print(DATASET_PATH)

if not os.path.exists(DATASET_PATH):

    raise FileNotFoundError(
        f"Dataset not found: {DATASET_PATH}"
    )


# ============================================================
# DATA AUGMENTATION
# ============================================================

train_datagen = ImageDataGenerator(

    preprocessing_function=preprocess_input,

    validation_split=0.20,

    rotation_range=15,

    width_shift_range=0.10,

    height_shift_range=0.10,

    zoom_range=0.15,

    horizontal_flip=True
)


validation_datagen = ImageDataGenerator(

    preprocessing_function=preprocess_input,

    validation_split=0.20
)


# ============================================================
# TRAINING DATA
# ============================================================

train_data = train_datagen.flow_from_directory(

    DATASET_PATH,

    target_size=IMAGE_SIZE,

    batch_size=BATCH_SIZE,

    class_mode="categorical",

    subset="training",

    shuffle=True
)


# ============================================================
# VALIDATION DATA
# ============================================================

validation_data = validation_datagen.flow_from_directory(

    DATASET_PATH,

    target_size=IMAGE_SIZE,

    batch_size=BATCH_SIZE,

    class_mode="categorical",

    subset="validation",

    shuffle=False
)


# ============================================================
# CLASS INFORMATION
# ============================================================

print("\n===================================")
print("CLASS INFORMATION")
print("===================================")

print(train_data.class_indices)

print(
    "Number of classes:",
    train_data.num_classes
)


# ============================================================
# MOBILE NET V2 BASE MODEL
# ============================================================

print("\n===================================")
print("LOADING MOBILENETV2")
print("===================================")


base_model = MobileNetV2(

    weights="imagenet",

    include_top=False,

    input_shape=(224, 224, 3)
)


# Freeze pretrained layers initially

base_model.trainable = False


# ============================================================
# CLASSIFICATION HEAD
# ============================================================

x = base_model.output

x = GlobalAveragePooling2D()(x)

x = Dense(
    128,
    activation="relu"
)(x)

x = Dropout(
    0.4
)(x)

output = Dense(

    train_data.num_classes,

    activation="softmax"
)(x)


model = Model(

    inputs=base_model.input,

    outputs=output
)


# ============================================================
# COMPILE MODEL
# ============================================================

model.compile(

    optimizer=tf.keras.optimizers.Adam(
        learning_rate=0.0001
    ),

    loss="categorical_crossentropy",

    metrics=["accuracy"]
)


# ============================================================
# CALLBACKS
# ============================================================

early_stopping = EarlyStopping(

    monitor="val_loss",

    patience=4,

    restore_best_weights=True
)


reduce_lr = ReduceLROnPlateau(

    monitor="val_loss",

    factor=0.5,

    patience=2,

    min_lr=0.000001
)


# ============================================================
# TRAIN MODEL
# ============================================================

print("\n===================================")
print("STARTING TRANSFER LEARNING")
print("===================================")

history = model.fit(

    train_data,

    validation_data=validation_data,

    epochs=EPOCHS,

    callbacks=[
        early_stopping,
        reduce_lr
    ]
)


# ============================================================
# OPTIONAL FINE-TUNING
# ============================================================

print("\n===================================")
print("STARTING FINE-TUNING")
print("===================================")


base_model.trainable = True


# Freeze most of MobileNetV2

for layer in base_model.layers[:-30]:

    layer.trainable = False


model.compile(

    optimizer=tf.keras.optimizers.Adam(
        learning_rate=0.00001
    ),

    loss="categorical_crossentropy",

    metrics=["accuracy"]
)


fine_tune_history = model.fit(

    train_data,

    validation_data=validation_data,

    epochs=10,

    callbacks=[
        early_stopping,
        reduce_lr
    ]
)


# ============================================================
# SAVE MODEL
# ============================================================

os.makedirs(

    MODEL_FOLDER,

    exist_ok=True
)


model.save(

    MODEL_PATH
)


# ============================================================
# FINAL RESULTS
# ============================================================

final_train_accuracy = history.history["accuracy"][-1]

final_val_accuracy = history.history["val_accuracy"][-1]


print("\n===================================")
print("TRAINING COMPLETE")
print("===================================")

print("\nModel saved at:")

print(MODEL_PATH)

print("\nClasses:")

print(train_data.class_indices)

print(
    "\nFinal training accuracy:",
    round(final_train_accuracy * 100, 2),
    "%"
)

print(
    "Final validation accuracy:",
    round(final_val_accuracy * 100, 2),
    "%"
)

print("\n===================================")
print("MODEL READY")
print("===================================")

