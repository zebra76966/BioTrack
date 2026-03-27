import { useState, useRef, useEffect, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { FaHeart, FaWaveSquare, FaBolt, FaCheckCircle, FaFire, FaDumbbell, FaArrowUp, FaShieldAlt, FaFlask } from "react-icons/fa";
import CountUp from "react-countup";
import { useSimulation } from "../utils/SimulationContext";
import "./vitalCard.css";

import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip } from "chart.js";
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

const labels = ["9:10", "9:11", "9:12", "9:13", "9:14", "9:15"];

const MODES = [
  { key: "heart", label: "Heart", icon: <FaHeart /> },
  { key: "muscle", label: "Muscle", icon: <FaDumbbell /> },
  { key: "testosterone", label: "Testosterone", icon: <FaFlask /> },
];

export default function VitalStatCard({ todaySteps, todayCalories }) {
  const { simulatedMarkers } = useSimulation();
  const [mode, setMode] = useState("heart");
  const [open, setOpen] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const ref = useRef(null);

  const dynamicData = useMemo(() => {
    const ldl = simulatedMarkers.find((m) => m.id === "ldl").value;
    const hdl = simulatedMarkers.find((m) => m.id === "hdl").value;
    const trt = simulatedMarkers.find((m) => m.id === "trt").value;
    const hba1c = simulatedMarkers.find((m) => m.id === "hba1c").value;

    const baseStats = {
      heart: {
        chartLabel: "Heart Rate",
        unit: "BPM",
        color: "#8e73ff",
        // Using a reliable public 3D heart icon for now
        image: "/images/heart.png",
        stats: {
          avg: Math.round(72 - trt / 200 - todaySteps / 5000),
          min: Math.round(48 - todaySteps / 10000),
          max: Math.round(118 + todayCalories / 100),
        },
        chart: [65, 72, 68, 74, 70, 62], // Actual chart data
        trend: ldl > 130 ? "up" : "down",
        trendValue: "6%",
        info: [
          { icon: "wave", label: "Resting HR", value: 62 },
          { icon: "shield", label: "HRV", value: Math.round(45 + trt / 50), unit: "ms" },
          { icon: "bolt", label: "Intensity", value: todayCalories > 500 ? "High" : "Moderate" },
        ],
      },
      muscle: {
        chartLabel: "Muscle Recovery",
        unit: "%",
        color: "#00d26a",
        image: "images/muscle.png",
        stats: {
          avg: Math.min(100, Math.round(70 + trt / 20)),
          min: 40,
          max: 98,
        },
        chart: [85, 88, 92, 90, 95, 98], // Chart data
        trend: "up",
        trendValue: "12%",
        info: [
          { icon: "dumbbell", label: "Load", value: todaySteps > 10000 ? "Heavy" : "Light" },
          { icon: "fire", label: "Burn", value: todayCalories, unit: "kcal" },
        ],
      },
      testosterone: {
        chartLabel: "Hormonal Balance",
        unit: "ng/dL",
        color: "#d4af37",
        image: "images/trt.png",
        stats: {
          avg: Math.round(trt),
          min: Math.round(trt * 0.8),
          max: Math.round(trt * 1.1),
        },
        chart: [trt - 20, trt - 10, trt, trt + 5, trt - 5, trt], // Reacts to slider!
        trend: trt > 600 ? "up" : "down",
        trendValue: "Stable",
        info: [
          { icon: "flask", label: "Free T", value: (trt * 0.02).toFixed(1), unit: "pg/mL" },
          { icon: "check", label: "Glucose (A1c)", value: hba1c, unit: "%" },
          { icon: "shield", label: "Lipid Ratio", value: (ldl / hdl).toFixed(2) },
        ],
      },
    };

    return baseStats[mode];
  }, [mode, simulatedMarkers, todaySteps, todayCalories]);

  const data = dynamicData;

  // Icons Mapping
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
            <span className="info-icon">{MODES.find((m) => m.key === mode).icon}</span>
            <span className="fw-bold">{data.chartLabel}</span>
            <span className={`trend ${data.trend}`}>
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
                    <span className="menu-icon">{m.icon}</span> {m.label}
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
            // style={{ width: "120px", height: "120px", objectFit: "contain" }}
            className={mode === "heart" ? "pulse-heart" : ""}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          />
        </AnimatePresence>
      </div>

      {/* Stats Section */}
      <div className="vital-stats">
        <Stat label="Average" value={data.stats.avg} unit={data.unit} />
        <Stat label="Minimum" value={data.stats.min} unit={data.unit} />
        <Stat label="Maximum" value={data.stats.max} unit={data.unit} />
      </div>

      <button className="insights-toggle" onClick={() => setShowInsights(!showInsights)}>
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
                {item.unit}
              </strong>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="vital-chart-container mt-3">
        <div className="d-flex justify-content-between align-items-center mb-2 px-2">
          <span className="small text-muted">{data.chartLabel} Activity</span>
          <span className="small text-muted">Real Time</span>
        </div>
        <Bar
          data={{
            labels,
            datasets: [
              {
                data: data.chart, // This now exists!
                backgroundColor: data.color,
                borderRadius: 4,
                barThickness: 8,
              },
            ],
          }}
          options={{
            // maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { display: false, beginAtZero: false },
              x: { ticks: { color: "#8b8fa3", font: { size: 10 } }, grid: { display: false } },
            },
          }}
          // height={80}
        />
        {/* ----------------------------------------- */}
      </div>
    </motion.div>
  );
}

function Stat({ label, value, unit }) {
  return (
    <div className="vital-stat">
      <span className="label small text-muted">{label}</span>
      <div className="d-flex align-items-baseline gap-1">
        <h4 className="mb-0 fw-bold">
          <CountUp end={value} duration={1} />
        </h4>
        <span className="small text-muted">{unit}</span>
      </div>
    </div>
  );
}
