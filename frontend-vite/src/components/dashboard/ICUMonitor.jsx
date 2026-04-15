// import React, { useEffect, useState } from "react";
// import socket from "@/api/socket"; // Use default import
// import VitalsChart from "./VitalsChart";
// import ECGWaveform from "./ECGWaveform";
// import AlertBanner from "../ui/AlertBanner";
// import BuzzerToggle from "../ui/BuzzerToggle";
// import PatientInfo from "./PatientInfo";

// const ICUMonitor = () => {
//   const [vitals, setVitals] = useState({
//     heart_rate: 0,
//     spo2: 0,
//     temperature: 0,
//     bp_systolic: 0,
//     bp_diastolic: 0,
//     ecg: 0,
//   });

//   const [alerts, setAlerts] = useState([]);
//   const [isBuzzing, setIsBuzzing] = useState(false);

//   useEffect(() => {
//     socket.on("vitals_data", (data) => {
//       setVitals(data);

//       const newAlerts = [];
//       if (data.heart_rate < 60 || data.heart_rate > 100) {
//         newAlerts.push("Abnormal Heart Rate Detected");
//       }
//       if (data.spo2 < 95) {
//         newAlerts.push("Low SpO₂ Level");
//       }
//       if (data.temperature < 36 || data.temperature > 37.5) {
//         newAlerts.push("Abnormal Body Temperature");
//       }
//       if (data.bp_systolic > 140 || data.bp_diastolic > 90) {
//         newAlerts.push("High Blood Pressure");
//       }

//       setAlerts(newAlerts);
//       setIsBuzzing(newAlerts.length > 0);
//     });

//     return () => {
//       socket.off("vitals_data");
//     };
//   }, []);

//   return (
//     <div className="min-h-screen bg-slate-900 p-4">
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//         {/* Left Column */}
//         <div className="space-y-4">
//           <div className="bg-white p-4 rounded-2xl shadow-lg">
//             <PatientInfo vitals={vitals} />
//           </div>

//           <div className="bg-white p-4 rounded-2xl shadow-lg">
//             <VitalsChart vitals={vitals} />
//           </div>

//           <div className="bg-white p-4 rounded-2xl shadow-lg">
//             <ECGWaveform ecgData={vitals.ecg} />
//           </div>

//           <div className="bg-white p-4 rounded-2xl shadow-lg">
//             <BuzzerToggle isOn={isBuzzing} />
//           </div>
//         </div>

//         {/* Right Column */}
//         <div className="space-y-4">
//           <div className="bg-white p-4 rounded-2xl shadow-lg">
//             <AlertBanner alerts={alerts} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ICUMonitor;

// src/components/dashboard/ICUMonitor.jsx
import React, { useEffect, useState } from "react";
import socket from "@/api/socket";
import VitalsChart from "./VitalsChart";
import ECGWaveform from "./ECGWaveform";
import AlertBanner from "../ui/AlertBanner";
import BuzzerToggle from "../ui/BuzzerToggle";
import ChatBot from "../ui/ChatBot";
import PatientInfo from "./PatientInfo";
import PatientForm from "./PatientForm";
import MockDataSimulator from "./MockDataSimulator";

