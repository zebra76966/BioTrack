import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaBell, FaChevronDown } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useAuth } from "../auth/AuthContext";
import "./topTabs.css";

const tabs = ["Dashboard", "Insights", "Schedule", "History", "Activity", "Devices"];

export default function TopTabs({ active, setActive }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const handleLogoutConfirm = () => {
    toast(
      (t) => (
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span>Log out of BioTrack?</span>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              logout();
            }}
            style={{
              background: "#ef4444",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "6px 10px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Logout
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            style={{
              background: "transparent",
              border: "none",
              color: "#9ca3af",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      ),
      {
        position: "top-center",
        duration: 6000,
      },
    );
  };

  return (
    <div className="topbar sticky">
      {/* LEFT — LOGO */}
      <div className="topbar-left shadow-sm p-2 px-4 rounded-4">
        <div className="logo-pill">
          <span />
          <span />
          <span />
        </div>
        <span className="logo-text">BioTrack</span>
      </div>

      {/* CENTER — TABS */}
      <div className="tabs-wrapper">
        {tabs.map((tab) => {
          const isActive = active === tab;

          return (
            <button key={tab} className={`tab-btn ${isActive ? "tab-active" : ""}`} onClick={() => setActive(tab)}>
              {isActive && <motion.span layoutId="active-pill" className="active-pill" transition={{ type: "spring", stiffness: 500, damping: 35 }} />}
              <span className="tab-label">{tab}</span>
            </button>
          );
        })}
      </div>

      {/* RIGHT — PROFILE */}
      <div className="topbar-right">
        <div className="notification">
          <FaBell />
          <span className="notif-dot" />
        </div>

        <div className="profile-dropdown" ref={containerRef}>
          <div className="profile-trigger" onClick={() => setOpen((o) => !o)}>
            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=0D8ABC&color=fff`} alt="user" />
            <div className="profile-text">
              <span className="name">{user?.name || "User"}</span>
              <span className="role">{user?.email}</span>
            </div>
            <FaChevronDown />
          </div>

          {open && (
            <motion.div className="profile-menu" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
              <div>Profile</div>
              <div>Settings</div>
              <div className="danger " onClick={handleLogoutConfirm}>
                Logout
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
