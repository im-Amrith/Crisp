import h5py
import json
import tensorflow as tf
import os

model_path = r"d:\comp\final-annam-ai-agri\src\plantdiseaseprediction\app\trained_model\plant_disease_Pred1.h5"
fixed_model_path = r"d:\comp\final-annam-ai-agri\src\plantdiseaseprediction\app\trained_model\fixed_model.h5"

def fix_model():
    if not os.path.exists(model_path):
        print(f"Model not found at {model_path}")
        return

    with h5py.File(model_path, 'r') as f:
        model_config = f.attrs.get('model_config')
        if model_config is None:
            print("No model_config found in HDF5 file")
            return
        
        if isinstance(model_config, bytes):
            model_config = model_config.decode('utf-8')
        
        config = json.loads(model_config)
        
        # Look for the Functional layer (MobileNetV2) and check its inbound_nodes
        layers = config['config']['layers']
        for layer in layers:
            if layer['class_name'] == 'Functional':
                # Keras 3 sometimes trips over multiple inbound nodes
                if 'inbound_nodes' in layer and len(layer['inbound_nodes']) > 1:
                    print(f"Found {len(layer['inbound_nodes'])} inbound nodes for Functional layer. Reducing to 1.")
                    layer['inbound_nodes'] = [layer['inbound_nodes'][0]]
            
            # Also check for the 'batch_shape' vs 'batch_input_shape' issue
            if layer['class_name'] == 'InputLayer':
                if 'batch_shape' in layer['config'] and 'batch_input_shape' not in layer['config']:
                    layer['config']['batch_input_shape'] = layer['config']['batch_shape']

        # Re-serialize
        new_config = json.dumps(config).encode('utf-8')
        
    # Create a new file with the fixed config and original weights
    import shutil
    shutil.copy(model_path, fixed_model_path)
    
    with h5py.File(fixed_model_path, 'a') as f:
        f.attrs.modify('model_config', new_config)
    
    print(f"Fixed model saved to {fixed_model_path}")

if __name__ == "__main__":
    fix_model()
