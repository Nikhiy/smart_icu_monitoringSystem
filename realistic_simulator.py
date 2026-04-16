"""
Smart ICU Monitoring System - Enhanced Realistic Data Simulator
Simulates multiple patient scenarios for presentations
No real hardware needed!
"""

import requests
import json
import time
import random
import os
from datetime import datetime

# Backend server URL
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:5000/send-data")

# Patient Scenarios
SCENARIOS = {
    "NORMAL": {
        "name": "Healthy Patient",
        "description": "Normal vital signs - stable condition",
        "temp_range": (36.8, 37.2),
        "hr_range": (70, 85),
        "spo2_range": (98, 100),
        "systolic_range": (115, 125),
        "diastolic_range": (75, 85),
        "ecg_range": (0.3, 0.5),
    },
    "TACHYCARDIA": {
        "name": "Patient with High Heart Rate",
        "description": "Elevated heart rate - possible infection/stress",
        "temp_range": (37.5, 38.5),  # Fever
        "hr_range": (110, 130),      # Tachycardia
        "spo2_range": (96, 99),
        "systolic_range": (130, 145),
        "diastolic_range": (85, 95),
        "ecg_range": (0.4, 0.6),
    },
    "HYPOXIA": {
        "name": "Patient with Low Oxygen",
        "description": "Low SpO2 - respiratory distress",
        "temp_range": (36.8, 37.5),
        "hr_range": (95, 115),       # Compensatory tachycardia
        "spo2_range": (88, 94),      # CRITICAL: SpO2 too low!
        "systolic_range": (125, 140),
        "diastolic_range": (80, 90),
        "ecg_range": (0.45, 0.65),
    },
    "CRITICAL": {
        "name": "Critical Patient",
        "description": "Multiple abnormal signs - immediate intervention needed",
        "temp_range": (38.5, 39.5),  # High fever
        "hr_range": (120, 150),      # Severe tachycardia
        "spo2_range": (85, 92),      # Severe hypoxia
        "systolic_range": (145, 165),
        "diastolic_range": (95, 110),
        "ecg_range": (0.6, 0.8),
    },
    "RECOVERING": {
        "name": "Recovering Patient",
        "description": "Improving vitals - post-intervention",
        "temp_range": (37.0, 37.5),
        "hr_range": (80, 95),
        "spo2_range": (97, 100),
        "systolic_range": (120, 130),
        "diastolic_range": (78, 88),
        "ecg_range": (0.35, 0.55),
    },
}

class RealisticPatientSimulator:
    """Simulates realistic patient data with temporal patterns"""
    
    def __init__(self, scenario="NORMAL"):
        self.scenario = SCENARIOS.get(scenario, SCENARIOS["NORMAL"])
        self.reading_count = 0
        self.sequence_buffer = []
        
        # Trend tracking (for realistic gradual changes)
        self.current_temp = random.uniform(*self.scenario["temp_range"])
        self.current_hr = random.uniform(*self.scenario["hr_range"])
        self.current_spo2 = random.uniform(*self.scenario["spo2_range"])
        self.current_systolic = random.uniform(*self.scenario["systolic_range"])
        self.current_diastolic = random.uniform(*self.scenario["diastolic_range"])
        
    def generate_vital(self, field, min_val, max_val):
        """Generate vital with small random variation (realistic temporal change)"""
        # Get current value or generate new
        current = random.uniform(min_val, max_val)
        
        # Add small variation (±2% drift for realism)
        drift = random.uniform(-0.02, 0.02)
        next_val = current * (1 + drift)
        
        # Clamp to range
        return round(max(min_val, min(max_val, next_val)), 2)
    
    def get_next_reading(self):
        """Get next realistic vital signs reading"""
        reading = [
            self.generate_vital("temp", *self.scenario["temp_range"]),
            round(self.generate_vital("hr", *self.scenario["hr_range"])),
            round(self.generate_vital("spo2", *self.scenario["spo2_range"])),
            round(self.generate_vital("systolic", *self.scenario["systolic_range"])),
            round(self.generate_vital("diastolic", *self.scenario["diastolic_range"])),
            self.generate_vital("ecg", *self.scenario["ecg_range"]),
        ]
        
        return reading
    
    def send_reading(self):
        """Send one reading to backend and return prediction"""
        vitals = self.get_next_reading()
        self.sequence_buffer.append(vitals)
        
        # Keep only last 10 readings for LSTM
        if len(self.sequence_buffer) > 10:
            self.sequence_buffer.pop(0)
        
        self.reading_count += 1
        
        # Prepare payload
        data = {"sequence": self.sequence_buffer}
        
        try:
            response = requests.post(BACKEND_URL, json=data, timeout=5)
            
            if response.status_code == 200:
                result = response.json()
                prediction = result.get('prediction')
                if prediction is None:
                    prediction = 0.0
                try:
                    alert_flag = float(prediction) > 0.5
                except Exception:
                    alert_flag = False

                return {
                    "success": True,
                    "vitals": vitals,
                    "prediction": prediction,
                    "model": result.get('model', 'Unknown'),
                    "alert": alert_flag,
                }
            else:
                return {
                    "success": False,
                    "error": f"HTTP {response.status_code}",
                    "vitals": vitals,
                }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "vitals": vitals,
            }

