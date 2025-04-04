import sys
import json
import joblib
import numpy as np
import traceback
import re

def preprocess_magnitude(magnitude_str):
    """Convert '3000 km2' to numeric value"""
    try:
        # Extract numeric value from string
        value = float(re.search(r'(\d+)', magnitude_str).group(1))
        return value
    except:
        return 0.0

def load_model():
    """Load the trained model"""
    try:
        model = joblib.load('disaster_model.pkl')
        return model
    except Exception as e:
        print(f"MODEL_LOAD_ERROR:{str(e)}")
        sys.exit(1)

def predict(input_data):
    """Make prediction using the model"""
    try:
        model = load_model()
        
        # Feature engineering
        magnitude = preprocess_magnitude(input_data['magnitude'])
        deaths = float(input_data['deaths'])
        affected = float(input_data['affected'])
        
        # Create feature vector (adjust according to your model's requirements)
        features = np.array([
            magnitude,
            deaths,
            affected,
            # Add other features as needed
        ]).reshape(1, -1)
        
        prediction = model.predict(features)[0]
        
        # Ensure prediction is between 0-1
        prediction = max(0.0, min(1.0, float(prediction)))
        return prediction
        
    except Exception as e:
        print(f"PREDICTION_ERROR:{str(e)}")
        traceback.print_exc()
        raise e

if __name__ == '__main__':
    try:
        input_str = sys.argv[1]
        input_data = json.loads(input_str)
        
        result = predict(input_data)
        print(result)
        
    except Exception as e:
        print(f"ERROR:{str(e)}")
        sys.exit(1)