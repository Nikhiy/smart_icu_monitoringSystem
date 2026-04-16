# 🔧 Smart ICU ESP32 Hardware Setup Guide

## Complete wiring and sensor configuration for IoT data collection

---

## 📋 Table of Contents

1. [Required Components](#required-components)
2. [PIN Assignments](#pin-assignments)
3. [Sensor Wiring Diagrams](#sensor-wiring-diagrams)
4. [I2C Bus Setup](#i2c-bus-setup)
5. [Configuration Steps](#configuration-steps)
6. [Troubleshooting](#troubleshooting)
7. [Testing](#testing)

---

## 📦 Required Components

### Microcontroller
- **ESP32-DevKit-C** or **ESP32-WROOM-32** (Recommended: 30-pin version)
- USB-C cable for programming

### Vital Sign Sensors

| Sensor | Model | Purpose | Protocol | Cost |
|--------|-------|---------|----------|------|
| **Pulse Oximetry** | MAX30102 | SpO₂ & Heart Rate | I2C | $8-12 |
| **Temperature** | LM35 Analog | Body Temperature | ADC (Analog) | $1-2 |
| **Pressure** | BMP085 | Systolic/Diastolic BP | I2C | $5-8 |
| **ECG** | ECG Sensor Module | Electrocardiogram | ADC (Analog) | $15-25 |

### Supporting Components
- Breadboard (830 tie-points minimum)
- Jumper wires (male-to-male and male-to-female)
- 4.7kΩ pull-up resistors (×2 for I2C)
- 100µF capacitor (for MAX30102 power stabilization)
- 10µF capacitor (for LM35 filtering)
- USB power adapter (2A minimum)
- Optional: Buzzer (5V active buzzer)

### Tools
- Soldering iron (for sensor connections, optional)
- Multimeter (for testing connections)
- Wire strippers

---

## 📍 PIN Assignments

### ESP32 GPIO Pinout (30-pin DevKit)

```
┌─────────────────────────────────────┐
│         ESP32-DevKit-C              │
│                                     │
│  [3V3]  [EN]  [VP]  [VN]            │
│  [D35]  [D34]  [D33]  [D25]  [D26]  │
│  [D27]  [D14]  [D12]  [D13]  [D23]  │
│  [D22]  [TX0] [RX0]  [D21]  [D19]   │
│  [D18]  [D5]   [D17]  [D16]  [D4]   │
│  [D2]   [D15]  [D8]   [D7]   [D6]   │
│  [D11]  [D10]  [D9]   [D3]   [D1]   │
│  [D0]   [GND]  [GND]  [GND]  [VIN]  │
└─────────────────────────────────────┘
```

### Assigned Pins

| GPIO | Function | Sensor | Signal Type |
|------|----------|--------|-------------|
| **21** | I2C Data (SDA) | MAX30102, BMP085 | Digital |
| **22** | I2C Clock (SCL) | MAX30102, BMP085 | Digital |
| **34** | ECG Input | ECG Sensor | Analog Input |
| **35** | Temperature Input | LM35 | Analog Input |
| **25** | Buzzer Output | Audio Alarm | Digital Output |
| **GND** | Ground | All sensors | Power Return |
| **3V3** | 3.3V Power | All sensors | Power Supply |

⚠️ **IMPORTANT PIN NOTES:**
- GPIO 34, 35 are **ADC-only** (no PWM)
- GPIO 21, 22 are **I2C default** (don't use for other purposes)
- GPIO 25 supports PWM for buzzer tones
- Avoid GPIO 6, 7, 8, 9, 10, 11 (reserved for SPI flash)

---

## 🔌 Sensor Wiring Diagrams

### 1️⃣ MAX30102 Pulse Oximetry Sensor

**Function:** Measures SpO₂ (blood oxygen) and heart rate via finger sensor

**Pinout:**
```
MAX30102 Module
┌─────────────────┐
│ VCC   GND  SDA  SCL │
└─────────────────┘
```

**Wiring:**
```
MAX30102 VCC     → ESP32 3V3     (3.3V power)
MAX30102 GND     → ESP32 GND     (Ground)
MAX30102 SDA     → ESP32 GPIO21  (I2C Data)
MAX30102 SCL     → ESP32 GPIO22  (I2C Clock)
```

**Power Stabilization (Optional but Recommended):**
```
ESP32 3V3 ──[100µF cap]── GND  (across sensor power pins)
```

**Usage:**
- Place fingertip on sensor window
- Keep finger still for 5+ seconds for stable reading
- Red LED = pulse detection
- Green LED = SpO₂ measurement

---

### 2️⃣ LM35 Temperature Sensor

**Function:** Measures body core temperature

**Pinout:**
```
LM35 (3-pin TO-92)
   │ │ │
   1 2 3
   │ │ │
  +V GND OUT
```

**Wiring:**
```
LM35 Pin 1 (+V)   → ESP32 3V3      (3.3V power)
LM35 Pin 2 (GND)  → ESP32 GND      (Ground)
LM35 Pin 3 (OUT)  → ESP32 GPIO35   (Analog input)

Optional filter capacitor:
LM35 OUT ──[10µF cap]── GND
```

**Calibration:**
- Room temperature: ~25°C → 0.25V on ADC
- Body temperature: ~37°C → 0.37V on ADC
- Formula: `Temperature(°C) = ADC_Value * (3.3 / 4095) * 100`

---

### 3️⃣ BMP085 Pressure Sensor

**Function:** Measures atmospheric pressure (estimates blood pressure systolic/diastolic)

**Pinout:**
```
BMP085 Module
┌──────────────────┐
│ VCC  GND  SDA  SCL│
└──────────────────┘
```

**Wiring:**
```
BMP085 VCC  → ESP32 3V3      (3.3V power)
BMP085 GND  → ESP32 GND      (Ground)
BMP085 SDA  → ESP32 GPIO21   (I2C Data - SHARED with MAX30102)
BMP085 SCL  → ESP32 GPIO22   (I2C Clock - SHARED with MAX30102)
```

---

### 4️⃣ ECG Sensor Module

**Function:** Records electrocardiogram for arrhythmia detection

**Pinout (typical ECG module):**
```
ECG Module
┌──────────────────┐
│ GND  OUT  VCC    │
└──────────────────┘
```

**Wiring:**
```
ECG GND  → ESP32 GND     (Ground)
ECG VCC  → ESP32 3V3     (3.3V power)
ECG OUT  → ESP32 GPIO34  (Analog input)
```

**Notes:**
- Some ECG modules may have different pinouts - verify with datasheet
- Noise is normal - filter with firmware (moving average)

---

### 5️⃣ Buzzer/Speaker (Optional)

**Function:** Audio alert for abnormal vitals

**Wiring (5V Active Buzzer):**
```
Buzzer (+) → ESP32 GPIO25  (Signal - via 1kΩ resistor)
Buzzer (-) → ESP32 GND     (Ground)
```

---

## 🔗 I2C Bus Setup

### Shared I2C Bus Topology

```
        ESP32
        ├─ GPIO21 (SDA) ──[4.7kΩ pull-up]── 3V3
        ├─ GPIO22 (SCL) ──[4.7kΩ pull-up]── 3V3
        │
        ├─── MAX30102
        │    ├─ SDA → GPIO21
        │    ├─ SCL → GPIO22
        │    ├─ GND → GND
        │    └─ VCC → 3V3
        │
        └─── BMP085
             ├─ SDA → GPIO21 (shared)
             ├─ SCL → GPIO22 (shared)
             ├─ GND → GND
             └─ VCC → 3V3
```

### I2C Addresses

| Sensor | Default I2C Address |
|--------|-------------------|
| MAX30102 | 0x57 |
| BMP085 | 0x77 |

---

## ⚙️ Configuration Steps

### Step 1: Install Arduino IDE

1. Download [Arduino IDE](https://www.arduino.cc/en/software)
2. Install ESP32 board support:
   - Preferences → Additional Board Manager URLs
   - Add: `https://dl.espressif.com/dl/package_esp32_index.json`
   - Tools → Board Manager → Search "esp32" → Install by Espressif

### Step 2: Install Required Libraries

In Arduino IDE: **Sketch → Include Library → Manage Libraries**

```
1. Adafruit BMP085 Library
2. Adafruit MAX30105 Library
3. MAX30102 by mfalkus (for heart rate algorithm)
4. ArduinoJson (for JSON handling)
```

### Step 3: Edit config.h

Open `esp32/config.h` and update:

```cpp
// Your WiFi network
const char* WIFI_SSID = "Your_WiFi_Name";
const char* WIFI_PASSWORD = "Your_WiFi_Password";

// Your backend server (from Step 1: Getting Backend IP)
const char* BACKEND_URL = "http://192.168.1.100:5000/send-data";

// Device identification
const char* DEVICE_ID = "PATIENT_001";  // Unique per device
```

### Step 4: Find Your Backend IP Address

**On Windows (Backend Machine):**
```powershell
ipconfig
```
Look for "IPv4 Address" under your WiFi adapter (e.g., `192.168.1.100`)

**On Mac/Linux:**
```bash
ifconfig
```
Look for `inet` under your WiFi interface (e.g., `en0`)

**In config.h, use:**
```cpp
const char* BACKEND_URL = "http://192.168.1.100:5000/send-data";
```

### Step 5: Upload Firmware

1. Connect ESP32 to computer via USB-C
2. Tools → Board → "ESP32 Dev Module"
3. Tools → Port → Select correct COM port
4. Tools → Upload Speed → "921600" (faster)
5. **Sketch → Upload** (or Ctrl+U)
6. Wait for "Upload successful"
7. Tools → Serial Monitor (select 115200 baud)

### Step 6: Verify Output

In Serial Monitor, should see:
```
🔌 Connecting to WiFi...... ✅ Connected!
✅ MAX30102 initialized
✅ BMP085 initialized
🚀 All systems initialized.

📊 ECG: 0.45 | HR: 72 | SpO₂: 98% | BP: 1013 hPa | Temp: 37.2°C
📊 ECG: 0.48 | HR: 73 | SpO₂: 98% | BP: 1012 hPa | Temp: 37.1°C
```

---

## 🛠️ Troubleshooting

### ❌ "MAX30102 not found!"

**Cause:** Sensor not detected on I2C bus

**Solutions:**
1. Check I2C wiring (SDA=GPIO21, SCL=GPIO22)
2. Verify 3V3 power connection
3. Test with Arduino I2C Scanner:
   ```cpp
   #include <Wire.h>
   void setup() {
     Serial.begin(115200);
     Wire.begin();
     for (int addr = 1; addr < 127; addr++) {
       Wire.beginTransmission(addr);
       if (Wire.endTransmission() == 0) {
         Serial.println("Device found at 0x" + String(addr, HEX));
       }
     }
   }
   void loop() {}
   ```
4. Try adding 4.7kΩ pull-up resistors on SDA/SCL

### ❌ "WiFi disconnected"

**Cause:** Cannot connect to WiFi

**Solutions:**
1. Verify WIFI_SSID and WIFI_PASSWORD in config.h
2. Check ESP32 is in WiFi range
3. Ensure WiFi network is 2.4GHz (not 5GHz - ESP32 doesn't support)
4. Increase WIFI_TIMEOUT in config.h: `#define WIFI_TIMEOUT 30000`

### ❌ "Failed to send data. Code: -1"

**Cause:** Backend server unreachable

**Solutions:**
1. Verify backend is running: `cd backend && python app.py`
2. Check BACKEND_URL in config.h is correct IP (not `localhost`)
3. Test from PC: `ping 192.168.1.100`
4. Check firewall allows port 5000

### ❌ LM35 reading shows "0°C" always

**Cause:** Analog input not configured or wired

**Solutions:**
1. Verify LM35 OUT → GPIO35 (must be ADC pin)
2. Test with multimeter at GPIO35 (should be ~0.25V at 25°C)
3. Check 3V3 power to LM35

### ❌ ECG shows only 0.0 values

**Cause:** ECG sensor not sending signal

**Solutions:**
1. Verify ECG OUT → GPIO34
2. Check ECG sensor power and ground
3. Attach ECG electrodes to chest (if using ECG patches)

---

## ✅ Testing

### Test 1: Sensor Readings (Local)

In Serial Monitor, verify values update:
```
📊 ECG: 0.45 | HR: 72 | SpO₂: 98% | BP: 1013 hPa | Temp: 37.2°C
📊 ECG: 0.48 | HR: 73 | SpO₂: 98% | BP: 1012 hPa | Temp: 37.1°C
```

### Test 2: Backend Connection

Look for logs in backend terminal:
```
📥 Received: {'sequence': [[37.1, 72, 98, 1013, 0.45], ...]}
✅ Data sent to Flask! Code: 200
```

### Test 3: Dashboard Updates

1. Start backend: `cd backend && python app.py`
2. Start frontend: `cd frontend-vite && npm run dev`
3. Open http://localhost:5173
4. Dashboard should show real-time vitals from ESP32

### Test 4: Manual Test (Python)

```bash
python test_chat_endpoint.py
```

Should show ESP32 data flowing through `/send-data` endpoint.

---

## 🚀 Next Steps

1. **Multi-Patient Setup** - Program multiple ESP32s with different DEVICE_ID values
2. **Cloud Deployment** - Change BACKEND_URL to cloud server IP
3. **Data Persistence** - Backend will store readings in database
4. **Mobile App** - Connect mobile devices to same backend

---

## 📚 References

- [ESP32 Datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf)
- [MAX30102 Datasheet](https://datasheets.maximintegrated.com/en/ds/MAX30102.pdf)
- [BMP085 Datasheet](https://www.bosch-sensortec.com/media/boschsensortec_content/dam/boschsensortec_websites/Application_Notes/BMA150_BMP085_Complementary_Pressure_Temperature.pdf)
- [LM35 Datasheet](https://www.ti.com/lit/ds/symlink/lm35.pdf)

---

## ❓ Support

For issues not covered here:
1. Check `backend/app.py` logs for data format errors
2. Use Arduino Serial Monitor for ESP32 diagnostics
3. Use browser DevTools for frontend issues

Happy monitoring! 🏥
