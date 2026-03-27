import { useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import { motion } from "framer-motion";
import { useSimulation } from "../../utils/SimulationContext";
import { hormoneTrends } from "../../data/hormoneTrendsData";
import "./HormoneTrendsCard.css";

import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Filler } from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Filler);

const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

export default function HormoneTrendsCard() {
  const { simulatedMarkers } = useSimulation();
  const [active, setActive] = useState("all");

  const chartData = useMemo(() => {
    // Helper to inject simulation data into the "Jul" (last) index
    const getProcessedData = (key, h) => {
      const marker = simulatedMarkers.find((m) => m.id === key);
      const liveValue = marker ? marker.value : h.data[6];

      // If we are in "all" mode, we use normalized values (0-100) to keep scales consistent
      if (active === "all") {
        const normalizedLive = marker ? ((liveValue - marker.min) / (marker.max - marker.min)) * 100 : h.normalized[6];
        return [...h.normalized.slice(0, 6), normalizedLive];
      }

      // If in single mode, use actual units
      return [...h.data.slice(0, 6), liveValue];
    };

    // --- ALL MODE ---
    if (active === "all") {
      return {
        labels,
        datasets: Object.keys(hormoneTrends).map((key) => {
          const h = hormoneTrends[key];
          return {
            label: h.label,
            data: getProcessedData(key, h),
            borderColor: h.color,
            borderWidth: 2.5,
            tension: 0.45,
            fill: true,
            pointRadius: (ctx) => (ctx.dataIndex === 6 ? 6 : 0), // Highlight the live point
            pointHoverRadius: 6,
            pointBackgroundColor: "#fff",
            pointBorderColor: h.color,
            backgroundColor: (ctx) => {
              const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 260);
              gradient.addColorStop(0, h.gradient[0]);
              gradient.addColorStop(1, h.gradient[1]);
              return gradient;
            },
          };
        }),
      };
    }

    // --- SINGLE MODE ---
    const h = hormoneTrends[active];
    return {
      labels,
      datasets: [
        {
          label: h.label,
          data: getProcessedData(active, h),
          borderColor: h.color,
          borderWidth: 3,
          tension: 0.45,
          fill: true,
          pointRadius: (ctx) => (ctx.dataIndex === 6 ? 8 : 0),
          pointHoverRadius: 7,
          pointBackgroundColor: "#fff",
          pointBorderWidth: 3,
          pointBorderColor: h.color,
          backgroundColor: (ctx) => {
            const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 260);
            gradient.addColorStop(0, h.gradient[0]);
            gradient.addColorStop(1, h.gradient[1]);
            return gradient;
          },
        },
      ],
    };
  }, [active, simulatedMarkers]);

  return (
    <motion.div className="hormone-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      {/* Header */}
      <div className="hormone-header">
        <div>
          <h6>Hormone Trends</h6>
          <span className="muted">{active === "all" ? "All Hormones Overview" : `${hormoneTrends[active].label} · ${hormoneTrends[active].unit}`}</span>
        </div>

        <div className="hormone-toggle">
          <button className={active === "all" ? "active" : ""} onClick={() => setActive("all")}>
            All
          </button>

          {Object.keys(hormoneTrends).map((k) => (
            <button key={k} className={active === k ? "active" : ""} onClick={() => setActive(k)}>
              {hormoneTrends[k].label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="hormone-chart">
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
              mode: "nearest",
              intersect: false,
            },
            plugins: {
              legend: { display: false },
              tooltip: {
                enabled: true,
                backgroundColor: "#ffffff",
                titleColor: "#111",
                bodyColor: "#7c4dff",
                borderColor: "#e6e6f0",
                borderWidth: 1,
                padding: 10,
                displayColors: false,
                callbacks: {
                  label: (ctx) => {
                    const val = ctx.raw;
                    const suffix = active === "all" ? "%" : ` ${hormoneTrends[active].unit}`;
                    return `${ctx.dataset.label}: ${val}${suffix}`;
                  },
                },
              },
            },
            scales: {
              y: {
                grid: { display: false },
                ticks: { display: false },
              },
              x: {
                grid: { display: false },
                ticks: {
                  color: "#8b8fa3",
                  font: { size: 11 },
                },
              },
            },
          }}
        />
      </div>
    </motion.div>
  );
}
