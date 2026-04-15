/**
 * ===================================================================
 * Smart ICU Monitoring System - ESP32 Configuration Header
 * ===================================================================
 * 
 * EDIT THIS FILE TO CONFIGURE YOUR ESP32 DEVICE
 * No need to modify main.ino after changing these settings
 * 
 * @author Smart ICU Team
 * @version 1.0
 */

#ifndef CONFIG_H
#define CONFIG_H

// ========================================
// 🔌 WIFI CONFIGURATION
// ========================================
// Set your WiFi network credentials here
const char* WIFI_SSID = "YOUR_WIFI_SSID";           // Replace with your WiFi network name
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";   // Replace with your WiFi password

// WiFi connection timeout (milliseconds)
#define WIFI_TIMEOUT 20000  // 20 seconds - wait up to 20 seconds to connect

// ========================================
// 🌐 BACKEND SERVER CONFIGURATION
// ========================================
// Set your backend server address here
// Examples:
//   - "http://192.168.1.100:5000/send-data"     (Windows/Mac with specific IP)
//   - "http://localhost:5000/send-data"         (If ESP32 on same machine)
//   - "http://192.168.0.5:5000/send-data"       (Raspberry Pi on network)
//   - "http://your-domain.com:5000/send-data"   (Cloud deployment)

const char* BACKEND_URL = "http://localhost:5000/send-data";

// HTTP connection timeout (milliseconds)
#define HTTP_TIMEOUT 10000  // 10 seconds

// ========================================
// 👤 PATIENT & DEVICE IDENTIFICATION
// ========================================
// Unique ID for this ESP32 device (enables multi-patient support)
// Examples: "PATIENT_001", "BED_A12", "ICU_ROOM_503"
const char* DEVICE_ID = "PATIENT_001";

// ========================================
// 📍 PIN CONFIGURATION
// ========================================
// Assign GPIO pins for each sensor
// Verify these match your hardware wiring!

#define ECG_PIN      34    // ECG sensor - must be ADC capable (GPIO34)
#define LM35_PIN     35    // Temperature sensor - must be ADC capable (GPIO35)
#define BUZZER_PIN   25    // Buzzer/alarm speaker output (GPIO25)

// I2C Pins (for MAX30102 pulse ox & BMP085 pressure)
// Standard ESP32 I2C pins - rarely need to change
#define I2C_SDA      21    // Data line (GPIO21)
#define I2C_SCL      22    // Clock line (GPIO22)

// ========================================
// 📊 SENSOR BUFFER CONFIGURATION
// ========================================
// Number of readings to store before sending to backend
// Larger = more stable predictions, longer delay
// Smaller = faster response, noisier data
#define BUFFER_SIZE 60     // 60 readings ≈ 60 seconds of data at 1Hz

// Sampling rate (milliseconds between readings)
#define SAMPLE_INTERVAL 1000  // 1000ms = 1 reading per second

// Transmission interval (how often to send buffered data to backend)
#define SEND_INTERVAL 10000   // 10000ms = send every 10 seconds

// ========================================
// ⚠️ ALERT THRESHOLDS
// ========================================
// Abnormal vital sign thresholds for local buzzer/alerts
// These trigger the ESP32 buzzer BEFORE data reaches backend

#define HR_MIN       60       // Minimum normal heart rate (BPM)
#define HR_MAX       100      // Maximum normal heart rate (BPM)
#define SPO2_MIN     95       // Minimum normal SpO₂ (%)
#define TEMP_MIN     35.0     // Minimum normal temperature (°C)
#define TEMP_MAX     38.5     // Maximum normal temperature (°C)
#define ECG_THRESHOLD 0.25    // Abnormal ECG threshold (0.0-1.0)

// ========================================
// 🔊 BUZZER CONFIGURATION
// ========================================
// Buzzer/alarm sound settings
#define BUZZER_FREQUENCY 2000  // Hz (tone frequency)
#define BUZZER_DURATION  500   // milliseconds

// ========================================
// 🌐 WEB SERVER CONFIGURATION
// ========================================
// Local web server for receiving commands from dashboard
#define WEB_SERVER_PORT 80  // Standard HTTP port

// ========================================
// 🔧 DEBUG & LOGGING
// ========================================
// Enable verbose serial output for troubleshooting
#define DEBUG_MODE true

// Serial baud rate (match your Serial Monitor settings)
#define SERIAL_BAUD 115200

// ========================================
// 📡 SENSOR LIBRARY SETTINGS
// ========================================
// MAX30102 pulse oximeter settings
#define MAX30102_I2C_ADDRESS 0x57

// BMP085 barometric pressure settings  
#define BMP085_I2C_ADDRESS 0x77

#endif // CONFIG_H
