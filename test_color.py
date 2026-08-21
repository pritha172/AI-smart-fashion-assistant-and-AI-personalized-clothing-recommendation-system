from ai_models.color_detection.color_detector import detect_color

image_path = r"C:\Users\Hp\Pictures\Screenshots\Screenshot 2026-08-19 180008.png"

result = detect_color(image_path)

print("\n========== COLOR AI ==========")
print("Detected color:", result)
print("==============================")