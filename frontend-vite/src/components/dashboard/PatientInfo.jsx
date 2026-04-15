import React from "react";

const PatientInfo = ({ vitals, patientData = {} }) => {
  const patient = {
    name: patientData.name || "John Doe",
    age: patientData.age || "56",
    gender: patientData.gender || "Male",
    patientId: patientData.patientId || "ICU12345",
    room: patientData.room || "B-12",
    doctor: patientData.doctor || "Dr. Smith",
  };

  const getStatusColor = (value, min, max) => {
    if (value < min || value > max) return "#dc2626";
    return "#16a34a";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div style={{ borderBottom: "2px solid #60a5fa", paddingBottom: "16px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "white", marginBottom: "8px" }}>👤 Patient Information</h2>
        <div style={{ fontSize: "12px", color: "#9ca3af" }}>Last Updated: {vitals.time}</div>
      </div>

      {/* Patient Details Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
        <div style={{ background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)", padding: "16px", borderRadius: "8px" }}>
          <p style={{ fontSize: "12px", fontWeight: "600", color: "#4b5563", textTransform: "uppercase" }}>Name</p>
          <p style={{ fontSize: "18px", fontWeight: "bold", color: "#1e3a8a" }}>{patient.name}</p>
        </div>
        <div style={{ background: "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)", padding: "16px", borderRadius: "8px" }}>
          <p style={{ fontSize: "12px", fontWeight: "600", color: "#4b5563", textTransform: "uppercase" }}>Age</p>
          <p style={{ fontSize: "18px", fontWeight: "bold", color: "#6b21a8" }}>{patient.age} years</p>
        </div>
        <div style={{ background: "linear-gradient(135deg, #ffe4e6 0%, #fce7f3 100%)", padding: "16px", borderRadius: "8px" }}>
          <p style={{ fontSize: "12px", fontWeight: "600", color: "#4b5563", textTransform: "uppercase" }}>Gender</p>
          <p style={{ fontSize: "18px", fontWeight: "bold", color: "#9f1239" }}>{patient.gender}</p>
        </div>
        <div style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)", padding: "16px", borderRadius: "8px" }}>
          <p style={{ fontSize: "12px", fontWeight: "600", color: "#4b5563", textTransform: "uppercase" }}>Room</p>
          <p style={{ fontSize: "18px", fontWeight: "bold", color: "#166534" }}>{patient.room}</p>
        </div>
      </div>

      {/* Important Info */}
      <div style={{ background: "white", padding: "16px", borderRadius: "8px", border: "2px solid #93c5fd" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <span style={{ fontWeight: "600", color: "#1f2937" }}>Patient ID</span>
          <span style={{ color: "#2563eb", fontFamily: "monospace", fontWeight: "bold" }}>{patient.patientId}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: "600", color: "#1f2937" }}>Attending Doctor</span>
          <span style={{ color: "#2563eb", fontWeight: "bold" }}>{patient.doctor}</span>
        </div>
      </div>

      {/* Quick Vitals Indicators */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
        <div style={{
          background: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
          padding: "16px",
          borderRadius: "8px",
          borderLeft: "4px solid #ef4444"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <span>❤️</span>
            <p style={{ fontSize: "12px", fontWeight: "600", color: "#7f1d1d", textTransform: "uppercase" }}>HR</p>
          </div>
          <p style={{ fontSize: "20px", fontWeight: "bold", color: getStatusColor(vitals.heart_rate, 60, 100) }}>
            {vitals.heart_rate} BPM
          </p>
        </div>

        <div style={{
          background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
          padding: "16px",
          borderRadius: "8px",
          borderLeft: "4px solid #3b82f6"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <span>🫁</span>
            <p style={{ fontSize: "12px", fontWeight: "600", color: "#1e40af", textTransform: "uppercase" }}>SpO₂</p>
          </div>
          <p style={{ fontSize: "20px", fontWeight: "bold", color: getStatusColor(vitals.spo2, 95, 100) }}>
            {vitals.spo2} %
          </p>
        </div>

        <div style={{
          background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
          padding: "16px",
          borderRadius: "8px",
          borderLeft: "4px solid #f59e0b"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <span>🌡️</span>
            <p style={{ fontSize: "12px", fontWeight: "600", color: "#92400e", textTransform: "uppercase" }}>Temp</p>
          </div>
          <p style={{ fontSize: "20px", fontWeight: "bold", color: getStatusColor(vitals.temperature, 36, 37.5) }}>
            {vitals.temperature}°C
          </p>
        </div>

        <div style={{
          background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
          padding: "16px",
          borderRadius: "8px",
          borderLeft: "4px solid #10b981"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <span>💉</span>
            <p style={{ fontSize: "12px", fontWeight: "600", color: "#166534", textTransform: "uppercase" }}>BP</p>
          </div>
          <p style={{ fontSize: "20px", fontWeight: "bold", color: getStatusColor(vitals.bp_systolic, 0, 140) }}>
            {vitals.bp_systolic}/{vitals.bp_diastolic}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientInfo;