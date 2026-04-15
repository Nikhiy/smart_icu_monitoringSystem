// src/components/ui/BuzzerToggle.jsx
import React, { useState } from "react";

const BuzzerToggle = ({ isOn = false }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    const newMuted = !isMuted;
    setIsLoading(true);
    const esp32Host = import.meta.env.VITE_ESP32_HOST || "http://<ESP32_IP>";

    try {
      const response = await fetch(`${esp32Host}/mute-buzzer`, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: newMuted ? "true" : "false",
      });

      const data = await response.json();
      setIsMuted(newMuted);
      setStatusMessage(data.status || "✅ Command sent to ESP32");
      
      setTimeout(() => setStatusMessage(""), 3000);
    } catch (error) {
      console.error("Error:", error);
      setStatusMessage("❌ Failed to communicate with ESP32");
      setTimeout(() => setStatusMessage(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Alarm Status */}
      <div style={{
        padding: "16px",
        borderRadius: "8px",
        border: "2px solid",
        background: isOn ? "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)" : "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
        borderColor: isOn ? "#fca5a5" : "#86efac"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {isOn ? (
            <>
              <span style={{ fontSize: "24px", animation: "pulse 2s infinite" }}>🔔</span>
              <div>
                <p style={{ fontWeight: "bold", color: "#991b1b" }}>🔔 Alarm Active</p>
                <p style={{ fontSize: "14px", color: "#dc2626" }}>Patient requires attention</p>
              </div>
            </>
          ) : (
            <>
              <span style={{ fontSize: "24px" }}>🔇</span>
              <div>
                <p style={{ fontWeight: "bold", color: "#166534" }}>✓ Alarm Silent</p>
                <p style={{ fontSize: "14px", color: "#16a34a" }}>No alerts at this time</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Buzzer Control */}
      <button
        onClick={handleToggle}
        disabled={isLoading}
        style={{
          width: "100%",
          padding: "12px 16px",
          borderRadius: "8px",
          fontWeight: "bold",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          border: "none",
          cursor: isLoading ? "not-allowed" : "pointer",
          background: isMuted
            ? "linear-gradient(90deg, #3b82f6 0%, #1e40af 100%)"
            : "linear-gradient(90deg, #f97316 0%, #dc2626 100%)",
          opacity: isLoading ? 0.7 : 1,
          transform: isLoading ? "scale(0.95)" : "scale(1)",
          transition: "all 0.2s ease"
        }}
      >
        <span style={{ fontSize: "18px" }}>{isMuted ? "🔕" : "🔔"}</span>
        <span>{isMuted ? "Unmute Buzzer" : "Mute Buzzer"}</span>
      </button>

      {/* Status Message */}
      {statusMessage && (
        <div style={{
          padding: "12px",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: "600",
          textAlign: "center",
          background: statusMessage.includes("✅") ? "#dcfce7" : "#fee2e2",
          color: statusMessage.includes("✅") ? "#166534" : "#991b1b"
        }}>
          {statusMessage}
        </div>
      )}
    </div>
  );
};

export default BuzzerToggle;