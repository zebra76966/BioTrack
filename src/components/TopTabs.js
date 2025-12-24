import { useRef } from "react";
import { motion } from "framer-motion";
import { FaBell, FaChevronDown } from "react-icons/fa";
import "./topTabs.css";

const tabs = ["Dashboard", "Insights", "Schedule", "History", "Activity"];

export default function TopTabs({ active, setActive }) {
  const containerRef = useRef(null);

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

        <div className="profile-dropdown">
          <div className="profile-trigger">
            <img src="https://i.pravatar.cc/40" alt="user" />
            <div className="profile-text">
              <span className="name">Rucas Bryan</span>
              <span className="role">Premium Member</span>
            </div>
            <FaChevronDown />
          </div>

          <div className="dropdown-menu">
            <div>Profile</div>
            <div>Settings</div>
            <div className="danger">Logout</div>
          </div>
        </div>
      </div>
    </div>
  );
}
