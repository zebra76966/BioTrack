import { motion } from "framer-motion";
import { FaBrain } from "react-icons/fa6"; // A clean brain/sync icon
import "./aibadge.css";

export default function AiBadge({ text = "AI Insight" }) {
  // Animation for the subtle pulse effect
  const pulseAnimation = {
    scale: [1, 1.05, 1],
    opacity: [0.8, 1, 0.8],
    transition: {
      duration: 2,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "loop",
    },
  };

  return (
    <motion.div
      className="ai-badge-v2"
      animate={pulseAnimation} // Apply the pulse to the whole badge
    >
      {/* Animated Dot */}
      <motion.span
        className="ai-dot"
        animate={{
          backgroundColor: ["#a78bfa", "#c084fc", "#a78bfa"], // Soft purple to pinkish
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
      />

      {/* Icon */}
      <FaBrain className="ai-brain-icon me-1" size={12} />

      {/* Text */}
      <span className="ai-badge-text">{text}</span>
    </motion.div>
  );
}