const ICUMonitor = () => {
  const [patientData, setPatientData] = useState({
    name: "John Doe",
    age: "56",
    gender: "Male",
    patientId: "ICU12345",
    room: "B-12",
    doctor: "Dr. Smith",
  });
  const [vitals, setVitals] = useState({
    heart_rate: 0,
    spo2: 0,
    temperature: 0,
    bp_systolic: 0,
    bp_diastolic: 0,
    ecg: 0,
    time: new Date().toLocaleTimeString(),
  });
  const [chartData, setChartData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [isBuzzing, setIsBuzzing] = useState(false);

  // Load patient data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("patientData");
    if (savedData) {
      setPatientData(JSON.parse(savedData));
    }
  }, []);

  const handlePatientDataUpdate = (newData) => {
    setPatientData(newData);
    localStorage.setItem("patientData", JSON.stringify(newData));
  };

  const handleMockDataUpdate = (mockData) => {
    const formattedData = {
      hr: mockData.heart_rate,
      spo2: mockData.spo2,
      temp: mockData.temperature,
      bp: mockData.systolic,
      time: new Date().toLocaleTimeString(),
    };

    setVitals({
      heart_rate: mockData.heart_rate,
      spo2: mockData.spo2,
      temperature: mockData.temperature,
      bp_systolic: mockData.systolic,
      bp_diastolic: mockData.diastolic,
      ecg: mockData.ecg,
      time: formattedData.time,
    });

    setChartData((prev) => [...prev.slice(-19), formattedData]);

    const newAlerts = [];
    if (mockData.heart_rate < 60 || mockData.heart_rate > 100) {
      newAlerts.push("Abnormal Heart Rate Detected");
    }
    if (mockData.spo2 < 95) {
      newAlerts.push("Low SpO₂ Level");
    }
    if (mockData.temperature < 36 || mockData.temperature > 37.5) {
      newAlerts.push("Abnormal Body Temperature");
    }
    if (mockData.systolic > 140 || mockData.diastolic > 90) {
      newAlerts.push("High Blood Pressure");
    }

    setAlerts(newAlerts);
    setIsBuzzing(newAlerts.length > 0);
  };

  useEffect(() => {
    socket.on("vitals", (data) => {
      const formattedData = {
        hr: data.heart_rate,
        spo2: data.spo2,
        temp: data.temperature,
        bp: data.systolic,
        time: new Date().toLocaleTimeString(),
      };

      setVitals({
        heart_rate: data.heart_rate,
        spo2: data.spo2,
        temperature: data.temperature,
        bp_systolic: data.systolic,
        bp_diastolic: data.diastolic,
        ecg: data.ecg,
        time: formattedData.time,
      });

      setChartData((prev) => [...prev.slice(-19), formattedData]);

      const newAlerts = [];
      if (data.heart_rate < 60 || data.heart_rate > 100) {
        newAlerts.push("Abnormal Heart Rate Detected");
      }
      if (data.spo2 < 95) {
        newAlerts.push("Low SpO₂ Level");
      }
      if (data.temperature < 36 || data.temperature > 37.5) {
        newAlerts.push("Abnormal Body Temperature");
      }
      if (data.systolic > 140 || data.diastolic > 90) {
        newAlerts.push("High Blood Pressure");
      }

      setAlerts(newAlerts);
      setIsBuzzing(newAlerts.length > 0);
    });

    return () => {
      socket.off("vitals");
    };
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)", padding: "24px" }}>
      {/* Patient Form Modal */}
      <PatientForm onSubmit={handlePatientDataUpdate} initialData={patientData} />

      {/* Header */}
      <div style={{
        marginBottom: "32px",
        background: "linear-gradient(90deg, #2563eb 0%, #1e40af 100%)",
        padding: "24px",
        borderRadius: "16px",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
        borderLeft: "4px solid #06b6d4",
        color: "white"
      }}>
        <h1 style={{ fontSize: "36px", fontWeight: "900", marginBottom: "8px" }}>🏥 Smart ICU Monitor</h1>
        <p style={{ color: "#dbeafe", fontSize: "16px" }}>Real-time Patient Vital Signs & Health Analytics</p>
      </div>

      {/* Mock Data Simulator */}
      <MockDataSimulator onDataUpdate={handleMockDataUpdate} />

      {/* Main Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(600px, 1fr))", gap: "24px" }}>
        {/* Left Column - Patient Info & Chart */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Patient Info Card */}
          <div style={{
            background: "white",
            borderRadius: "16px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
            overflow: "hidden"
          }}>
            <div style={{
              background: "linear-gradient(90deg, #3b82f6 0%, #1e40af 100%)",
              padding: "16px",
              color: "white"
            }}>
              <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>👤 Patient Details</h2>
            </div>
            <div style={{ padding: "24px" }}>
              <PatientInfo vitals={vitals} patientData={patientData} />
            </div>
          </div>

          {/* Vitals Chart */}
          <div style={{
            background: "white",
            borderRadius: "16px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
            overflow: "hidden"
          }}>
            <div style={{
              background: "linear-gradient(90deg, #16a34a 0%, #15803d 100%)",
              padding: "16px",
              color: "white"
            }}>
              <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>📊 Vital Signs Trends</h2>
            </div>
            <div style={{ padding: "24px" }}>
              <VitalsChart data={chartData} />
            </div>
          </div>
        </div>

        {/* Right Column - Alerts & ECG */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Alerts Panel */}
          <div style={{
            background: "white",
            borderRadius: "16px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
            overflow: "hidden"
          }}>
            <div style={{
              background: alerts.length > 0 ? "linear-gradient(90deg, #dc2626 0%, #991b1b 100%)" : "linear-gradient(90deg, #16a34a 0%, #15803d 100%)",
              padding: "16px",
              color: "white"
            }}>
              <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>⚠️ Alert System</h2>
            </div>
            <div style={{ padding: "24px" }}>
              <AlertBanner alerts={alerts} />
            </div>
          </div>

          {/* ECG Waveform */}
          <div style={{
            background: "white",
            borderRadius: "16px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
            overflow: "hidden"
          }}>
            <div style={{
              background: "linear-gradient(90deg, #9333ea 0%, #6b21a8 100%)",
              padding: "16px",
              color: "white"
            }}>
              <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>📈 ECG Waveform</h2>
            </div>
            <div style={{ padding: "24px" }}>
              <ECGWaveform ecgData={vitals.ecg} />
            </div>
          </div>

          {/* Buzzer Toggle */}
          <div style={{
            background: "white",
            borderRadius: "16px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
            overflow: "hidden"
          }}>
            <div style={{
              background: isBuzzing ? "linear-gradient(90deg, #eab308 0%, #b45309 100%)" : "linear-gradient(90deg, #6b7280 0%, #374151 100%)",
              padding: "16px",
              color: "white"
            }}>
              <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>🔔 Alarm System</h2>
            </div>
            <div style={{ padding: "24px" }}>
              <BuzzerToggle isOn={isBuzzing} />
            </div>
          </div>
        </div>
      </div>
      
      {/* ChatBot Floating Widget */}
      <ChatBot patientData={vitals} />
    </div>
  );
};

export default ICUMonitor;
