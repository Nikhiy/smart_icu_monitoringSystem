# 🔌 WiFi & Backend Configuration Quick Start

## Get Your ESP32 Connected in 5 Minutes

---

## 📋 Checklist

- [ ] ESP32 connected to computer via USB
- [ ] Arduino IDE installed with ESP32 board support
- [ ] Backend server running (`python app.py`)
- [ ] Computer and ESP32 on same WiFi network

---

## Step 1️⃣: Find Your Backend IP Address

### Windows
```powershell
ipconfig
```
Look for the IPv4 address under your WiFi adapter:
```
Wireless LAN adapter WiFi:
   IPv4 Address . . . . . . . . . . : 192.168.1.100
```
✅ **Your Backend IP: `192.168.1.100`**

### Mac
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```
Look for something like: `192.168.1.100` or `10.0.0.50`

### Linux
```bash
hostname -I
```
Should show: `192.168.1.100 192.168.122.1`

---

## Step 2️⃣: Edit config.h

Open `esp32/config.h` and find these lines:

```cpp
const char* WIFI_SSID = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";
const char* BACKEND_URL = "http://localhost:5000/send-data";
```

**Replace with your values:**

```cpp
// CHANGE THESE THREE LINES:

const char* WIFI_SSID = "MyHomeWiFi";              // Your WiFi network name
const char* WIFI_PASSWORD = "MyPassword123";       // Your WiFi password
const char* BACKEND_URL = "http://192.168.1.100:5000/send-data";  // Backend IP from Step 1

// Leave everything else unchanged ✓
```

---

## Step 3️⃣: Verify Backend is Running

Before uploading firmware, make sure backend is ready:

```powershell
cd backend
python app.py
```

You should see:
```
 * Running on http://127.0.0.1:5000
 * Serving Flask app 'app'
 ⚠️  WARNING: This is a development server. Do not use it in production.
```

✅ **Keep this terminal open while testing ESP32**

---

## Step 4️⃣: Upload to ESP32

1. Open Arduino IDE
2. File → Open → `esp32/main.ino`
3. Select Tools → Board → "ESP32 Dev Module"
4. Select Tools → Port → "COM3" (or your USB port)
5. Click **Upload** (Ctrl+U)

Wait for: `Upload successful`

---

## Step 5️⃣: Verify Connection

Open Tools → Serial Monitor (select **115200 baud**):

### ✅ Success - You should see:
```
🔌 Connecting to WiFi....... ✅ Connected!
IP Address: 192.168.1.150
✅ MAX30102 initialized
✅ BMP085 initialized
🚀 All systems initialized.

📊 ECG: 0.45 | HR: 72 | SpO₂: 98% | BP: 1013 hPa | Temp: 37.2°C
✅ Data sent to Flask! Code: 200
📊 ECG: 0.48 | HR: 73 | SpO₂: 98% | BP: 1012 hPa | Temp: 37.1°C
✅ Data sent to Flask! Code: 200
```

### ✅ In Backend Terminal:
```
📥 Received: {'sequence': [[37.1, 72, 98, 1013, 0.45], ...]}
🤖 Model: RandomForest | Prediction: 0.234 (Alert: False)
✅ WebSocket broadcasted to 3 clients
```

### ✅ In Frontend Dashboard:
Vital signs update in real-time 📊

---

## ❌ Troubleshooting

### Problem: "WiFi disconnected"

**Check 1:** Is WiFi name spelled correctly?
```cpp
const char* WIFI_SSID = "MyHomeWiFi";  // ✓ Case sensitive!
```

**Check 2:** Is password correct?
```cpp
const char* WIFI_PASSWORD = "MyPassword123";  // ✓ No spaces, exact match
```

**Check 3:** Is it 2.4GHz WiFi? (ESP32 doesn't support 5GHz)
- Check your router settings
- Look for band setting: 2.4GHz ✓ or 5GHz ✗

**Solution:** Try longer timeout
```cpp
#define WIFI_TIMEOUT 30000  // Increase from 20000 to 30000
```

---

### Problem: "Failed to send data. Code: -1"

**Check 1:** Backend URL has correct IP?
```cpp
// Get IP from Step 1
const char* BACKEND_URL = "http://192.168.1.100:5000/send-data";
                               ^^^^^^^^^^^^^^
                          Your actual IP here
