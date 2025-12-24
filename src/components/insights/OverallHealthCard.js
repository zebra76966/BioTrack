import { motion } from "framer-motion";
import CountUp from "react-countup";
import { FaHeartbeat, FaArrowUp, FaShieldAlt, FaClock } from "react-icons/fa";
import "./OverallHealthCard.css";

export default function OverallHealthCard({ score }) {
  const status = score >= 80 ? "Excellent" : score >= 65 ? "Good" : "Needs Attention";

  const statusColor = score >= 80 ? "green" : score >= 65 ? "purple" : "orange";

  return (
    <motion.div className="insight-card overall-health-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
      {/* HEADER */}
      <div className="overall-header">
        <div className="overall-title">
          <FaHeartbeat className="overall-icon" />
          <h6>Overall Health</h6>
        </div>

        <span className={`overall-status ${statusColor}`}>{status}</span>
      </div>

      {/* SCORE */}
      <div className="overall-score">
        <CountUp end={score} duration={1.2} />
        <span className="score-unit">/ 100</span>
      </div>

      <p className="overall-sub">Combined score based on labs, recovery, and activity patterns</p>

      {/* INFO CHIPS */}
      <div className="overall-chips">
        <InfoChip icon={<FaArrowUp />} label="Trend" value="+4 pts" />
        <InfoChip icon={<FaShieldAlt />} label="Stability" value="Stable" />
        <InfoChip icon={<FaClock />} label="Updated" value="Today" />
      </div>
    </motion.div>
  );
}

function InfoChip({ icon, label, value }) {
  return (
    <motion.div className="overall-chip" whileHover={{ y: -2 }}>
      <span className="chip-icon">{icon}</span>
      <div>
        <span className="chip-label">{label}</span>
        <strong className="chip-value">{value}</strong>
      </div>
    </motion.div>
  );
}
