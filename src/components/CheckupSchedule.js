import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CalendarModal from "./CalendarModal";
import "./checkupSchedule.css";

export default function CheckupSchedule({ mode = "compact", appointments = [] }) {
  const isFull = mode === "full";

  const [active, setActive] = useState(19);
  const [open, setOpen] = useState(false);
  const [syncing, setSyncing] = useState(true);

  // Calendar sync simulation
  useEffect(() => {
    const t = setTimeout(() => setSyncing(false), 2000);
    return () => clearTimeout(t);
  }, []);

  const days = isFull ? Array.from({ length: 14 }, (_, i) => 14 + i) : [15, 16, 17, 18, 19, 20, 21, 22, 23];

  return (
    <>
      <motion.div className={`checkup-card ${isFull ? "full" : "compact"}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* HEADER */}
        <div className="checkup-header">
          <div>
            <h5>Checkup Schedule</h5>
            <span className="sync-status">{syncing ? "Syncing calendar…" : "Calendar synced ✓"}</span>
          </div>

          <div className="checkup-actions">
            {isFull && (
              <button className="primary-btn" onClick={() => setOpen(true)}>
                + Schedule Appointment
              </button>
            )}

            <button className="show-more-btn" onClick={() => setOpen(true)}>
              {isFull ? "View Month" : "Show More"}
            </button>
          </div>
        </div>

        {/* DATE PILLS */}
        <div className="date-row">
          {days.map((d) => (
            <motion.button key={d} whileTap={{ scale: 0.95 }} className={`date-pill ${active === d ? "active" : ""}`} onClick={() => setActive(d)}>
              <span className="day">Mon</span>
              <span className="date">{d}</span>
            </motion.button>
          ))}
        </div>

        {/* APPOINTMENTS */}
        <div className={isFull ? "appointments-grid" : "appointments-carousel"}>
          {appointments.length ? appointments.map((a, i) => <Appointment key={i} {...a} />) : <span className="muted">No appointments found</span>}
        </div>
      </motion.div>

      <AnimatePresence>{open && <CalendarModal onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  );
}

/* ---------------- Appointment Card ---------------- */

function Appointment({ title, doctor, date, time, status, avatar, clinicLogo, notes }) {
  return (
    <motion.div className="appointment-card">
      {/* Status */}
      <span className={`status-badge ${status}`}>{status === "confirmed" ? "Confirmed" : "Pending"}</span>

      {/* Avatar */}
      <img className="doctor-avatar" src={avatar} alt="" />

      {/* Info */}
      <div className="appointment-info">
        <strong className="appt-title">{title}</strong>
        <span className="appt-doctor">{doctor}</span>
        <span className="appt-time">
          {date} · {time}
        </span>

        <div className="appt-extra">
          <span>{notes}</span>
        </div>
      </div>

      {/* Clinic logo */}
      <img className="clinic-logo" src={clinicLogo} alt="" />
    </motion.div>
  );
}

/* ---------------- Dummy Data ---------------- */
