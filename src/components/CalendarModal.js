import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { checkups } from "../data/checkups";
import ScheduleAppointmentModal from "./ScheduleAppointmentModal";
import "./calendarModal.css";
import { FaCalendar, FaCalendarTimes } from "react-icons/fa";

export default function CalendarModal({ onClose }) {
  const today = new Date();

  const year = today.getFullYear();
  const month = today.getMonth(); // 0-based
  const monthLabel = today.toLocaleString("default", { month: "long" });

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const getDateKey = (day) => `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const getDayLabel = (day) =>
    new Date(year, month, day).toLocaleDateString("default", {
      weekday: "short",
    });

  const [selected, setSelected] = useState(getDateKey(today.getDate()));

  const [openSchedule, setOpenSchedule] = useState(false);

  const events = checkups[selected] || [];

  return (
    <>
      <motion.div className="calendar-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
        <motion.div className="calendar-modal" initial={{ scale: 0.92, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 30 }} onClick={(e) => e.stopPropagation()}>
          {/* LEFT */}
          <div className="calendar-left">
            <div className="calendar-header">
              <h4>
                {monthLabel} {year}
              </h4>
            </div>

            <div className="calendar-grid">
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const key = getDateKey(day);
                const hasEvent = !!checkups[key];
                const isSelected = selected === key;

                return (
                  <button key={day} className={`calendar-day ${hasEvent ? "has-event" : ""} ${isSelected ? "selected" : ""}`} onClick={() => setSelected(key)}>
                    <span className="calendar-day-label">{getDayLabel(day)}</span>
                    <span className="calendar-day-number">{day}</span>
                    {hasEvent && <span className="dot" />}
                  </button>
                );
              })}
            </div>

            <button className="schedule-btn" onClick={() => setOpenSchedule(true)}>
              + Schedule Appointment
            </button>
          </div>

          {/* RIGHT */}
          <div className="calendar-right">
            <div className="calendar-right-header">
              <h5>Appointments</h5>
              <span className="appt-count">{events.length} total</span>
            </div>

            {events.length ? (
              <div className="calendar-event-list">
                {events.map((e, i) => (
                  <div className="calendar-event-card" key={i}>
                    {/* Left */}
                    <img className="event-avatar" src={e.avatar || "https://i.pravatar.cc/40"} alt="" />

                    {/* Center */}
                    <div className="event-info">
                      <strong className="event-title">{e.title}</strong>
                      <span className="event-doctor">{e.doctor}</span>
                    </div>

                    {/* Right */}
                    <div className="event-meta">
                      <span className="event-time">{e.time}</span>
                      <span className={`event-status ${e.status || "confirmed"}`}>{e.status || "Confirmed"}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="calendar-empty">
                <span className="empty-icon">
                  <FaCalendarTimes size={30} />
                </span>
                <p>No appointments scheduled</p>
                <span className="muted">Select a date or schedule one</span>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>{openSchedule && <ScheduleAppointmentModal date={selected} onClose={() => setOpenSchedule(false)} />}</AnimatePresence>
    </>
  );
}
