import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CalendarModal from "../CalendarModal";
import "./calendarOverview.css";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Dummy event map (reuse later from shared data)
const eventDays = [3, 7, 12, 15, 19, 22, 28];

export default function CalendarOverview() {
  const [open, setOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // current month

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];

  // Empty leading cells
  for (let i = 0; i < firstDayOfMonth; i++) {
    cells.push(null);
  }

  // Actual days
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(d);
  }

  return (
    <>
      <motion.div className="calendar-overview-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="calendar-overview-header">
          <h6>
            {today.toLocaleString("default", { month: "long" })} {year}
          </h6>
          <button className="view-month-btn" onClick={() => setOpen(true)}>
            View month
          </button>
        </div>

        {/* Weekdays */}
        <div className="calendar-weekdays">
          {DAYS.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>

        {/* Grid */}
        <div className="calendar-grid">
          {cells.map((day, i) =>
            day ? (
              <motion.button
                key={i}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`calendar-cell
                  ${eventDays.includes(day) ? "has-event" : ""}
                  ${day === today.getDate() ? "today" : ""}
                `}
                onClick={() => {
                  setSelectedDay(day);
                  setOpen(true);
                }}
              >
                {day}
                {eventDays.includes(day) && <span className="dot" />}
              </motion.button>
            ) : (
              <div key={i} className="calendar-cell empty" />
            )
          )}
        </div>

        {/* Footer */}
        <div className="calendar-overview-footer">
          <span className="legend">
            <span className="legend-dot" /> Appointment scheduled
          </span>
        </div>
      </motion.div>

      <AnimatePresence>{open && <CalendarModal selectedDay={selectedDay} onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  );
}
