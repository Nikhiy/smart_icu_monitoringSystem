import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const VitalsChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-gray-500 font-medium">Waiting for vital signs data...</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
      {/* Combined Chart */}
      <div style={{ background: "#f9fafb", padding: "16px", borderRadius: "8px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#1f2937", marginBottom: "16px" }}>All Vital Signs</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 12 }} 
              stroke="#6b7280"
            />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "#fff", 
                border: "2px solid #3b82f6",
                borderRadius: "8px"
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="hr"
              stroke="#ef4444"
              strokeWidth={2.5}
              dot={false}
              name="Heart Rate (BPM)"
              isAnimationActive={true}
            />
            <Line
              type="monotone"
              dataKey="spo2"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={false}
              name="SpO₂ (%)"
            />
            <Line
              type="monotone"
              dataKey="temp"
              stroke="#f59e0b"
              strokeWidth={2.5}
              dot={false}
              name="Temperature (°C)"
            />
            <Line
              type="monotone"
              dataKey="bp"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={false}
              name="Systolic BP (mmHg)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Individual Mini Charts */}
      <div className="grid grid-cols-2 gap-4">
        <VitalsMiniChart title="❤️ Heart Rate" dataKey="hr" color="#ef4444" data={data} unit="BPM" />
        <VitalsMiniChart title="🫁 SpO₂" dataKey="spo2" color="#3b82f6" data={data} unit="%" />
        <VitalsMiniChart title="🌡️ Temperature" dataKey="temp" color="#f59e0b" data={data} unit="°C" />
        <VitalsMiniChart title="💉 Systolic BP" dataKey="bp" color="#10b981" data={data} unit="mmHg" />
      </div>
    </div>
  );
};

const VitalsMiniChart = ({ title, dataKey, color, data, unit }) => {
  const latestValue = data.length > 0 ? data[data.length - 1][dataKey] : 0;
  
  return (
    <div className="bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-blue-400 transition-all">
      <p className="text-sm font-bold text-gray-700 mb-2">{title}</p>
      <p className="text-2xl font-black mb-3" style={{ color }}>
        {latestValue} <span className="text-sm">{unit}</span>
      </p>
      <ResponsiveContainer width="100%" height={100}>
        <LineChart data={data.slice(-10)}>
          <CartesianGrid strokeDasharray="3 3" stroke={color} strokeOpacity={0.1} />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VitalsChart;
