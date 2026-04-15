"""
Simple test script to verify the /chat endpoint is working
"""
import requests
import json

BACKEND_URL = "http://localhost:5000"

print("Testing Smart ICU Backend Chat Endpoint")
print("=" * 50)

# Test 1: Check if backend is running
print("\n1. Testing root endpoint...")
try:
    response = requests.get(f"{BACKEND_URL}/", timeout=5)
    print(f"   ✓ Status: {response.status_code}")
    print(f"   ✓ Response: {response.text}")
except Exception as e:
    print(f"   ✗ Error: {e}")

# Test 2: Check if chat-test endpoint exists
print("\n2. Testing /chat-test endpoint...")
try:
    response = requests.get(f"{BACKEND_URL}/chat-test", timeout=5)
    print(f"   ✓ Status: {response.status_code}")
    print(f"   ✓ Response: {response.json()}")
except Exception as e:
    print(f"   ✗ Error: {e}")

# Test 3: Test OPTIONS preflight
print("\n3. Testing OPTIONS preflight for /chat...")
try:
    response = requests.options(f"{BACKEND_URL}/chat", timeout=5)
    print(f"   ✓ Status: {response.status_code}")
    print(f"   ✓ CORS Headers:")
    for header in ['Access-Control-Allow-Origin', 'Access-Control-Allow-Methods', 'Access-Control-Allow-Headers']:
        value = response.headers.get(header, 'NOT SET')
        print(f"      - {header}: {value}")
except Exception as e:
    print(f"   ✗ Error: {e}")

# Test 4: Test actual /chat POST endpoint
print("\n4. Testing /chat POST endpoint...")
try:
    payload = {
        "query": "What is the patient's heart rate?",
        "patient_data": {
            "heart_rate": 75,
            "spo2": 98,
            "temperature": 37.0,
            "bp_systolic": 120,
            "bp_diastolic": 80,
            "ecg": 0.5,
            "alert": False,
            "prediction": 0.2
        }
    }
    response = requests.post(
        f"{BACKEND_URL}/chat",
        json=payload,
        timeout=10,
        headers={"Content-Type": "application/json"}
    )
    print(f"   ✓ Status: {response.status_code}")
    data = response.json()
    if "chat_response" in data and "response" in data["chat_response"]:
        print(f"   ✓ Chat Response:")
        print(f"      {data['chat_response']['response'][:100]}...")
    else:
        print(f"   ✓ Response: {json.dumps(data, indent=2)}")
except Exception as e:
    print(f"   ✗ Error: {e}")

print("\n" + "=" * 50)
print("If all tests passed, the backend is working!")
print("Check browser console (F12 > Console) for frontend debug logs.")
