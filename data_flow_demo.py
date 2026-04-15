"""
Smart ICU Monitoring System - Data Flow Demo
============================================

This script demonstrates how data flows through your ICU monitoring system,
even when the backend can't run due to TensorFlow issues.
"""

import time
import random

def simulate_vital_signs():
    """Generate realistic ICU vital signs"""
    return {
        "temperature": round(36.5 + random.random() * 2, 1),  # 36.5-38.5°C
        "heart_rate": round(60 + random.random() * 40),       # 60-100 BPM
        "spo2": round(95 + random.random() * 5),              # 95-100%
        "systolic": round(110 + random.random() * 40),        # 110-150 mmHg
        "diastolic": round(70 + random.random() * 25),        # 70-95 mmHg
        "ecg": round(random.random(), 2)                      # 0.0-1.0 normalized
    }

def simple_anomaly_detection(vitals):
    """Simple rule-based anomaly detection (fallback for LSTM)"""
    alerts = []

    if vitals["heart_rate"] < 60 or vitals["heart_rate"] > 100:
        alerts.append("Abnormal Heart Rate")
    if vitals["spo2"] < 95:
        alerts.append("Low SpO₂ Level")
    if vitals["temperature"] < 36.0 or vitals["temperature"] > 37.5:
        alerts.append("Abnormal Temperature")
    if vitals["systolic"] > 140 or vitals["diastolic"] > 90:
        alerts.append("High Blood Pressure")

    return alerts

def demonstrate_data_flow():
    """Show how data flows through the system"""
    print("🏥 Smart ICU Monitoring System - Data Flow Demo")
    print("=" * 55)

    # Simulate 10 readings
    for i in range(10):
        print(f"\n📊 Reading #{i+1}")
        print("-" * 20)

        # 1. Generate vital signs (simulates ESP32 sensor data)
        vitals = simulate_vital_signs()
        print("1️⃣ ESP32 Sensor Data:")
        for key, value in vitals.items():
            print(f"   {key}: {value}")

        # 2. Send to backend (simulates HTTP POST to Flask)
        print("\n2️⃣ Backend Processing:")
        print("   📡 POST /send-data → Flask Server")

        # 3. LSTM Analysis (simulates model prediction)
        print("   🧠 LSTM Model Analysis:")
        print("   - Input: 10-time-step sequence of vitals")
        print("   - Processing: Pattern recognition & anomaly detection")
        print("   - Output: Normal vs Anomaly probabilities")

        # 4. Alert generation (fallback to rule-based)
        alerts = simple_anomaly_detection(vitals)
        print("   🚨 Alert System:")
        if alerts:
            for alert in alerts:
                print(f"   ⚠️  {alert}")
        else:
            print("   ✅ No alerts - vitals normal")

        # 5. WebSocket broadcast (simulates real-time updates)
        print("   🌐 WebSocket Broadcast:")
        print("   - Emit 'vitals' event to all connected clients")
        print("   - Frontend dashboard updates in real-time")

        # 6. Frontend display (simulates dashboard updates)
        print("   💻 Frontend Dashboard:")
        print("   - PatientInfo: Shows current vitals")
        print("   - VitalsChart: Adds data point to trend")
        print("   - AlertBanner: Updates alert status")
        print("   - ECGWaveform: Displays heart rhythm")

        time.sleep(1)  # Simulate real-time delay

    print("\n" + "=" * 55)
    print("✅ Demo Complete!")
    print("\n🎯 Key Points:")
    print("• ESP32 → Flask Backend → LSTM Analysis → WebSocket → React Frontend")
    print("• Real-time updates every 2 seconds")
    print("• Alerts trigger when vitals exceed normal ranges")
    print("• LSTM provides intelligent pattern recognition")
    print("• Dashboard shows live trends and patient status")

if __name__ == "__main__":
    demonstrate_data_flow()