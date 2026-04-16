# ⚡ QUICK START - 5 MINUTE DEMO

## For The Impatient (No Setup Knowledge Needed)

### Step 1: Double-Click This

```
START_DEMO.bat
```

Wait 5 seconds. Three windows open automatically.

### Step 2: Open Your Browser

```
http://localhost:5173
```

You'll see the dashboard.

### Step 3: In the Simulator Window, Choose a Scenario

```
🔢 Enter scenario number (1-5) [default: 1]:
```

Type: `1` (or choose 2-5 for different patient states)

```
⏱️  How long to run simulation? (seconds, default 120):
```

Type: `120` (2 minutes of demo data)

### Step 4: Watch It Work!

- Simulator terminal shows vitals updating
- Dashboard shows charts updating in real-time
- Status changes based on vital signs
- AI triggers alerts when needed

### Step 5: Show the Chatbot

Click 💬 button in dashboard bottom-right

Ask: "What is the patient's heart rate?"

It responds with medical insight!

---

## 🎯 5-Minute Demo Flow

```
0:00 → Double-click START_DEMO.bat
0:05 → Wait for 3 windows to open + browser
1:00 → Choose scenario #1 (Normal patient)
2:00 → Show dashboard updating, explain features
3:00 → Ask chatbot: "Is patient in alert?"
3:30 → Switch simulator to scenario #3 (Critical)
4:00 → Show alerts triggering, explain AI
5:00 → Done! Questions?
```

---

## 🆘 If Something Breaks

### Dashboard shows blank page?
```powershell
# In frontend window:
Ctrl+C (stop it)
npm run dev (restart)
```

### Simulator says "Failed to connect"?
```powershell
# Check backend is running
# It should show: "Running on http://127.0.0.1:5000"
```

### Nothing working?
```powershell
cd d:\smart_icu_monitoringSystem

# Kill everything
taskkill /F /IM python.exe
taskkill /F /IM node.exe

# Start fresh
START_DEMO.bat
```

---

## 📊 What Scenarios Show

**1. Normal Patient** 💚
- Healthy vitals
- Green status
- Low risk prediction

**2. Tachycardia** 🟡
- Elevated heart rate
- Fever present
- Yellow caution

**3. Hypoxia** 🔴
- Low oxygen (SpO2 <95%)
- High heart rate
- RED ALERT!

**4. Critical** 🚨
- Multiple abnormal signs
- High fever + low O2 + high HR
- Extreme alert

**5. Recovering** 💚→💚
- Improving vitals
- Trending normal
- Status improving

---

## 🎤 What to Say

"This is an **AI-powered ICU monitoring system**. It:
1. Collects patient vital signs
2. Uses machine learning to predict deterioration
3. Alerts doctors in real-time
4. Allows natural language queries

Right now we're **simulating patient data**. In production, real sensors would collect vitals. The AI and dashboard work identically."

---

## 🏆 Impressive Features to Mention

✨ "The system uses **Deep Learning (LSTM)** for predictions"  
✨ "It understands **natural language queries** from doctors"  
✨ "**Real-time WebSocket** updates - no page refresh needed"  
✨ "Trained on **actual hospital data**"  
✨ "Can support **multiple patients** simultaneously"  

---

**That's it! You're ready to demo! 🚀**
