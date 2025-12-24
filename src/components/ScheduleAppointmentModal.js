import { useState } from "react";
import { motion } from "framer-motion";
import { FaHospitalAlt, FaSearch } from "react-icons/fa";
import "./scheduleAppointment.css";

const clinics = [
  {
    name: "TRT Clinic",
    type: "Dental Clinic",
    logo: "logodark.svg",
  },
  {
    name: "HealthPlus +",
    type: "Hospital",
    logo: "logo192.png",
  },
  {
    name: "Prime Diagnostics",
    type: "Diagnostics",
    logo: "logo192.png",
  },
];

export default function ScheduleAppointmentModal({ date, onClose }) {
  const [query, setQuery] = useState("");
  const [selectedClinic, setSelectedClinic] = useState(null);

  const filteredClinics = clinics.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <motion.div className="schedule-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="schedule-modal" initial={{ scale: 0.92, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 30 }} onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="schedule-header">
          <FaHospitalAlt className="header-icon" />
          <div>
            <h4>Schedule Appointment</h4>
            <p className="muted">For {date}</p>
          </div>
        </div>

        {/* SEARCH */}
        <div className="clinic-search">
          <FaSearch />
          <input type="text" placeholder="Search clinic" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>

        {/* CLINICS */}
        <div className="clinic-list">
          {filteredClinics.map((c, i) => (
            <button key={i} className={`clinic-card ${selectedClinic === c.name ? "selected" : ""}`} onClick={() => setSelectedClinic(c.name)}>
              <img src={c.logo} alt={c.name} />
              <strong>{c.name}</strong>
              <span className="clinic-type">{c.type}</span>
            </button>
          ))}
        </div>

        {/* FORM */}
        <div className="schedule-form">
          <input type="time" />
          <textarea placeholder="Reason for appointment" rows={3} />
          <button className="primary-btn" disabled={!selectedClinic}>
            Request Appointment
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