```

**Check 2:** Did you use `localhost`? ✗
```cpp
// WRONG - ESP32 can't reach local machine with "localhost"
const char* BACKEND_URL = "http://localhost:5000/send-data";  // ✗

// RIGHT - Use actual IP address
const char* BACKEND_URL = "http://192.168.1.100:5000/send-data";  // ✓
```

**Check 3:** Is backend running?
```powershell
# Terminal with backend should show:
 * Running on http://127.0.0.1:5000
```

If not, start it:
```powershell
cd backend
python app.py
```

**Check 4:** Is firewall blocking port 5000?
- Windows Defender may block Flask
- Allow through firewall or restart backend

---

### Problem: "MAX30102 not found!"

Your sensors didn't initialize. See `HARDWARE_SETUP.md` for wiring help.

---

## 🎯 Common Configurations

### 🏠 Home Network
```cpp
const char* WIFI_SSID = "HomeWiFi";
const char* WIFI_PASSWORD = "Password123";
const char* BACKEND_URL = "http://192.168.1.100:5000/send-data";
```

### 🏢 Office Network
```cpp
const char* WIFI_SSID = "OfficeNetwork";
const char* WIFI_PASSWORD = "ComplexPassword!@#";
const char* BACKEND_URL = "http://10.0.0.50:5000/send-data";  // Different subnet
```

### 🌐 Cloud Deployment
```cpp
const char* WIFI_SSID = "HomeWiFi";
const char* WIFI_PASSWORD = "Password123";
const char* BACKEND_URL = "http://cloud-server.com:5000/send-data";  // Domain name
```

### 🔄 Multi-Patient Setup
```cpp
// Patient 1
const char* DEVICE_ID = "PATIENT_001";
const char* BACKEND_URL = "http://192.168.1.100:5000/send-data";

// Patient 2 (different ESP32, different config.h)
const char* DEVICE_ID = "PATIENT_002";
const char* BACKEND_URL = "http://192.168.1.100:5000/send-data";  // Same backend
```

---

## 📡 Testing Commands

### From Windows PowerShell:

```powershell
# Test if ESP32 is reachable (find its IP)
arp -a

# Test if backend is running
Invoke-WebRequest http://192.168.1.100:5000 -TimeoutSec 5

# Test sending data to backend
Invoke-RestMethod -Uri "http://192.168.1.100:5000/send-data" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"sequence":[[37.0,72,98,120,80,0.5]]}'
```

### From Python:

```bash
python test_chat_endpoint.py
```

---

## ✅ Success Indicators

| Indicator | What It Means |
|-----------|--------------|
| Serial Monitor shows IP address | ESP32 connected to WiFi ✓ |
| `✅ MAX30102 initialized` | Sensors working ✓ |
| `✅ Data sent to Flask! Code: 200` | Backend received data ✓ |
| Backend shows `📥 Received:` | Data reached backend ✓ |
| Dashboard shows vitals updating | Full end-to-end working ✓ |

---

## 🚀 Next: Multi-Patient Setup

Once single ESP32 works, you can add more:

1. Duplicate config settings
2. Change `DEVICE_ID` for each ESP32
3. All send to same backend IP
4. Backend automatically routes to correct patient

See `HARDWARE_SETUP.md` → "Multi-Patient Setup" section.

---

## 🆘 Still Stuck?

1. Check all values in config.h are correct (use copy-paste, not typing)
2. Restart ESP32 after changing config.h (press EN button or repower)
3. Check Serial Monitor at 115200 baud
4. Verify backend is running (`python app.py`)
5. Test from another computer on same WiFi: `ping 192.168.1.100`

Happy monitoring! 🏥
