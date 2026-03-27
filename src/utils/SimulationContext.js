import { createContext, useContext, useState, useEffect } from "react";

const SimulationContext = createContext();

export const initialMarkers = [
  { id: "ldl", label: "LDL Cholesterol", min: 50, max: 200, unit: "mg/dL", value: 106 },
  { id: "hdl", label: "HDL Cholesterol", min: 20, max: 100, unit: "mg/dL", value: 45 },
  { id: "trt", label: "Total Testosterone", min: 200, max: 1200, unit: "ng/dL", value: 650 },
  { id: "hba1c", label: "HbA1c (Glucose)", min: 4, max: 10, unit: "%", value: 5.2 },
  { id: "cortisol", label: "Cortisol", min: 5, max: 25, unit: "mcg/dL", value: 12 },
];

export function SimulationProvider({ children }) {
  // Load from localStorage or use initial markers
  const [simulatedMarkers, setSimulatedMarkers] = useState(() => {
    const saved = localStorage.getItem("evermen_sim_data");
    return saved ? JSON.parse(saved) : initialMarkers;
  });

  const updateMarker = (id, newValue) => {
    setSimulatedMarkers((prev) => prev.map((m) => (m.id === id ? { ...m, value: parseFloat(newValue) } : m)));
  };

  const applySimulation = (newMarkers) => {
    setSimulatedMarkers(newMarkers);
    localStorage.setItem("evermen_sim_data", JSON.stringify(newMarkers));
  };

  return <SimulationContext.Provider value={{ simulatedMarkers, updateMarker, applySimulation }}>{children}</SimulationContext.Provider>;
}

export const useSimulation = () => useContext(SimulationContext);
