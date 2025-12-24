import { Table } from "react-bootstrap";
import { motion } from "framer-motion";
import { FaWalking, FaDumbbell, FaHeartbeat, FaBed } from "react-icons/fa";
import "./activityLogTable.css";

/* Dummy activity log data */
const activityLogs = [
  {
    type: "walk",
    activity: "Morning Walk",
    date: "Apr 22, 2024",
    duration: "25 min",
    intensity: "Light",
    calories: 110,
  },
  {
    type: "workout",
    activity: "Strength Training",
    date: "Apr 22, 2024",
    duration: "45 min",
    intensity: "High",
    calories: 280,
  },
  {
    type: "recovery",
    activity: "Recovery Session",
    date: "Apr 21, 2024",
    duration: "30 min",
    intensity: "Moderate",
    calories: 90,
  },
  {
    type: "sleep",
    activity: "Sleep",
    date: "Apr 21, 2024",
    duration: "7h 40m",
    intensity: "Rest",
    calories: "--",
  },
];

const typeIcon = {
  walk: <FaWalking />,
  workout: <FaDumbbell />,
  recovery: <FaHeartbeat />,
  sleep: <FaBed />,
};

export default function ActivityLogTable() {
  return (
    <motion.div className="activity-log-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
      <h6>Activity Log</h6>

      <Table responsive borderless hover className="activity-log-table">
        <thead>
          <tr>
            <th>Activity</th>
            <th>Date</th>
            <th>Duration</th>
            <th>Intensity</th>
            <th>Calories</th>
          </tr>
        </thead>

        <tbody>
          {activityLogs.map((a, i) => (
            <tr key={i}>
              <td className="activity-cell">
                <span className={`activity-icon ${a.type}`}>{typeIcon[a.type]}</span>
                <span className="activity-title">{a.activity}</span>
              </td>
              <td>{a.date}</td>
              <td>{a.duration}</td>
              <td>
                <span className={`intensity-chip ${a.intensity.toLowerCase()}`}>{a.intensity}</span>
              </td>
              <td>{a.calories}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </motion.div>
  );
}
