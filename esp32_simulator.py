import requests
import json
import time
import random
import os

# Backend server URL and optional frontend dashboard URL
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:5000/send-data")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5177")

def generate_realistic_vitals():
    """Generate realistic ICU vitals with some variation"""
    return [
        round(36.5 + random.random() * 2, 1),  # Temperature: 36.5-38.5°C
        round(60 + random.random() * 40),       # Heart Rate: 60-100 BPM
        round(95 + random.random() * 5),        # SpO₂: 95-100%
        round(110 + random.random() * 30),      # Systolic: 110-140 mmHg
        round(70 + random.random() * 20),       # Diastolic: 70-90 mmHg
        round(random.random(), 2)               # ECG: 0.0-1.0 normalized
    ]

def simulate_esp32_data():
    """Simulate ESP32 sending data to backend"""
    print("🚀 ESP32 Data Simulator Started")
    print("📡 Sending data to:", BACKEND_URL)
    print("⏰ Sending data every 2 seconds...\n")

    sequence_buffer = []

    for i in range(50):  # Send 50 readings
        # Generate new vital signs
        vitals = generate_realistic_vitals()
        sequence_buffer.append(vitals)

        # Keep only last 10 readings for LSTM
        if len(sequence_buffer) > 10:
            sequence_buffer.pop(0)

        # Prepare data for backend
        data = {
            "sequence": sequence_buffer
        }

        try:
            # Send to backend
            response = requests.post(BACKEND_URL, json=data, timeout=5)

            if response.status_code == 200:
                result = response.json()
                model_type = result.get('model', 'Unknown')
                prediction = result.get('prediction', 0)

                print(f"📊 Reading #{i+1}: {vitals}")
                print(f"🤖 Model: {model_type} | Prediction: {prediction:.3f}")

                if prediction > 0.5:
                    print("🚨 ALERT: High risk detected!")
                else:
                    print("✅ Status: Normal")

                print("-" * 50)

            else:
                print(f"❌ Error: HTTP {response.status_code}")

        except Exception as e:
            print(f"❌ Connection Error: {e}")

        # Wait 2 seconds before next reading
        time.sleep(2)

    print("\n✅ Simulation Complete!")
    print("💡 Check your dashboard at", FRONTEND_URL)
    print("🔄 Data should be updating in real-time via WebSocket!")

if __name__ == "__main__":
    simulate_esp32_data()