import { useState, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { motion, AnimatePresence } from "framer-motion";
import { useSimulation } from "../../utils/SimulationContext";
import { FaFlask, FaRunning, FaHeartbeat, FaUndo } from "react-icons/fa";
import "./WaterfallCard.css";

const COLORS = {
  baseline: "rgba(124,77,255,0.35)",
  positive: "#7C4DFF",
  negative: "#F2A365",
};

const BASE_SCORE = 70;

export default function WaterfallCard({ todaySteps = 0, todayCalories = 0 }) {
  const { simulatedMarkers } = useSimulation();
  const [mode, setMode] = useState("all");

  // Multi-marker simulation state
  const [simDeltas, setSimDeltas] = useState({ trt: 0, ldl: 0, hba1c: 0 });
  const [activeSim, setActiveSim] = useState("ldl");

  const handleReset = () => setSimDeltas({ trt: 0, ldl: 0, hba1c: 0 });

  const allImpacts = useMemo(() => {
    const trt = simulatedMarkers.find((m) => m.id === "trt").value;
    const ldl = simulatedMarkers.find((m) => m.id === "ldl").value;
    const hba1c = simulatedMarkers.find((m) => m.id === "hba1c").value;

    return [
      {
        key: "trt",
        category: "labs",
        title: "Testosterone",
        value: (trt > 600 ? 8 : trt > 400 ? 4 : -5) + simDeltas.trt,
        description: trt > 600 ? "Optimal T-levels" : "T-level impact",
      },
      {
        key: "ldl",
        category: "labs",
        title: "Lipids",
        value: (ldl < 100 ? 6 : ldl < 130 ? 2 : -7) + simDeltas.ldl,
        description: ldl < 100 ? "Excellent LDL profile" : "Lipid impact",
      },
      {
        key: "hba1c",
        category: "labs",
        title: "Glucose",
        value: (hba1c < 5.4 ? 5 : -4) + simDeltas.hba1c,
        description: hba1c < 5.4 ? "Stable glucose" : "Glucose impact",
      },
      {
        key: "steps",
        category: "recovery",
        title: "Movement",
        value: todaySteps > 8000 ? 7 : todaySteps > 4000 ? 3 : -3,
        description: "Step volume",
      },
      {
        key: "calories",
        category: "recovery",
        title: "Burn",
        value: todayCalories > 500 ? 4 : 1,
        description: "Metabolic burn",
      },
    ];
  }, [simulatedMarkers, todaySteps, todayCalories, simDeltas]);

  const filteredImpacts = useMemo(() => {
    if (mode === "all") return allImpacts;
    return allImpacts.filter((i) => i.category === mode);
  }, [mode, allImpacts]);

  const computed = useMemo(() => {
    let running = BASE_SCORE;
    return filteredImpacts.map((i) => {
      const start = running;
      running += i.value;
      return { ...i, start, end: running };
    });
  }, [filteredImpacts]);

  const finalScore = BASE_SCORE + allImpacts.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <motion.div className="insight-card waterfall-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
      {/* HEADER SECTION */}
      <div className="waterfall-header">
        <div className="waterfall-title">
          <h6>Health Score Breakdown</h6>
          <span className="waterfall-sub">Analyzing {mode} contributors</span>
        </div>

        <div className="waterfall-toggle">
          <button className={mode === "all" ? "active" : ""} onClick={() => setMode("all")}>
            <FaHeartbeat /> All
          </button>
          <button className={mode === "labs" ? "active" : ""} onClick={() => setMode("labs")}>
            <FaFlask /> Labs
          </button>
          <button className={mode === "recovery" ? "active" : ""} onClick={() => setMode("recovery")}>
            <FaRunning /> Recovery
          </button>
        </div>
      </div>

      {/* CHART SECTION */}
      <div className="chart-container" style={{ height: "220px", marginTop: "1rem" }}>
        <Bar
          data={{
            labels: ["Base", ...computed.map((i) => i.title)],
            datasets: [
              { data: [0, ...computed.map((i) => i.start)], backgroundColor: "transparent", stack: "stack1" },
              {
                data: [BASE_SCORE, ...computed.map((i) => i.value)],
                backgroundColor: [COLORS.baseline, ...computed.map((i) => (i.value > 0 ? COLORS.positive : COLORS.negative))],
                borderRadius: 6,
                barThickness: 20,
                stack: "stack1",
              },
            ],
          }}
          options={{
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { display: false, beginAtZero: true },
              x: { grid: { display: false }, ticks: { color: "#8B8FA3", font: { size: 9 } } },
            },
          }}
        />
      </div>

      {/* INTERACTIVE SIMULATION UI */}
      <div className="waterfall-sim">
        <div className="sim-nav">
          <div className="sim-tabs">
            {["ldl", "trt", "hba1c"].map((id) => (
              <button key={id} className={`sim-tab ${activeSim === id ? "active" : ""}`} onClick={() => setActiveSim(id)}>
                {id.toUpperCase()}
              </button>
            ))}
          </div>
          <button className="reset-btn" onClick={handleReset} title="Reset all simulations">
            <FaUndo /> Reset
          </button>
        </div>

        <div className="sim-controls">
          <div className="sim-info">
            <strong>Adjust {activeSim.toUpperCase()} Impact</strong>
            <span className="sim-delta">
              {simDeltas[activeSim] > 0 ? "+" : ""}
              {simDeltas[activeSim]} pts
            </span>
          </div>

          <input type="range" min={-10} max={10} step={1} value={simDeltas[activeSim]} onChange={(e) => setSimDeltas({ ...simDeltas, [activeSim]: Number(e.target.value) })} />
        </div>

        <div className="sim-result">
          Overall Projected Score: <strong>{finalScore}</strong>
        </div>
      </div>
    </motion.div>
  );
}
