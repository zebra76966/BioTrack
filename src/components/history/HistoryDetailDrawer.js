import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaFileDownload, FaUserMd, FaCalendarAlt, FaFlask, FaHeartbeat } from "react-icons/fa";
import { Line } from "react-chartjs-2";
import "./historyDetailDrawer.css";

import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Filler, Tooltip } from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Filler, Tooltip);

/* Small contextual trend data */
const miniTrend = {
  labels: ["Jan", "Feb", "Mar", "Apr"],
  datasets: [
    {
      data: [62, 68, 65, 72],
      fill: true,
      borderColor: "#7c4dff",
      tension: 0.4,
      pointRadius: 0,
      backgroundColor: (ctx) => {
        const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 120);
        g.addColorStop(0, "rgba(124,77,255,0.25)");
        g.addColorStop(1, "rgba(124,77,255,0.05)");
        return g;
      },
    },
  ],
};

const typeIcon = {
  labs: <FaFlask />,
  medical: <FaUserMd />,
  recovery: <FaHeartbeat />,
};

export default function HistoryDetailDrawer({ record, onClose }) {
  return (
    <AnimatePresence>
      {record && (
        <>
          {/* Backdrop */}
          <motion.div className="drawer-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />

          {/* Drawer */}
          <motion.div className="drawer" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 260, damping: 28 }}>
            {/* Header */}
            <div className="drawer-header">
              <div className="drawer-title">
                <span className={`drawer-icon ${record.type}`}>{typeIcon[record.type]}</span>
                <div>
                  <strong>{record.title}</strong>
                  <span className="muted">{record.provider}</span>
                </div>
              </div>

              <button onClick={onClose}>
                <FaTimes />
              </button>
            </div>

            {/* Meta chips */}
            <div className="drawer-meta-chips">
              <span>
                <FaCalendarAlt /> {record.date}
              </span>
              <span className={`status ${record.status}`}>{record.status === "results" ? "Results Available" : "Completed"}</span>
            </div>

            {/* Mini chart */}
            <div className="drawer-chart">
              <h6>Related Trend</h6>
              <div className="mini-chart">
                <Line
                  data={miniTrend}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: { enabled: false },
                    },
                    scales: {
                      x: { display: false },
                      y: { display: false },
                    },
                  }}
                />
              </div>
              <span className="muted">Contextual trend related to this record</span>
            </div>

            {/* Notes */}
            <div className="drawer-section">
              <h6>Notes</h6>
              <p className="muted">No additional clinical notes were attached to this record.</p>
            </div>

            {/* Actions */}
            <div className="drawer-actions">
              <button className="primary-btn">
                <FaFileDownload /> Download Report
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
