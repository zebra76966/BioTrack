import { useState, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { motion } from "framer-motion";
import { impacts, BASE_SCORE } from "../../data/healthImpacts";
import "./WaterfallCard.css";

import { FaFlask, FaRunning, FaHeartbeat } from "react-icons/fa";

import "./WaterfallCard.css";

const COLORS = {
  baseline: "rgba(124,77,255,0.35)",
  positive: "#7C4DFF",
  negative: "#F2A365",
};

export default function WaterfallCard() {
  const [ldl, setLdl] = useState(-3);

  const [mode, setMode] = useState("all");

  const computed = useMemo(() => {
    let running = BASE_SCORE;

    return impacts.map((i) => {
      const value = i.key === "ldl" ? ldl : i.basePoints;
      const start = running;
      running += value;

      return {
        ...i,
        value,
        start,
        end: running,
      };
    });
  }, [ldl]);

  const finalScore = BASE_SCORE + computed.reduce((a, b) => a + b.value, 0);

  return (
    <motion.div className="insight-card waterfall-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
      <div className="waterfall-header">
        <div className="waterfall-title">
          <h6>Health Score Breakdown</h6>
          <span className="waterfall-sub">How each factor shifts your score</span>
        </div>

        <div className="waterfall-toggle">
          <button className={mode === "all" ? "active" : ""} onClick={() => setMode("all")}>
            <FaHeartbeat />
            All
          </button>

          <button className={mode === "labs" ? "active" : ""} onClick={() => setMode("labs")}>
            <FaFlask />
            Labs
          </button>

          <button className={mode === "recovery" ? "active" : ""} onClick={() => setMode("recovery")}>
            <FaRunning />
            Recovery
          </button>
        </div>
      </div>

      <Bar
        data={{
          labels: ["Baseline", ...computed.map((i) => i.title)],
          datasets: [
            {
              label: "Offset",
              data: [0, ...computed.map((i) => i.start)],
              backgroundColor: "transparent",
              stack: "stack1",
            },
            {
              label: "Impact",
              data: [BASE_SCORE, ...computed.map((i) => i.value)],
              backgroundColor: [COLORS.baseline, ...computed.map((i) => (i.value > 0 ? COLORS.positive : COLORS.negative))],
              borderRadius: 12,
              barThickness: 34,
              stack: "stack1",
            },
          ],
        }}
        options={{
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => {
                  const item = computed[ctx.dataIndex - 1];
                  if (!item) return `Baseline: ${BASE_SCORE}`;
                  return `${item.description} (${item.value > 0 ? "+" : ""}${item.value} pts)`;
                },
              },
            },
          },
          scales: {
            y: { display: false },
            x: {
              grid: { display: false },
              ticks: {
                color: "#8B8FA3",
                font: { size: 11 },
              },
            },
          },
        }}
      />

      {/* SIMULATION */}
      <div className="waterfall-sim">
        <div className="sim-header">
          <div>
            <strong>Simulate Improvement</strong>
            <span className="sim-sub">See how improving LDL would affect your score</span>
          </div>

          <span className="sim-delta">
            {ldl > -3 ? "+" : ""}
            {ldl + 3} pts
          </span>
        </div>

        <div className="sim-slider">
          <input type="range" min={-5} max={0} value={ldl} onChange={(e) => setLdl(Number(e.target.value))} />
        </div>

        <div className="sim-result">
          New projected score
          <strong>{finalScore}</strong>
        </div>
      </div>
    </motion.div>
  );
}
