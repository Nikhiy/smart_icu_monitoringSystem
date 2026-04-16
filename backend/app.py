from flask import Flask, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import joblib
import numpy as np
from datetime import datetime
import traceback
import os
from pathlib import Path

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    print("⚠️ python-dotenv not installed; falling back to system environment variables")

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

APP_HOST = os.getenv("BACKEND_HOST", "0.0.0.0")
APP_PORT = int(os.getenv("BACKEND_PORT", 5000))
MODEL_DIR = os.getenv("MODEL_DIR", "model")
LSTM_MODEL_PATH = os.path.join(MODEL_DIR, "icu_lstm_model.h5")
SCALER_PATH = os.path.join(MODEL_DIR, "scaler.save")
FALLBACK_MODEL_PATH = os.path.join(MODEL_DIR, "fallback_model.pkl")
USE_TENSORFLOW_ENV = os.getenv("USE_TENSORFLOW", "auto").lower()
USE_TENSORFLOW = None
if USE_TENSORFLOW_ENV in ("true", "false"):
    USE_TENSORFLOW = USE_TENSORFLOW_ENV == "true"

# Try to load TensorFlow model, fallback to scikit-learn if it fails
try:
    if USE_TENSORFLOW is False:
        raise RuntimeError("Forced fallback mode via USE_TENSORFLOW=false")

    from tensorflow.keras.models import load_model
    model = load_model(LSTM_MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    USE_TENSORFLOW = True
    print("✅ TensorFlow LSTM model loaded successfully!")
except Exception as e:
    print(f"⚠️  TensorFlow model failed to load or fallback forced: {e}")
    print("🔄 Using fallback Random Forest model...")
    USE_TENSORFLOW = False
    # Import fallback functions
    from fallback_model import predict_with_fallback, create_fallback_model
    if not os.path.exists(FALLBACK_MODEL_PATH):
        create_fallback_model()
    print("✅ Fallback model ready!")

# Sequence buffer for LSTM input (or single readings for fallback)
sequence_buffer = []
SEQUENCE_LENGTH = 10 if USE_TENSORFLOW else 1
ALERT_THRESHOLD = 0.8 if USE_TENSORFLOW else 0.5


@app.route("/")
def index():
    return "✅ Smart ICU Flask Server Running"


@app.route("/send-data", methods=["POST"])
def receive_data():
    data = request.json
    print("📥 Received:", data)

    if not data or "sequence" not in data or not isinstance(data["sequence"], list):
        return {"error": "Invalid format: Expected 'sequence' field"}, 400

    try:
        latest = data["sequence"][-1]
        if not isinstance(latest, (list, tuple)):
            raise ValueError("Latest sequence item must be a list or tuple")

        if len(latest) == 6:
            temperature, heart_rate, spo2, systolic, diastolic, ecg = map(float, latest)
        elif len(latest) == 5:
            temperature, heart_rate, spo2, systolic, ecg = map(float, latest)
            diastolic = 80.0
        else:
            raise ValueError("Latest sequence item must contain 5 or 6 values")

        # The LSTM model was trained on 5 features: temperature, heart rate, SpO2, systolic BP, ECG.
        # If the simulator sends 6 values, we preserve diastolic for display and alerts,
        # but only send the 5 expected features to the scaler/model.
        input_features = np.array([
            temperature,
            heart_rate,
            spo2,
            systolic,
            ecg
        ])

        display_vitals = {
            'temperature': temperature,
            'heart_rate': heart_rate,
            'spo2': spo2,
            'systolic': systolic,
            'diastolic': diastolic,
            'ecg': ecg
        }

        prediction = None
        alert = False

        if USE_TENSORFLOW:
            print(f"🔧 Model input features ({len(input_features)}): {input_features}")
            scaled_input = scaler.transform([input_features])[0]
            sequence_buffer.append(scaled_input.tolist())
            if len(sequence_buffer) > SEQUENCE_LENGTH:
                sequence_buffer.pop(0)

            if len(sequence_buffer) == SEQUENCE_LENGTH:
                input_seq = np.array(sequence_buffer).reshape(1, SEQUENCE_LENGTH, -1)
                raw_prediction = model.predict(input_seq)[0]
                if hasattr(raw_prediction, '__len__') and len(raw_prediction) > 1:
                    prediction = float(raw_prediction[1])
                else:
                    prediction = float(raw_prediction)
                alert = prediction > ALERT_THRESHOLD
                print(f"🧠 LSTM Prediction: {prediction:.4f} (Alert: {alert})")
            else:
                prediction = 0.0
                alert = False
                print(f"🔧 Waiting for full buffer ({len(sequence_buffer)}/{SEQUENCE_LENGTH}) - default prediction={prediction}")
        else:
            vitals_dict = {
                'temperature': temperature,
                'heart_rate': heart_rate,
                'spo2': spo2,
                'systolic': systolic,
                'diastolic': diastolic,
                'ecg': ecg
            }

            result = predict_with_fallback(vitals_dict)
            if result:
                prediction = result['anomaly_prob']
                alert = result['alert']
                print(f"🌲 RF Prediction: {prediction:.4f} (Alert: {alert})")
            else:
                alert = (heart_rate < 60 or heart_rate > 100 or
                        spo2 < 95 or
                        temperature < 36 or temperature > 37.5 or
                        systolic > 140 or diastolic > 90)
                prediction = 0.8 if alert else 0.2
                print(f"📏 Rule-based Alert: {alert}")

        socketio.emit("vitals", {
            "temperature": temperature,
            "heart_rate": heart_rate,
            "spo2": spo2,
            "bp_systolic": systolic,
            "bp_diastolic": diastolic,
            "ecg": ecg,
            "alert": alert,
            "prediction": prediction,
            "timestamp": datetime.now().strftime("%H:%M:%S"),
            "model_type": "LSTM" if USE_TENSORFLOW else "RandomForest"
        })

        return {"status": "received", "prediction": prediction, "model": "LSTM" if USE_TENSORFLOW else "RandomForest"}, 200

    except (IndexError, TypeError, ValueError) as e:
        print(f"❌ Input error: {e}")
        return {"error": f"Malformed reading: {str(e)}"}, 400
    except Exception as e:
        traceback.print_exc()
        return {"error": "Internal server error", "details": str(e)}, 500


def add_cors_headers(response):
    """Add explicit CORS headers to response"""
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS, PUT, DELETE'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response

app.after_request(add_cors_headers)

@app.route("/chat", methods=["POST", "OPTIONS"])
def chat():
    """Chat endpoint for NLP-based patient queries"""
    print(f"[Chat] Received {request.method} request from {request.remote_addr}")
    
    if request.method == "OPTIONS":
        print("[Chat] Handling preflight OPTIONS request")
        return {}, 200
    
    try:
        data = request.json or {}
        print(f"[Chat] Request data keys: {list(data.keys())}")
        
        if "query" not in data:
            print("[Chat] Error: missing 'query' field")
            return {"status": "error", "error": "Missing 'query' field"}, 400

        query = data.get("query", "").strip()
        if not query:
            print("[Chat] Error: empty query")
            return {"status": "error", "error": "Query cannot be empty"}, 400

        print(f"[Chat] Processing query: '{query}'")
        from chatbot import process_query
        patient_data = data.get("patient_data") or {}
        response = process_query(query, patient_data)
        
        print(f"[Chat] Response generated successfully")
        return {
            "status": "ok",
            "chat_response": response
        }, 200
    
    except ImportError as ie:
        print(f"❌ Chat import error: {ie}")
        import traceback
        traceback.print_exc()
        return {
            "status": "error",
            "error": f"Module import failed: {str(ie)}"
        }, 500
    except Exception as e:
        print(f"❌ Chat error: {e}")
        import traceback
        traceback.print_exc()
        return {
            "status": "error",
            "error": str(e),
            "type": type(e).__name__
        }, 500


@app.route("/chat-test", methods=["GET"])
def chat_test():
    """Test endpoint to verify chat route is accessible"""
    return {"status": "ok", "message": "Chat endpoint is accessible"}, 200


@socketio.on("connect")
def handle_connect():
    print("✅ WebSocket client connected")
    emit("connect", {"message": "Connected to Flask WebSocket"})


if __name__ == "__main__":
    socketio.run(app, host=APP_HOST, port=APP_PORT, debug=True, use_reloader=False)


