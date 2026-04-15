import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import joblib
import os

def create_fallback_model():
    """Create a scikit-learn model as fallback when TensorFlow fails"""
    print("🔄 Creating fallback ML model (Random Forest)...")

    # Generate synthetic ICU data
    np.random.seed(42)
    num_samples = 1000

    # Features: [temperature, heart_rate, spo2, systolic, diastolic, ecg]
    X = np.random.rand(num_samples, 6)

    # Realistic ranges
    X[:, 0] = X[:, 0] * 2 + 36.0     # Temp: 36–38°C
    X[:, 1] = X[:, 1] * 40 + 60      # HR: 60–100 bpm
    X[:, 2] = X[:, 2] * 5 + 95       # SpO2: 95–100%
    X[:, 3] = X[:, 3] * 30 + 110     # Systolic: 110-140 mmHg
    X[:, 4] = X[:, 4] * 20 + 70      # Diastolic: 70-90 mmHg
    X[:, 5] = X[:, 5] * 0.5 + 0.25   # ECG: 0.25-0.75 normalized

    # Labels: 0=normal, 1=anomaly
    y = np.random.choice([0, 1], size=(num_samples,), p=[0.8, 0.2])

    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Train Random Forest
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # Evaluate
    y_pred = model.predict(X_test)
    print("📊 Fallback Model Performance:")
    print(classification_report(y_test, y_pred))

    # Save model
    joblib.dump(model, "model/fallback_model.pkl")
    print("✅ Fallback model saved as model/fallback_model.pkl")

    return model

def predict_with_fallback(vitals):
    """Make prediction using fallback model"""
    try:
        model = joblib.load("model/fallback_model.pkl")

        # Prepare input: [temp, hr, spo2, systolic, diastolic, ecg]
        features = np.array([[
            vitals['temperature'],
            vitals['heart_rate'],
            vitals['spo2'],
            vitals['systolic'],
            vitals['diastolic'],
            vitals['ecg']
        ]])

        prediction = model.predict_proba(features)[0]
        normal_prob = prediction[0]
        anomaly_prob = prediction[1]

        return {
            'normal_prob': float(normal_prob),
            'anomaly_prob': float(anomaly_prob),
            'alert': anomaly_prob > 0.5
        }

    except Exception as e:
        print(f"❌ Fallback model error: {e}")
        return None

if __name__ == "__main__":
    # Create fallback model if it doesn't exist
    if not os.path.exists("model/fallback_model.pkl"):
        create_fallback_model()
    else:
        print("✅ Fallback model already exists")