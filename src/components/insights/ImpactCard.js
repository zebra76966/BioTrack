import { motion } from "framer-motion";
import { FaArrowDown, FaArrowUp, FaExclamationTriangle } from "react-icons/fa";
import "./ImpactCard.css";

export default function ImpactCard({ title, description, points, type }) {
  const isPositive = points > 0;

  return (
    <motion.div className={`impact-card bg-white ${isPositive ? "positive" : "negative"}`} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      {/* Icon */}
      <div className="impact-icon">{isPositive ? <FaArrowUp /> : <FaExclamationTriangle />}</div>

      {/* Content */}
      <div className="impact-content">
        <strong className="impact-title">{title}</strong>
        <p className="impact-desc">{description}</p>
      </div>

      {/* Points */}
      <div className="impact-points">
        {isPositive ? "+" : ""}
        {points}
        <span>pts</span>
      </div>
    </motion.div>
  );
}
