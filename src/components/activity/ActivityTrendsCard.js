import { useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import { motion } from "framer-motion";
import { FaWalking, FaFire, FaClock, FaChartLine } from "react-icons/fa";
import "./activityTrendsCard.css";

import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Filler } from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Filler);

const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/* Dummy trend data */
const trends = {
  steps: {
    label: "Steps",
    unit: "steps",
    icon: <FaWalking />,
    color: "#27ae60",
    gradient: ["rgba(39,174,96,0.35)", "rgba(39,174,96,0.05)"],
    data: [6200, 7100, 6800, 7400, 8200, 9000, 8420],
  },
  calories: {
    label: "Calories",
    unit: "kcal",
    icon: <FaFire />,
    color: "#eb5757",
    gradient: ["rgba(235,87,87,0.35)", "rgba(235,87,87,0.05)"],
    data: [420, 480, 450, 500, 520, 610, 540],
  },
  minutes: {
    label: "Active Minutes",
    unit: "min",
    icon: <FaClock />,
    color: "#7c4dff",
    gradient: ["rgba(124,77,255,0.35)", "rgba(124,77,255,0.05)"],
    data: [42, 55, 48, 60, 65, 80, 74],
  },
};

export default function ActivityTrendsCard() {
  const [active, setActive] = useState("calories");

  const getStats = (data) => {
    const avg = Math.round(data.reduce((a, b) => a + b, 0) / data.length);
    const max = Math.max(...data);
    const maxIndex = data.indexOf(max);
    const trend = data[data.length - 1] - data[0];

    return {
      avg,
      max,
      bestDay: labels[maxIndex],
      trend,
      trendPct: Math.round((trend / data[0]) * 100),
    };
  };

  const chartData = useMemo(() => {
    const t = trends[active];

    return {
      labels,
      datasets: [
        {
          data: t.data,
          borderColor: t.color,
          borderWidth: 3,
          tension: 0.45,
          fill: true,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointBackgroundColor: "#fff",
          pointBorderColor: t.color,
          backgroundColor: (ctx) => {
            const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 260);
            g.addColorStop(0, t.gradient[0]);
            g.addColorStop(1, t.gradient[1]);
            return g;
          },
        },
      ],
    };
  }, [active]);

  const stats = getStats(trends[active].data);

  return (
    <motion.div className="activity-trends-card h-100" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
      {/* Header */}
      <div className="activity-trends-header">
        <div>
          <h6>Activity Trends</h6>
          <span className="muted">
            {trends[active].label} · {trends[active].unit}
          </span>
        </div>

        <div className="activity-trends-toggle">
          {Object.keys(trends).map((k) => (
            <button key={k} className={active === k ? "active" : ""} onClick={() => setActive(k)}>
              {trends[k].icon}
              {trends[k].label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="activity-trends-chart ">
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
                backgroundColor: "#ffffff",
                titleColor: "#111",
                bodyColor: trends[active].color,
                borderColor: "#e6e6f0",
                borderWidth: 1,
                padding: 10,
                displayColors: false,
                callbacks: {
                  label: (ctx) => `${ctx.formattedValue} ${trends[active].unit}`,
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

      {/* Info Chips */}
      <div className="activity-meta-chips ">
        <div className="meta-chip">
          <span className="meta-icon">
            <FaChartLine />
          </span>
          <div className="meta-text">
            <span className="meta-label">Weekly avg</span>
            <strong>
              {stats.avg} {trends[active].unit}
            </strong>
          </div>
        </div>

        <div className="meta-chip">
          <span className="meta-icon">{trends[active].icon}</span>
          <div className="meta-text">
            <span className="meta-label">Best day</span>
            <strong>{stats.bestDay}</strong>
          </div>
        </div>

        <div className="meta-chip">
          <span className="meta-icon">{stats.trend >= 0 ? "↑" : "↓"}</span>
          <div className="meta-text">
            <span className="meta-label">Trend</span>
            <strong>{Math.abs(stats.trendPct)}%</strong>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