def print_header():
    """Print beautiful header"""
    print("\n" + "="*70)
    print("🏥  SMART ICU MONITORING SYSTEM - PATIENT DATA SIMULATOR  🏥")
    print("="*70)
    print()

def print_scenario_menu():
    """Print available scenarios"""
    print("📋 SELECT PATIENT SCENARIO FOR PRESENTATION:\n")
    for i, (key, scenario) in enumerate(SCENARIOS.items(), 1):
        print(f"  {i}. {scenario['name']}")
        print(f"     → {scenario['description']}\n")

def format_reading(vitals, prediction, alert_status):
    """Format vital signs for beautiful display"""
    temp, hr, spo2, systolic, diastolic, ecg = vitals
    
    # Color coding for alert status
    if alert_status:
        status_emoji = "🚨"
        status_text = "ALERT"
        status_color = "RED"
    else:
        status_emoji = "✅"
        status_text = "NORMAL"
        status_color = "GREEN"
    
    output = f"""
╔════════════════════════════════════════════════════════════╗
║  VITAL SIGNS READING                                       ║
╠════════════════════════════════════════════════════════════╣
║  Temperature      │ {temp:6.1f}°C        ║
║  Heart Rate       │ {hr:6.0f} BPM       ║
║  SpO₂             │ {spo2:6.0f}%         ║
║  BP               │ {systolic:3.0f}/{diastolic:3.0f} mmHg      ║
║  ECG              │ {ecg:6.2f} (normalized) ║
╠════════════════════════════════════════════════════════════╣
║  ML Prediction    │ {prediction:.1%}      Risk              ║
║  Status           │ {status_emoji} {status_text} - {status_color}                  ║
╚════════════════════════════════════════════════════════════╝
"""
    return output

def run_simulation(scenario_key, duration_seconds=120):
    """Run continuous simulation"""
    print(f"\n🎬 Starting simulation for: {SCENARIOS[scenario_key]['name']}")
    print(f"⏱️  Duration: {duration_seconds} seconds (1 reading every 2 seconds)")
    print(f"📡 Backend: {BACKEND_URL}\n")
    print("Press Ctrl+C to stop\n")
    
    simulator = RealisticPatientSimulator(scenario_key)
    start_time = time.time()
    normal_count = 0
    alert_count = 0
    
    try:
        while (time.time() - start_time) < duration_seconds:
            result = simulator.send_reading()
            
            if result["success"]:
                alert = result["alert"]
                prediction = result["prediction"]
                vitals = result["vitals"]
                
                if alert:
                    alert_count += 1
                else:
                    normal_count += 1
                
                # Print formatted reading
                print(format_reading(vitals, prediction, alert))
                
                # Summary line
                remaining = int(duration_seconds - (time.time() - start_time))
                print(f"⏳ Reading #{simulator.reading_count} | ⏱️  {remaining}s remaining\n")
                
            else:
                print(f"❌ Error sending reading: {result['error']}\n")
            
            # Wait 2 seconds before next reading
            time.sleep(2)
    
    except KeyboardInterrupt:
        print("\n\n⏹️  Simulation stopped by user\n")
    
    # Print summary
    print("="*70)
    print("📊 SIMULATION SUMMARY")
    print("="*70)
    print(f"Total readings: {simulator.reading_count}")
    print(f"Normal status:  {normal_count} readings ✅")
    print(f"Alert status:   {alert_count} readings 🚨")
    print()
    print("💡 Dashboard should be updating in real-time!")
    print("   Open http://localhost:5173 to see live vitals\n")

if __name__ == "__main__":
    print_header()
    print_scenario_menu()
    
    try:
        choice = input("🔢 Enter scenario number (1-5) [default: 1]: ").strip() or "1"
        choice_num = int(choice)
        
        scenario_keys = list(SCENARIOS.keys())
        if 1 <= choice_num <= len(scenario_keys):
            selected_scenario = scenario_keys[choice_num - 1]
            
            # Optional: Ask for duration
            duration = input("⏱️  How long to run simulation? (seconds, default 120): ").strip() or "120"
            try:
                duration = int(duration)
            except ValueError:
                duration = 120
            
            run_simulation(selected_scenario, duration)
        else:
            print("❌ Invalid choice!")
    
    except KeyboardInterrupt:
        print("\n\n👋 Goodbye!\n")
    except Exception as e:
        print(f"❌ Error: {e}\n")
