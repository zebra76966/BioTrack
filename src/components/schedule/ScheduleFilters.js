import "./scheduleFilters.css";

const filters = ["All", "Medical", "Labs", "Recovery"];

export default function ScheduleFilters({ active, setActive }) {
  return (
    <div className="schedule-filters">
      {filters.map((f) => (
        <button key={f} className={active === f ? "active" : ""} onClick={() => setActive(f)}>
          {f}
        </button>
      ))}
    </div>
  );
}
