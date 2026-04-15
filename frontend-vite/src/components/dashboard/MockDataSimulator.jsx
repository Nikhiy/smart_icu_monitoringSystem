import React, { useState, useEffect } from "react";

const MockDataSimulator = ({ onDataUpdate }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  const generateMockVitals = () => {
    // Generate realistic ICU vitals with some variation
    const baseHR = 75 + Math.random() * 20; // 75-95 BPM
    const baseSpO2 = 96 + Math.random() * 4; // 96-100%
    const baseTemp = 36.5 + Math.random() * 1.5; // 36.5-38°C
    const baseSys = 110 + Math.random() * 30; // 110-140 mmHg
    const baseDia = 70 + Math.random() * 20; // 70-90 mmHg

    return {
      heart_rate: Math.round(baseHR),
      spo2: Math.round(baseSpO2),
      temperature: Math.round(baseTemp * 10) / 10,
      systolic: Math.round(baseSys),
      diastolic: Math.round(baseDia),
      ecg: Math.sin(Date.now() / 1000) * 50 + 100, // Simulated ECG wave
    };
  };

  const startSimulation = () => {
    setIsRunning(true);
    const id = setInterval(() => {
      const mockData = generateMockVitals();
      onDataUpdate(mockData);
    }, 2000); // Update every 2 seconds
    setIntervalId(id);
  };

  const stopSimulation = () => {
    setIsRunning(false);
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);

  return (
    <div style={{
      background: "white",
      borderRadius: "16px",
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
      overflow: "hidden",
      marginBottom: "24px"
    }}>
      <div style={{
        background: "linear-gradient(90deg, #f59e0b 0%, #d97706 100%)",
        padding: "16px",
        color: "white"
      }}>
        <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>🧪 Mock Data Simulator</h2>
      </div>
      <div style={{ padding: "24px" }}>
        <p style={{ marginBottom: "16px", color: "#6b7280" }}>
          Generate simulated patient vitals to test the dashboard functionality.
        </p>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={isRunning ? stopSimulation : startSimulation}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
              border: "none",
              background: isRunning
                ? "linear-gradient(90deg, #dc2626 0%, #b91c1c 100%)"
                : "linear-gradient(90deg, #16a34a 0%, #15803d 100%)",
              color: "white",
              transition: "all 0.2s ease"
            }}
          >
            {isRunning ? "⏹️ Stop Simulation" : "▶️ Start Simulation"}
          </button>

          <div style={{
            padding: "12px 16px",
            background: isRunning ? "#dcfce7" : "#f3f4f6",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
            color: isRunning ? "#166534" : "#6b7280"
          }}>
            Status: {isRunning ? "🟢 Running (2s intervals)" : "🔴 Stopped"}
          </div>
        </div>

        <div style={{ marginTop: "16px", fontSize: "12px", color: "#9ca3af" }}>
          <p>📊 <strong>What it simulates:</strong></p>
          <ul style={{ marginLeft: "16px", marginTop: "4px" }}>
            <li>• Heart Rate: 75-95 BPM</li>
            <li>• SpO₂: 96-100%</li>
            <li>• Temperature: 36.5-38°C</li>
            <li>• Blood Pressure: 110-140/70-90 mmHg</li>
            <li>• ECG Waveform: Simulated sine wave</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MockDataSimulator;