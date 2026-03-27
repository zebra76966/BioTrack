import { motion } from "framer-motion";
import ActionItem from "./ActionItem";
import "./ActionsCard.css";
import { FaStar } from "react-icons/fa";
import AiBadge from "../../utils/aibadge";

export default function ActionsCard({ actions }) {
  return (
    <motion.div className="insight-card actions-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
      <div className="actions-header d-flex gap-2 align-items-center">
        <FaStar className="confidence-icon" />
        <h6>Suggested Actions</h6>
        <div>
          <AiBadge text="AI Verified" /> {/* Using custom text */}
        </div>
      </div>
      <span className="actions-sub mb-4">Personalized recommendations to improve your score</span>

      <div className="actions-list">
        {actions.map((a, i) => (
          <ActionItem key={i} {...a} index={i} />
        ))}
      </div>
    </motion.div>
  );
}
