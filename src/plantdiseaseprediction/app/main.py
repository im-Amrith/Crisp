import os
import json
import sys
import numpy as np
import tensorflow as tf
from PIL import Image

# Set encoding for Windows
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

working_dir = os.path.dirname(os.path.abspath(__file__))
# Use the clean model we generated
model_path = os.path.join(working_dir, "trained_model", "clean_model.keras")

# Load the pre-trained model
model = None
load_error = None
try:
    if os.path.exists(model_path):
        model = tf.keras.models.load_model(model_path, compile=False)
    else:
        load_error = f"File not found at {model_path}"
except Exception as e:
    import traceback
    load_error = f"{str(e)}\n{traceback.format_exc()}"

# loading the class names
class_indices_path = os.path.join(working_dir, "class_indices.json")
class_indices = {}
if os.path.exists(class_indices_path):
    try:
        with open(class_indices_path, "r", encoding='utf-8') as f:
            class_indices = json.load(f)
    except Exception as e:
        class_indices = {"error": str(e)}

# Function to Load and Preprocess the Image using Pillow
def predict_class(model, path, class_indices):
    img1 = Image.open(path)
    img1 = img1.resize((224, 224))
    img1 = img1.convert('RGB')
    img1 = np.array(img1)
    img1 = img1 / 255.0

    # Add batch dimension
    img1 = np.expand_dims(img1, axis=0)
    # Predict
    y_p = model.predict(img1, verbose=0)
    y_predicted = y_p.argmax(axis=1)
    return class_indices.get(str(y_predicted[0]), "Unknown")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No image path provided"}))
        sys.exit(1)

    if model is None:
        print(json.dumps({"error": f"Model failed to load. Error: {load_error}"}))
        sys.exit(1)

    image_path = sys.argv[1]
    if not os.path.exists(image_path):
        print(json.dumps({"error": f"Image file not found: {image_path}"}))
        sys.exit(1)

    try:
        prediction = predict_class(model, image_path, class_indices)
        print(json.dumps({"prediction": prediction}))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
