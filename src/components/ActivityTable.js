import { FaWalking, FaRunning, FaBiking, FaSwimmer, FaSpa } from "react-icons/fa";
import { useActivityHistory } from "../hooks/useActivityHistory";
import "./activityTable.css";

/**
 * Activity type config
 * Later, when you add real activity segments,
 * just change activity_type from "daily" → "running", etc.
 */
const ACTIVITY_CONFIG = {
  daily: { label: "Daily Activity", icon: FaWalking },
  walking: { label: "Walking", icon: FaWalking },
  running: { label: "Running", icon: FaRunning },
  cycling: { label: "Cycling", icon: FaBiking },
  swimming: { label: "Swimming", icon: FaSwimmer },
  yoga: { label: "Yoga", icon: FaSpa },
};

export default function ActivityTable({ range, activeRange }) {
  const { data, loading } = useActivityHistory(range || 7);

  /* =====================
     LOADING STATE
  ===================== */
  if (loading) {
    return (
      <div className="activity-card border-0">
        <div className="activity-header">
          <h5>Activity History</h5>
        </div>
        <p className="text-muted px-3">Loading activity…</p>
      </div>
    );
  }

  /* =====================
     EMPTY STATE
  ===================== */
  if (!data || data.length === 0) {
    return (
      <div className="activity-card empty border-0">
        <h5>No activity data yet</h5>
        <p className="text-muted">Connect Google Fit to start tracking your daily activity.</p>
      </div>
    );
  }

  /* =====================
     TABLE
  ===================== */
  return (
    <div className="activity-card border-0">
      {/* Header */}
      <div className="activity-header">
        <h5>Activity History</h5>
        <span className="activity-filter">Last {activeRange} days</span>
      </div>

      {/* Table */}
      <div className="activity-table">
        <div className="activity-row header">
          <span>Category</span>
          <span>Date</span>
          <span>Steps</span>
          <span>Calories</span>
        </div>

        {data.map((d, i) => {
          // For now everything is daily summary
          // Later this becomes d.activity_type
          const activityKey = "daily";
          const cfg = ACTIVITY_CONFIG[activityKey];

          const Icon = cfg.icon;

          return (
            <div className="activity-row" key={i}>
              <span className="category">
                <span className="cat-icon">
                  <Icon />
                </span>
                {cfg.label}
              </span>

              <span>
                {new Date(d.date).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </span>

              <span>{d.steps.toLocaleString()}</span>

              <span className="calory">{Math.round(d.calories)} kcal</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
