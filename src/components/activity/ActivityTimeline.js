import { motion } from "framer-motion";
import { FaWalking, FaDumbbell, FaBed, FaHeartbeat } from "react-icons/fa";
import { FaApple } from "react-icons/fa";
import { SiGooglefit } from "react-icons/si";

import "./activityTimeline.css";
import { getActivityConfig } from "../../utils/icons";

/* Dummy activity data */
const activityData = [
  {
    label: "Today",
    items: [
      {
        type: "walk",
        title: "Morning Walk",
        time: "7:30 AM",
        duration: "25 min",
        intensity: "Light",
        icon: <FaWalking />,
      },
      {
        type: "workout",
        title: "Strength Training",
        time: "10:45 AM",
        duration: "45 min",
        intensity: "High",
        icon: <FaDumbbell />,
      },
    ],
  },
  {
    label: "Yesterday",
    items: [
      {
        type: "recovery",
        title: "Recovery Session",
        time: "6:20 PM",
        duration: "30 min",
        intensity: "Moderate",
        icon: <FaHeartbeat />,
      },
      {
        type: "sleep",
        title: "Sleep",
        time: "11:10 PM",
        duration: "7h 40m",
        intensity: "Rest",
        icon: <FaBed />,
      },
    ],
  },
];

export default function ActivityTimeline({ data = [] }) {
  if (!data.length) {
    return (
      <motion.div className="activity-timeline-card">
        <h6>Activity Timeline</h6>
        <p className="muted">No workout sessions yet</p>
      </motion.div>
    );
  }

  return (
    <motion.div className="activity-timeline-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
      <h6>Activity Timeline</h6>

      <div className="activity-timeline noScroll">
        {data.map((group, i) => (
          <div key={i} className="activity-group">
            <span className="activity-date">{group.label}</span>

            {group.items.map((item, idx) => (
              <ActivityItem key={idx} {...item} />
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ---------------- Item ---------------- */

function ActivityItem({ title, time, duration, intensity, type, source }) {
  const iconMap = {
    walk: <FaWalking />,
    workout: <FaDumbbell />,
    recovery: <FaHeartbeat />,
    sleep: <FaBed />,
  };

  const config = getActivityConfig(title);

  return (
    <motion.div className={`activity-item ${type} `} whileHover={{ scale: 1.015 }} transition={{ type: "spring", stiffness: 300 }}>
      {/* <div className={`activity-icon ${intensity.toLowerCase()}`}>{config.icon}</div> */}

      <div className="activity-icon-wrapper">
        <div className={`activity-icon ${intensity.toLowerCase()}`}>{config.icon}</div>
        <div className="source-badge">{source === "apple_health" ? <FaApple /> : <SiGooglefit />}</div>
      </div>

      <div className="activity-info">
        <strong>{title}</strong>
        <span className="meta">
          {time} · {duration}
        </span>
      </div>

      <span className={`intensity ${intensity.toLowerCase()}`}>{intensity}</span>
    </motion.div>
  );
}
