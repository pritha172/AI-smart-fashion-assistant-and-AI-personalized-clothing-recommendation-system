import pandas as pd

from sklearn.preprocessing import LabelEncoder

from sklearn.tree import DecisionTreeClassifier

import joblib



# Load dataset

data = pd.read_csv(
    "dataset.csv"
)



print(data.head())



# Create encoders

encoders = {}



# Convert text columns into numbers

for column in data.columns:

    encoder = LabelEncoder()

    data[column] = encoder.fit_transform(
        data[column]
    )

    encoders[column] = encoder



# Separate input and output


X = data.drop(
    "recommended_product",
    axis=1
)


y = data[
    "recommended_product"
]



# Create model

model = DecisionTreeClassifier()



# Train model

model.fit(
    X,
    y
)



# Save model

joblib.dump(
    model,
    "model.pkl"
)



joblib.dump(
    encoders,
    "encoders.pkl"
)



print(
    "Model trained successfully"
)