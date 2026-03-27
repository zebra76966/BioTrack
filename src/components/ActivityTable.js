import { FaApple } from "react-icons/fa";
import { SiGooglefit } from "react-icons/si";
import { getActivityConfig } from "../utils/icons";
import "./activityTable.css";

export default function ActivityTable({ data, loading, activeRange }) {
  if (loading) return <div className="p-4 text-muted">Loading...</div>;
  if (!data || data.length === 0) return <div className="p-4 text-muted">No sessions found.</div>;

  // Reverse so newest is on top
  const displayData = [...data].reverse();

  return (
    <div className="activity-card border-0">
      <div className="activity-header">
        <h5>Activity History</h5>
        <span className="activity-filter">Last {activeRange} days</span>
      </div>

      <div className="activity-table noScroll">
        <div className="activity-row header">
          <span>Activity</span>
          <span>Date</span>
          <span>Duration</span>
          <span>Intensity</span> {/* Added intensity column */}
        </div>

        {displayData.map((s, i) => {
          const config = getActivityConfig(s.activity_type);
          const intensity = s.duration_minutes > 45 ? "High" : s.duration_minutes > 25 ? "Moderate" : "Light";
          const source = s.source || "google_fit";

          return (
            <div className="activity-row" key={i}>
              <div className="activity-cell">
                <div className="activity-icon-wrapper">
                  <div className={`activity-icon ${intensity.toLowerCase()}`}>{config.icon}</div>
                  <div className="source-badge">{source.includes("apple") ? <FaApple /> : <SiGooglefit />}</div>
                </div>
                <span className="activity-title">{s.activity_type}</span>
              </div>

              <span className="text-muted">
                {new Date(s.start_time).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </span>

              <span className="fw-bold text-muted">{s.duration_minutes} min</span>

              {/* Added the Intensity Chip like the Activity Page */}
              <span>
                <span className={`intensity-chip ${intensity.toLowerCase()}`}>{intensity}</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
