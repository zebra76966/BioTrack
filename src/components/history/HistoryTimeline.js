import { motion } from "framer-motion";
import { FaFlask, FaHeartbeat, FaUserMd, FaCheckCircle, FaFileAlt } from "react-icons/fa";
import "./historyTimeline.css";

/* Dummy history data */
const history = [
  {
    date: "Apr 18, 2024",
    items: [
      {
        title: "Hormone Panel",
        provider: "HealthPlus Diagnostics",
        type: "labs",
        status: "results",
        icon: <FaFlask />,
      },
      {
        title: "Recovery Session",
        provider: "Coach Alex",
        type: "recovery",
        status: "completed",
        icon: <FaHeartbeat />,
      },
    ],
  },
  {
    date: "Apr 10, 2024",
    items: [
      {
        title: "Dental Checkup",
        provider: "City Dental Clinic",
        type: "medical",
        status: "completed",
        icon: <FaUserMd />,
      },
    ],
  },
  {
    date: "Apr 03, 2024",
    items: [
      {
        title: "Lab Report Uploaded",
        provider: "HealthPlus Diagnostics",
        type: "report",
        status: "completed",
        icon: <FaFileAlt />,
      },
    ],
  },
];

export default function HistoryTimeline() {
  return (
    <motion.div className="history-timeline-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
      <h6>Timeline</h6>

      <div className="history-timeline">
        {history.map((group, i) => (
          <div key={i} className="history-group">
            <span className="history-date">{group.date}</span>

            {group.items.map((item, idx) => (
              <TimelineItem key={idx} {...item} />
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ---------------- Item ---------------- */

function TimelineItem({ title, provider, status, icon, type }) {
  return (
    <div className={`history-item ${type}`}>
      <div className="history-left">
        <div className="history-dot">{icon}</div>
        <div className="history-line" />
      </div>

      <div className="history-content">
        <strong>{title}</strong>
        <span className="provider">{provider}</span>

        <div className="history-meta">
          <FaCheckCircle className="status-icon" />
          <span className={`status ${status}`}>{status === "results" ? "Results available" : "Completed"}</span>
        </div>
      </div>
    </div>
  );
}
