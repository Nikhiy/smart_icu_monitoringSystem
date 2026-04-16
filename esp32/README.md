# 🎯 ESP32 IoT Gateway - Smart ICU Monitoring

Real-time vital sign collection from IoT sensors via ESP32 microcontroller

---

## 📦 What's in This Folder?

| File | Purpose |
|------|---------|
| **main.ino** | ESP32 firmware - reads sensors and sends to backend |
| **config.h** | Configuration file - edit this for WiFi, IP, pins, etc |
| **HARDWARE_SETUP.md** | Complete wiring guide for sensors (MAX30102, BMP085, LM35, ECG) |
| **WIFI_CONFIG_GUIDE.md** | Quick start for WiFi and backend configuration |

---

## 🚀 Quick Start (5 Minutes)

### 1. Get Your Backend IP
```powershell
ipconfig
# Look for IPv4 Address: 192.168.1.100
```

### 2. Edit config.h
```cpp
const char* WIFI_SSID = "Your_WiFi_Name";
const char* WIFI_PASSWORD = "Your_Password";
const char* BACKEND_URL = "http://192.168.1.100:5000/send-data";
```

### 3. Upload to ESP32
- Connect ESP32 via USB
- Arduino IDE → Upload → Select COM port
- Wait for "Upload successful"

### 4. Check Serial Monitor (115200 baud)
```
🔌 Connecting to WiFi... ✅ Connected!
✅ MAX30102 initialized
✅ Data sent to Flask! Code: 200
```

### 5. View Dashboard
- Start backend: `cd backend && python app.py`
- Start frontend: `cd frontend-vite && npm run dev`
- Open http://localhost:5173

✅ **You're live!** Real-time vitals streaming to dashboard.

---

## 📋 Before You Start

**Required Hardware:**
- ESP32-DevKit-C
- MAX30102 (pulse oximetry)
- BMP085 (pressure)
- LM35 (temperature)
- ECG sensor module
- Breadboard + jumper wires
- USB-C cable

**Required Software:**
- Arduino IDE
- ESP32 board support
- Adafruit libraries

