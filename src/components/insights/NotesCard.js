import { motion } from "framer-motion";
import NoteItem from "./NoteItem";
import "./NotesCard.css";
import { FaUserDoctor } from "react-icons/fa6";

export default function NotesCard({ notes }) {
  return (
    <motion.div className="insight-card notes-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
      <div className="notes-header">
        <div className="d-flex gap-2">
          <FaUserDoctor size={24} className="confidence-icon" />
          <h6 className="my-0">Coach & Doctor Notes</h6>
        </div>
        <span className="notes-sub">Personalized insights from your care team</span>
      </div>

      <div className="notes-list">
        {notes.map((n, i) => (
          <NoteItem key={i} {...n} index={i} />
        ))}
      </div>
    </motion.div>
  );
}
