import { Card } from "react-bootstrap";
import { activities } from "../data/dummyData";
import { FaRunning, FaBiking, FaSwimmer, FaSpa } from "react-icons/fa";
import "./activityTable.css";

const icons = {
  Running: <FaRunning />,
  Cycling: <FaBiking />,
  Swimming: <FaSwimmer />,
  Yoga: <FaSpa />,
};

export default function ActivityTable() {
  return (
    <div className="activity-card border-0">
      {/* Header */}
      <div className="activity-header">
        <h5>Medical Checkup History</h5>
        <span className="activity-filter">Calory Burned ▾</span>
      </div>

      {/* Table */}
      <div className="activity-table">
        <div className="activity-row header">
          <span>Category</span>
          <span>Date</span>
          <span>Duration</span>
          <span>Calory Burned</span>
        </div>

        {activities.map((a, i) => (
          <div className="activity-row" key={i}>
            <span className="category">
              <span className="cat-icon">{icons[a.type]}</span>
              {a.type}
            </span>
            <span>{a.date}</span>
            <span>{a.duration}</span>
            <span className="calory">{a.calories} Calory Burned</span>
          </div>
        ))}
      </div>
    </div>
  );
}
