import { useState, useRef, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { FaHeart, FaWaveSquare, FaBolt, FaCheckCircle, FaFire, FaDumbbell, FaArrowUp, FaShieldAlt, FaFlask } from "react-icons/fa";

import CountUp from "react-countup";
import { vitalStats } from "../data/vitalStats";

import "./vitalCard.css";

import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale);

const labels = ["9:10", "9:11", "9:12", "9:13", "9:14", "9:15"];

const MODES = [
  { key: "heart", label: "Heart", icon: <FaHeart /> },
  { key: "muscle", label: "Muscle", icon: <FaDumbbell /> },
  { key: "testosterone", label: "Testosterone", icon: <FaFlask /> },
];

export default function VitalStatCard() {
  const [mode, setMode] = useState("heart");
  const [open, setOpen] = useState(false);
  const [showInsights, setShowInsights] = useState(false);

  const ref = useRef(null);

  const data = vitalStats[mode];

  /* Close dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const infoIcons = {
    heart: <FaHeart />,
    wave: <FaWaveSquare />,
    bolt: <FaBolt />,
    check: <FaCheckCircle />,
    fire: <FaFire />,
    dumbbell: <FaDumbbell />,
    arrow: <FaArrowUp />,
    shield: <FaShieldAlt />,
    flask: <FaFlask />,
  };

  return (
    <motion.div className={`vital-card full-height ${mode}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      {/* Header */}
      <div className="vital-header">
        <div className="vital-chart-header">
          <div className="d-flex gap-3 align-items-center">
            <span className="info-icon"> {MODES.find((m) => m.key === mode).icon}</span>

            <span className="">{data.chartLabel}</span>

            <span className={`trend ${data.trend} `}>
              {data.trend === "up" ? "▲" : "▼"} {data.trendValue}
            </span>
          </div>
        </div>

        <div className="vital-switch" ref={ref}>
          <button className="menu-btn" onClick={() => setOpen((p) => !p)}>
            <HiOutlineMenuAlt3 />
          </button>

          <AnimatePresence>
            {open && (
              <motion.div className="vital-menu" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
                {MODES.map((m) => (
                  <div
                    key={m.key}
                    className="menu-item"
                    onClick={() => {
                      setMode(m.key);
                      setOpen(false);
                    }}
                  >
                    <span className="menu-icon">{m.icon}</span>
                    {m.label}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Center Visual */}
      <div className="vital-visual">
        <div className="ring" />
        <div className="ring ring-2" />

        <AnimatePresence mode="wait">
          <motion.img
            key={mode}
            src={data.image}
            alt={mode}
            className={mode === "heart" ? "pulse-heart" : ""}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}
          />
        </AnimatePresence>
      </div>

      {/* Stats */}
      <div className="vital-stats">
        <Stat label="Average" value={data.stats.avg} unit={data.unit} />
        <Stat label="Minimum" value={data.stats.min} unit={data.unit} />
        <Stat label="Maximum" value={data.stats.max} unit={data.unit} />
      </div>

      <button className="insights-toggle" onClick={() => setShowInsights((p) => !p)}>
        {showInsights ? "Hide Insights" : "View Insights"}
      </button>

      {/* Info Chips */}
      <div className="vital-info">
        {data.info.map((item, i) => (
          <div className="info-chip" key={i}>
            <span className="info-icon">{infoIcons[item.icon]}</span>
            <div>
              <span className="info-label">{item.label}</span>
              <strong className="info-value ms-2">
                {item.value}
                {item.unit && <span>{item.unit}</span>}
              </strong>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showInsights && (
          <motion.div className="insights-drawer" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
            <p>
              {mode === "heart" && "Your heart rate shows strong recovery with healthy variability."}

              {mode === "muscle" && "Muscle load is balanced. Recovery status remains optimal."}

              {mode === "testosterone" && "Hormone levels are stable and trending upward."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chart */}
      <div className="vital-chart-header">
        <span>{data.chartLabel}</span>
        <span className="muted">Real Time ▾</span>
      </div>

      <Bar
        data={{
          labels,
          datasets: [
            {
              data: data.chart,
              backgroundColor: data.color,
              borderRadius: 8,
              barThickness: 6,
            },
          ],
        }}
        options={{
          plugins: { legend: { display: false } },
          scales: {
            y: { display: false },
            x: {
              ticks: { color: "#8b8fa3", font: { size: 11 } },
              grid: { display: false },
            },
          },
        }}
      />
    </motion.div>
  );
}

function Stat({ label, value, unit }) {
  return (
    <div className="vital-stat">
      <span className="label">{label}</span>
      <strong>
        <CountUp end={value} duration={0.8} />
        <span>{unit}</span>
      </strong>
    </div>
  );
}
