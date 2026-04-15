import React from "react";

const AlertBanner = ({ alerts = [] }) => {
  if (!alerts || alerts.length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{
          background: "linear-gradient(90deg, #f0fdf4 0%, #dcfce7 100%)",
          border: "2px solid #16a34a",
          borderRadius: "8px",
          padding: "24px",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>✅</div>
          <p style={{ fontSize: "18px", fontWeight: "bold", color: "#166534" }}>All Vitals Normal</p>
          <p style={{ fontSize: "14px", color: "#7c2d12" }}>Patient is stable</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "16px",
        paddingBottom: "12px",
        borderBottom: "2px solid #fca5a5"
      }}>
        <span style={{ fontSize: "24px" }}>⚠️</span>
        <p style={{ fontWeight: "bold", color: "#dc2626", fontSize: "18px" }}>Active Alerts ({alerts.length})</p>
      </div>
      
      {alerts.map((alert, index) => (
        <div
          key={index}
          style={{
            background: "linear-gradient(90deg, #fef2f2 0%, #fffbeb 100%)",
            borderLeft: "4px solid #dc2626",
            borderRadius: "8px",
            padding: "16px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s ease"
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "20px", marginTop: "2px" }}>🔴</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: "bold", color: "#991b1b" }}>{alert}</p>
              <p style={{ fontSize: "12px", color: "#dc2626", marginTop: "4px" }}>
                ⏰ {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      ))}

      <div style={{
        marginTop: "16px",
        background: "#fffbeb",
        border: "1px solid #fcd34d",
        borderRadius: "8px",
        padding: "12px"
      }}>
        <p style={{ fontSize: "12px", color: "#92400e", fontWeight: "600" }}>
          ⚠️ Alert threshold exceeded. Medical staff has been notified.
        </p>
      </div>
    </div>
  );
};

export default AlertBanner;