import { motion } from "framer-motion";
import { FaDumbbell, FaAppleAlt, FaStethoscope, FaMoon } from "react-icons/fa";

const ICONS = {
  training: <FaDumbbell />,
  nutrition: <FaAppleAlt />,
  medical: <FaStethoscope />,
  recovery: <FaMoon />,
};

export default function ActionItem({ title, reason, type = "recovery", index }) {
  return (
    <motion.div className="action-item" whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
      <div className="action-icon">{ICONS[type]}</div>

      <div className="action-content">
        <strong className="action-title">{title}</strong>
        <p className="action-reason">{reason}</p>
      </div>

      <span className="action-priority">#{index + 1}</span>
    </motion.div>
  );
}
