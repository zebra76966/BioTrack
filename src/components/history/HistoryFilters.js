import { FaSearch } from "react-icons/fa";
import "./historyFilters.css";

const FILTERS = ["All", "Appointments", "Labs", "Recovery", "Reports"];

export default function HistoryFilters({ active, setActive, query, setQuery }) {
  return (
    <div className="history-filters">
      {/* Chips */}
      <div className="filter-chips">
        {FILTERS.map((f) => (
          <button key={f} className={active === f ? "active" : ""} onClick={() => setActive(f)}>
            {f}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="filter-search">
        <FaSearch />
        <input type="text" placeholder="Search records" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
    </div>
  );
}
