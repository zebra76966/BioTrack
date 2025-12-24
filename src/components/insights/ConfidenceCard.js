import { motion } from "framer-motion";
import { FaShieldAlt, FaDatabase, FaClock, FaCheckCircle } from "react-icons/fa";
import "./ConfidenceCard.css";

export default function ConfidenceCard({ confidence }) {
  const percent = Math.round(confidence.value * 100);

  return (
    <motion.div className="insight-card confidence-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      {/* Header */}
      <div className="confidence-header">
        <div className="confidence-title">
          <FaShieldAlt className="confidence-icon" />
          <h6>Confidence</h6>
        </div>

        <span className="confidence-label">{confidence.label}</span>
      </div>

      {/* Ring */}
      <div className="confidence-ring-wrap">
        <svg className="confidence-ring" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="52" className="ring-bg" />
          <motion.circle
            cx="60"
            cy="60"
            r="52"
            className="ring-fill"
            strokeDasharray={2 * Math.PI * 52}
            strokeDashoffset={2 * Math.PI * 52 * (1 - confidence.value)}
            initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
            animate={{
              strokeDashoffset: 2 * Math.PI * 52 * (1 - confidence.value),
            }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>

        <div className="confidence-percent">{percent}%</div>
      </div>

      {/* Explanation */}
      <p className="confidence-reason">{confidence.reason}</p>

      {/* Info Chips */}
      <div className="confidence-chips">
        <ConfidenceChip icon={<FaDatabase />} label="Data sources" value="Labs + Wearables" />
        <ConfidenceChip icon={<FaClock />} label="Last updated" value="Today" />
        <ConfidenceChip icon={<FaCheckCircle />} label="Validation" value="Clinician reviewed" />
      </div>
    </motion.div>
  );
}

function ConfidenceChip({ icon, label, value }) {
  return (
    <motion.div className="confidence-chip" whileHover={{ y: -2 }}>
      <span className="chip-icon">{icon}</span>
      <div>
        <span className="chip-label">{label}</span>
        <strong className="chip-value">{value}</strong>
      </div>
    </motion.div>
  );
}
