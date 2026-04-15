import numpy as np
import joblib
import os

try:
    from tensorflow.keras.models import load_model
    TF_AVAILABLE = True
except Exception as e:
    print(f"⚠️ TensorFlow unavailable: {e}")
    TF_AVAILABLE = False


def test_lstm_model():
    """Test the LSTM model with sample data."""
    sample_sequence = [
        [36.8, 75, 98, 120, 80, 0.5],
        [37.0, 78, 97, 125, 82, 0.6],
        [36.9, 76, 99, 118, 78, 0.4],
        [37.1, 80, 96, 130, 85, 0.7],
        [36.7, 74, 98, 122, 79, 0.5],
        [37.2, 82, 95, 135, 88, 0.8],
        [37.3, 85, 94, 140, 90, 0.9],
        [37.4, 88, 93, 145, 92, 1.0],
        [37.5, 90, 92, 150, 95, 1.1],
        [37.6, 95, 91, 155, 98, 1.2],
    ]

    if TF_AVAILABLE:
        try:
            print("🔄 Loading LSTM model...")
            model = load_model("model/icu_lstm_model.h5")
            scaler = joblib.load("model/scaler.save")
            print("✅ Model loaded successfully!")

            input_features = np.array(sample_sequence)
            scaled_sequence = scaler.transform(input_features)
            lstm_input = scaled_sequence.reshape(1, 10, -1)

            prediction = model.predict(lstm_input)[0]
            normal_probability = float(prediction[0])
            anomaly_probability = float(prediction[1])

            print("\n📊 LSTM Prediction Results:")
            print(f"Normal Probability: {normal_probability:.4f}")
            print(f"Anomaly Probability: {anomaly_probability:.4f}")

            if anomaly_probability > 0.5:
                print("🚨 ALERT: High risk of medical anomaly detected!")
            else:
                print("✅ Status: Patient vitals appear normal")

            return {
                "normal_prob": normal_probability,
                "anomaly_prob": anomaly_probability,
                "alert": anomaly_probability > 0.5,
            }
        except Exception as e:
            print(f"❌ Error testing LSTM model: {e}")
            print("ℹ️ Falling back to the backup RandomForest predictor.")

    try:
        from fallback_model import create_fallback_model, predict_with_fallback

        if not os.path.exists("model/fallback_model.pkl"):
            create_fallback_model()

        payload = {
            "temperature": sample_sequence[-1][0],
            "heart_rate": sample_sequence[-1][1],
            "spo2": sample_sequence[-1][2],
            "systolic": sample_sequence[-1][3],
            "diastolic": sample_sequence[-1][4],
            "ecg": sample_sequence[-1][5],
        }

        result = predict_with_fallback(payload)
        if result is None:
            raise ValueError("Fallback model did not return a prediction.")

        print("✅ Fallback model prediction result:")
        print(result)
        return result
    except Exception as e:
        print(f"❌ Fallback test error: {e}")
        return None


if __name__ == "__main__":
    test_lstm_model()

