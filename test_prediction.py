from ai_models.clothing_classifier.category_predictor import predict_category

image_path = r"C:\Users\Hp\Pictures\Screenshots\Screenshot 2026-08-19 180008.png"

result = predict_category(image_path)

print("\nFINAL RESULT")
print(result)