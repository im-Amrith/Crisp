import h5py
import json
import os

model_path = r"d:\comp\final-annam-ai-agri\src\plantdiseaseprediction\app\trained_model\plant_disease_Pred1.h5"

def print_config():
    with h5py.File(model_path, 'r') as f:
        model_config = f.attrs.get('model_config')
        if isinstance(model_config, bytes):
            model_config = model_config.decode('utf-8')
        
        config = json.loads(model_config)
        print(json.dumps(config, indent=2))

if __name__ == "__main__":
    print_config()
