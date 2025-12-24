import { motion } from "framer-motion";
import { FaUserMd, FaRunning } from "react-icons/fa";

export default function NoteItem({ note, author, role, avatar, clinicLogo, index }) {
  const isDoctor = role.toLowerCase().includes("doctor");

  return (
    <motion.div className="note-item" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} whileHover={{ y: -2 }}>
      {/* Avatar */}
      <img className="note-avatar" src={avatar || "https://i.pravatar.cc/60"} alt={author} />

      {/* Content */}
      <div className="note-content">
        <p className="note-text">{note}</p>

        <div className="note-meta">
          <span className={`role-badge ${isDoctor ? "doctor" : "coach"}`}>
            {isDoctor ? <FaUserMd /> : <FaRunning />}
            {role}
          </span>

          <span className="note-author">{author}</span>
        </div>
      </div>

      {/* Clinic Logo */}
      <img className="clinic-logo" src={clinicLogo || "logodark.svg"} alt="clinic" />
    </motion.div>
  );
}
