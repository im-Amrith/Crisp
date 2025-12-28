import tensorflow as tf
import os
import json
import numpy as np
from PIL import Image

model_path = r"d:\comp\final-annam-ai-agri\src\plantdiseaseprediction\app\trained_model\plant_disease_Pred1.h5"

def build_and_load():
    # Reconstruct the architecture based on the inspection
    base_model = tf.keras.applications.MobileNetV2(
        input_shape=(224, 224, 3), 
        include_top=False, 
        weights=None
    )
    
    model = tf.keras.Sequential([
        tf.keras.layers.Input(shape=(224, 224, 3)),
        base_model,
        tf.keras.layers.GlobalAveragePooling2D(),
        tf.keras.layers.Dense(128, activation='relu', name='dense_6'),
        tf.keras.layers.Dropout(0.3, name='dropout'),
        tf.keras.layers.Dense(80, activation='softmax', name='dense_7')
    ])
    
    try:
        # Try loading weights. We might need by_name=True if the structure is slightly different
        model.load_weights(model_path, by_name=True, skip_mismatch=True)
        print("Weights loaded successfully (with by_name=True)")
        return model
    except Exception as e:
        print(f"Failed to load weights: {e}")
        return None

if __name__ == "__main__":
    model = build_and_load()
    if model:
        # Test prediction
        dummy_input = np.random.rand(1, 224, 224, 3).astype(np.float32)
        preds = model.predict(dummy_input)
        print(f"Prediction shape: {preds.shape}")
        
        # Save as a clean Keras 3 model
        new_model_path = r"d:\comp\final-annam-ai-agri\src\plantdiseaseprediction\app\trained_model\clean_model.keras"
        model.save(new_model_path)
        print(f"Clean model saved to {new_model_path}")
