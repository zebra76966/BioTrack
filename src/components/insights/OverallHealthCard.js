import { motion } from "framer-motion";
import CountUp from "react-countup";
import { FaHeartbeat, FaArrowUp, FaShieldAlt, FaClock } from "react-icons/fa";
import { useSimulation } from "../../utils/SimulationContext"; // Use your context path
import { useMemo } from "react";
import "./OverallHealthCard.css";
import AiBadge from "../../utils/aibadge";

export default function OverallHealthCard({ todaySteps = 0 }) {
  const { simulatedMarkers } = useSimulation();

  const dynamicScore = useMemo(() => {
    // 1. Lab Score (40%): Higher TRT and lower LDL/HbA1c is better
    const trt = simulatedMarkers.find((m) => m.id === "trt").value;
    const ldl = simulatedMarkers.find((m) => m.id === "ldl").value;
    const labScore = trt / 10 + (200 - ldl) / 2;

    // 2. Activity Score (60%): Based on steps (goal 10k)
    const activityScore = Math.min(100, (todaySteps / 10000) * 100);

    return Math.round(labScore * 0.4 + activityScore * 0.6);
  }, [simulatedMarkers, todaySteps]);

  const status = dynamicScore >= 80 ? "Excellent" : dynamicScore >= 65 ? "Good" : "Needs Attention";
  const statusColor = dynamicScore >= 80 ? "green" : dynamicScore >= 65 ? "purple" : "orange";

  return (
    <motion.div className="insight-card overall-health-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
      <div className="overall-header">
        <div className="overall-title">
          <FaHeartbeat className="overall-icon" />
          <h6>Overall Health</h6>
        </div>
        <span className={`overall-status ${statusColor}`}>{status}</span>
      </div>

      <div className="overall-score">
        <CountUp end={dynamicScore} duration={1.2} preserveValue={true} />
        <span className="score-unit">/ 100</span>
      </div>

      <p className="overall-sub">Live health index combining labs and daily movement patterns.</p>

      <div className="overall-chips">
        <InfoChip icon={<FaArrowUp />} label="Trend" value="Live" />
        <InfoChip icon={<FaShieldAlt />} label="Stability" value={dynamicScore > 70 ? "High" : "Variable"} />
        <InfoChip icon={<FaClock />} label="Updated" value="Just Now" />
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