**Network:**
- ESP32 and backend on same WiFi network
- 2.4GHz WiFi (ESP32 doesn't support 5GHz)

---

## 🔧 Configuration

### All settings in `config.h`:

```cpp
// 🔌 WiFi
const char* WIFI_SSID = "MyWiFi";
const char* WIFI_PASSWORD = "MyPassword";

// 🌐 Backend
const char* BACKEND_URL = "http://192.168.1.100:5000/send-data";

// 👤 Device ID (for multi-patient setup)
const char* DEVICE_ID = "PATIENT_001";

// 📍 GPIO Pins (match your wiring)
#define ECG_PIN 34
#define LM35_PIN 35
#define BUZZER_PIN 25

// 📊 Sensor thresholds for local alerts
#define HR_MIN 60
#define HR_MAX 100
#define SPO2_MIN 95
#define TEMP_MIN 35.0
#define TEMP_MAX 38.5
```

**No need to edit main.ino** - all configuration in `config.h`

---

## 📡 How It Works

```
┌─────────────┐
│   Sensors   │
│ MAX30102    │  Measure vital signs every 1 second
│ BMP085      │
│ LM35        │
│ ECG Module  │
└──────┬──────┘
       │ I2C + ADC
       ▼
   ┌─────────────┐
   │   ESP32     │  Buffer 60 readings (≈60 seconds)
   │   Gateway   │  Check local thresholds
   │   (main.ino)│  Send to backend every 10 seconds
   └──────┬──────┘
          │ HTTP POST
          ▼
    ┌──────────────────┐
    │  Backend Server  │
    │  (Flask/Python)  │
    │  Port 5000       │
    │  - Load balance  │
    │  - ML prediction │
    │  - WebSocket     │
    └──────┬───────────┘
           │ Real-time
           ▼
    ┌──────────────────┐
    │  Web Dashboard   │
    │  (React/Vite)    │
    │  Port 5173       │
    │  - Show vitals   │
    │  - Alert status  │
    │  - Chat queries  │
    └──────────────────┘
```

---

## 📊 Data Format

ESP32 sends to `/send-data` endpoint:
```json
{
  "sequence": [
    [temp, hr, spo2, systolic, diastolic, ecg],
    [37.0, 72, 98, 120, 80, 0.5],
    [37.1, 73, 98, 122, 81, 0.45],
    ...
  ]
}
```

Backend responds with predictions:
```json
{
  "status": "received",
  "prediction": 0.234,
  "model": "RandomForest"
}
```

---

## 🔌 PIN Mapping

| GPIO | Function | Sensor | Notes |
|------|----------|--------|-------|
| 21 | I2C SDA | MAX30102, BMP085 | Shared bus |
| 22 | I2C SCL | MAX30102, BMP085 | Shared bus |
| 34 | ADC | ECG Sensor | ADC-only pin |
| 35 | ADC | LM35 | ADC-only pin |
| 25 | PWM | Buzzer | Audio alarm |
| GND | Ground | All | Power return |
| 3V3 | 3.3V | All sensors | Power supply |

See `HARDWARE_SETUP.md` for complete wiring diagrams.

---

## 📍 Multi-Patient Setup

To monitor multiple patients:

1. **Program each ESP32 separately:**
   - Edit config.h: `const char* DEVICE_ID = "PATIENT_002"`
   - Upload to second ESP32

2. **All ESP32s send to same backend:**
   ```cpp
   const char* BACKEND_URL = "http://192.168.1.100:5000/send-data";
   ```

3. **Backend routes by device ID:**
   - Each ESP32 maintains separate vital history
   - Dashboard shows patient selector dropdown
   - Chatbot responds for selected patient

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| **"WiFi disconnected"** | Check WIFI_SSID and WIFI_PASSWORD in config.h |
| **"MAX30102 not found!"** | Check I2C wiring (SDA=GPIO21, SCL=GPIO22) |
| **"Failed to send data"** | Backend not running or wrong IP in BACKEND_URL |
| **Serial Monitor shows nothing** | Check baud rate is 115200 |

See `WIFI_CONFIG_GUIDE.md` for detailed troubleshooting.

---

## 📚 Documentation

- **HARDWARE_SETUP.md** → Sensor wiring & pin assignments
- **WIFI_CONFIG_GUIDE.md** → Network configuration & testing

---

## 🧪 Testing

### From Arduino Serial Monitor:
```
🔌 Connecting to WiFi... ✅ Connected!
✅ MAX30102 initialized
✅ BMP085 initialized
📊 ECG: 0.45 | HR: 72 | SpO₂: 98% | BP: 1013 hPa | Temp: 37.2°C
✅ Data sent to Flask! Code: 200
```

### From Backend Terminal:
```
📥 Received: {'sequence': [[37.0, 72, 98, 1013, 0.45], ...]}
🤖 RandomForest Prediction: 0.234 (Alert: False)
✅ WebSocket broadcasted to 3 clients
```

### From Dashboard:
- Real-time vitals updating
- Alerts triggering on high-risk predictions
- Chatbot responding to doctor queries

---

## 🚀 Next Steps

1. ✅ **Read HARDWARE_SETUP.md** → Wire your sensors
2. ✅ **Read WIFI_CONFIG_GUIDE.md** → Configure WiFi & Backend IP
3. ✅ **Edit config.h** → Add your credentials
4. ✅ **Upload main.ino** → Send to ESP32
5. ✅ **Check Serial Monitor** → Verify connection
6. ✅ **View Dashboard** → See real-time vitals

---

## 📞 Support

For issues:
1. Check Serial Monitor output (look for error messages)
2. Review troubleshooting section in WIFI_CONFIG_GUIDE.md
3. Verify backend is running: `python app.py`
4. Test endpoint: `python test_chat_endpoint.py`

---

**Happy Monitoring!** 🏥

Made with ❤️ for ICU care
