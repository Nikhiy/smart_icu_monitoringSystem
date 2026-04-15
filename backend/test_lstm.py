import numpy as np
import joblib
from tensorflow.keras.models import load_model

def test_lstm_model():
    """Test the LSTM model with sample data"""
    try:
        # Load model and scaler
        print("🔄 Loading LSTM model...")
        model = load_model("model/icu_lstm_model.h5")
        scaler = joblib.load("model/scaler.save")
        print("✅ Model loaded successfully!")

        # Create sample ICU vitals data (10 time steps)
        # Format: [temperature, heart_rate, spo2, systolic, diastolic, ecg]
        sample_sequence = [
            [36.8, 75, 98, 120, 80, 0.5],  # Normal vitals
            [37.0, 78, 97, 125, 82, 0.6],
            [36.9, 76, 99, 118, 78, 0.4],
            [37.1, 80, 96, 130, 85, 0.7],
            [36.7, 74, 98, 122, 79, 0.5],
            [37.2, 82, 95, 135, 88, 0.8],  # Slightly abnormal
            [37.3, 85, 94, 140, 90, 0.9],  # More abnormal
            [37.4, 88, 93, 145, 92, 1.0],  # Very abnormal
            [37.5, 90, 92, 150, 95, 1.1],  # Critical
            [37.6, 95, 91, 155, 98, 1.2],  # Emergency
        ]

        # Scale the input features
        input_features = np.array(sample_sequence)
        scaled_sequence = scaler.transform(input_features)

        # Reshape for LSTM (1 sample, 10 time steps, 6 features)
        lstm_input = scaled_sequence.reshape(1, 10, -1)

        # Make prediction
        prediction = model.predict(lstm_input)[0]
        anomaly_probability = prediction[1]  # Probability of anomaly (class 1)
        normal_probability = prediction[0]    # Probability of normal (class 0)

        print("
📊 LSTM Prediction Results:"        print(f"Normal Probability: {normal_probability:.4f}")
        print(f"Anomaly Probability: {anomaly_probability:.4f}")

        if anomaly_probability > 0.5:
            print("🚨 ALERT: High risk of medical anomaly detected!")
        else:
            print("✅ Status: Patient vitals appear normal")

        return {
            "normal_prob": float(normal_probability),
            "anomaly_prob": float(anomaly_probability),
            "alert": anomaly_probability > 0.5
        }

    except Exception as e:
        print(f"❌ Error testing LSTM model: {e}")
        return None

if __name__ == "__main__":
    test_lstm_model()