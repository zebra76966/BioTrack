import { Table } from "react-bootstrap";
import { motion } from "framer-motion";
import { FaWalking, FaDumbbell, FaHeartbeat, FaBed } from "react-icons/fa";
import "./activityLogTable.css";

/* Dummy activity log data */

export default function ActivityLogTable({ data = [] }) {
  if (!data.length) {
    return (
      <motion.div className="activity-log-card">
        <h6>Activity Log</h6>
        <p className="muted">No activity sessions recorded</p>
      </motion.div>
    );
  }

  const typeIcon = {
    Walking: <FaWalking />,
    Running: <FaWalking />,
    Cycling: <FaWalking />,
    "Strength Training": <FaDumbbell />,
    Workout: <FaDumbbell />,
  };

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
          </tr>
        </thead>

        <tbody>
          {data.map((s, i) => {
            const intensity = s.duration_minutes > 45 ? "High" : s.duration_minutes > 25 ? "Moderate" : "Light";

            return (
              <tr key={i}>
                <td className="activity-cell">
                  <span className="activity-icon">{typeIcon[s.activity_type] || <FaWalking />}</span>
                  <span className="activity-title">{s.activity_type}</span>
                </td>
                <td>{new Date(s.start_time).toLocaleDateString()}</td>
                <td>{s.duration_minutes} min</td>
                <td>
                  <span className={`intensity-chip ${intensity.toLowerCase()}`}>{intensity}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </motion.div>
  );
}
