import { Table } from "react-bootstrap";
import { motion } from "framer-motion";
import { FaFlask, FaHeartbeat, FaUserMd, FaFileDownload, FaEye, FaFileAlt } from "react-icons/fa";
import "./historyTable.css";

/* Map record types → icons */
const typeIcon = {
  labs: <FaFlask />,
  medical: <FaUserMd />,
  recovery: <FaHeartbeat />,
  report: <FaFileAlt />,
};

export default function HistoryTable({ records = [], onSelect }) {
  return (
    <motion.div className="history-table-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
      <h6>Detailed Records</h6>

      <Table responsive borderless hover className="history-table">
        <thead>
          <tr className="history-table-row">
            <th>Type</th>
            <th>Title</th>
            <th>Date</th>
            <th>Provider</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>

        <tbody>
          {records.length === 0 ? (
            <tr>
              <td colSpan={6} className="empty-state">
                No records match your filters
              </td>
            </tr>
          ) : (
            records.map((r, i) => (
              <tr key={i} className="history-table-row clickable" onClick={() => onSelect?.(r)}>
                <td>
                  <span className={`type-icon ${r.type}`}>{typeIcon[r.type]}</span>
                </td>

                <td className="title">{r.title}</td>
                <td>{r.date}</td>
                <td>{r.provider}</td>

                <td>
                  <span className={`status-chip ${r.status}`}>{r.status === "completed" ? "Completed" : r.status === "results" ? "Results Available" : r.status}</span>
                </td>

                <td className="actions" onClick={(e) => e.stopPropagation()}>
                  <button title="View">
                    <FaEye />
                  </button>
                  <button title="Download">
                    <FaFileDownload />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </motion.div>
  );
}
