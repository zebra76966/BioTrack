import { motion } from "framer-motion";
import { FaDroplet, FaWaveSquare, FaArrowTrendUp, FaCircleCheck, FaHeartPulse } from "react-icons/fa6"; // Added FaHeartbeat
import "./MetabolicHealthCard.css";

export default function MetabolicHealthCard({ data }) {
  if (!data) return null;

  const { avgGlucose, timeInRange, variability, estimatedA1c } = data.summary;

  const stats = [
    { label: "Avg Glucose", value: `${avgGlucose}`, unit: "mg/dL", icon: FaDroplet, color: "#ef4444" },
    { label: "Time in Range", value: `${timeInRange}`, unit: "%", icon: FaCircleCheck, color: "#22c55e" },
    { label: "Variability", value: `${variability}`, unit: "%", icon: FaWaveSquare, color: "#f59e0b" },
    { label: "Est. A11C", value: estimatedA1c, unit: "", icon: FaArrowTrendUp, color: "#3b82f6" },
  ];

  return (
    <motion.div className="metabolic-card-v3 mb-4" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        {/* Title with matching Heartbeat icon */}
        <div className="d-flex align-items-center">
          <FaHeartPulse className="me-2 text-primary-color" size={18} />
          <h5 className="section-title mb-0">Metabolic Stability</h5>
          <p className="text-muted smallest ms-3 mb-0">Live trends from Dexcom CGM</p>
        </div>
        <div className={`status-pill ${timeInRange > 80 ? "optimal" : "warning"}`}>{timeInRange > 80 ? "Optimal" : "Needs Attention"}</div>
      </div>

      <div className="stats-grid-v3">
        {stats.map((stat, i) => (
          <div className="stat-group-v3" key={i}>
            {/* Icon is now part of the vertical stack */}
            <div className="icon-v3 mb-1">
              <stat.icon size={20} color={stat.color} />
            </div>

            {/* Values are aligned directly underneath */}
            <div className="text-center">
              <div className="text-muted smallest fw-semibold mb-1">{stat.label}</div>
              <div className="d-flex align-items-baseline justify-content-center">
                <span className="fw-bold h2 mb-0 tracking-tight">{stat.value}</span>
                {stat.unit && <span className="ms-1 smallest text-muted fw-semibold">{stat.unit}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {variability > 36 && (
        <div className="insight-note-v3 mt-4">
          <span className="me-2">⚠️</span>
          <strong>High Variability:</strong> Frequent spikes detected. Correlate with meal logs to stabilize.
        </div>
      )}
    </motion.div>
  );
}
