import { motion } from "framer-motion";
import { FaClock, FaGripLines, FaHeartbeat, FaFlask } from "react-icons/fa";
import "./todayTimeline.css";

const todayEvents = [
  {
    time: "09:00",
    title: "Morning Walk",
    type: "recovery",
    icon: <FaHeartbeat />,
  },
  {
    time: "10:20",
    title: "Dental Checkup",
    type: "medical",
    icon: <FaFlask />,
  },
  {
    time: "12:10",
    title: "Orthopedic Review",
    type: "medical",
    icon: <FaFlask />,
  },
  {
    time: "18:00",
    title: "Recovery Session",
    type: "recovery",
    icon: <FaHeartbeat />,
  },
];

export default function TodayTimeline() {
  return (
    <motion.div className="timeline-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
      <h6>Today</h6>

      <div className="timeline">
        {todayEvents.map((e, i) => (
          <TimelineItem key={i} {...e} />
        ))}
      </div>
    </motion.div>
  );
}

function TimelineItem({ time, title, type, icon }) {
  return (
    <motion.div className={`timeline-item ${type}`}>
      {/* Timeline spine */}
      <div className="timeline-left">
        <div className="timeline-dot" />
        <div className="timeline-line" />
      </div>

      {/* Content */}
      <div className="timeline-content">
        <div className="timeline-header">
          <span className="time">
            <FaClock /> {time}
          </span>

          <span className="drag-hint">
            <FaGripLines /> Drag
          </span>
        </div>

        <div className="timeline-title">
          <span className="type-icon">{icon}</span>
          <strong>{title}</strong>
        </div>

        <span className="timeline-sub">Drag vertically to reschedule</span>
      </div>
    </motion.div>
  );
}
