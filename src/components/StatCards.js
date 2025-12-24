import { Card } from "react-bootstrap";
import { motion } from "framer-motion";
import { FaHeartbeat, FaFire, FaWalking } from "react-icons/fa";
import "./statCard.css";

const icons = {
  muscle: <FaHeartbeat />,
  steps: <FaWalking />,
  calories: <FaFire />,
};

export default function StatCard({ title, value, sub, icon }) {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="stat-card">
        {/* Header */}
        <div className="stat-header">
          <div className="stat-icon">{icons[icon]}</div>
          <span className="stat-title">{title}</span>
        </div>

        {/* Value */}
        <div className="stat-value-row">
          <span className="stat-value">{value}</span>
          {sub && <span className="stat-sub">{sub}</span>}
        </div>
      </div>
    </motion.div>
  );
}
