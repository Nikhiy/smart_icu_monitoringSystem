import React, { useState } from "react";

const PatientForm = ({ onSubmit, initialData = {} }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData.name || "John Doe",
    age: initialData.age || "56",
    gender: initialData.gender || "Male",
    patientId: initialData.patientId || "ICU12345",
    room: initialData.room || "B-12",
    doctor: initialData.doctor || "Dr. Smith",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setShowForm(false);
    // Save to localStorage
    localStorage.setItem("patientData", JSON.stringify(formData));
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        style={{
          padding: "12px 24px",
          background: "linear-gradient(90deg, #3b82f6 0%, #1e40af 100%)",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontWeight: "bold",
          cursor: "pointer",
          fontSize: "14px",
          marginBottom: "16px"
        }}
      >
        ✏️ Edit Patient Details
      </button>
    );
  }

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0, 0, 0, 0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000
    }}>
      <div style={{
        background: "white",
        borderRadius: "16px",
        padding: "32px",
        maxWidth: "500px",
        width: "90%",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)"
      }}>
        <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "24px", color: "#1f2937" }}>
          👤 Patient Information
        </h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Name */}
          <div>
            <label style={{ display: "block", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
              Patient Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px",
                fontFamily: "inherit"
              }}
              required
            />
          </div>

          {/* Age */}
          <div>
            <label style={{ display: "block", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
              Age
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px",
                fontFamily: "inherit"
              }}
              required
            />
          </div>

          {/* Gender */}
          <div>
            <label style={{ display: "block", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px",
                fontFamily: "inherit"
              }}
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          {/* Patient ID */}
          <div>
            <label style={{ display: "block", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
              Patient ID
            </label>
            <input
              type="text"
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px",
                fontFamily: "inherit"
              }}
              required
            />
          </div>

          {/* Room */}
          <div>
            <label style={{ display: "block", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
              Room Number
            </label>
            <input
              type="text"
              name="room"
              value={formData.room}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px",
                fontFamily: "inherit"
              }}
              required
            />
          </div>

          {/* Doctor */}
          <div>
            <label style={{ display: "block", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
              Attending Doctor
            </label>
            <input
              type="text"
              name="doctor"
              value={formData.doctor}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px",
                fontFamily: "inherit"
              }}
              required
            />
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: "12px",
                background: "linear-gradient(90deg, #16a34a 0%, #15803d 100%)",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              ✅ Save
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              style={{
                flex: 1,
                padding: "12px",
                background: "#e5e7eb",
                color: "#374151",
                border: "none",
                borderRadius: "6px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              ❌ Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientForm;
