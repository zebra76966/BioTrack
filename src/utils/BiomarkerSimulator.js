import { useState, useEffect } from "react";
import { useSimulation } from "./SimulationContext";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiSliders, FiInfo, FiChevronRight, FiUser, FiActivity, FiStar, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";
import { MdOutlinePersonOutline } from "react-icons/md";
import { GiHypodermicTest } from "react-icons/gi";
import { toast, Toaster } from "react-hot-toast";
import "./biomarkerSimulator.css";

const PRESET_PROFILES = [
  {
    id: "optimal",
    label: "Optimal",
    icon: <FiStar />, // Replaced ✨
    values: { trt: 750, ldl: 85, hba1c: 4.9, age: 28 },
  },
  {
    id: "average",
    label: "Typical",
    icon: <MdOutlinePersonOutline />, // Replaced 👤
    values: { trt: 450, ldl: 125, hba1c: 5.4, age: 35 },
  },
  {
    id: "at_risk",
    label: "Risk Profile",
    icon: <FiAlertTriangle />, // Replaced ⚠️
    values: { trt: 300, ldl: 175, hba1c: 6.2, age: 45 },
  },
];

export default function BiomarkerSimulator() {
  const { simulatedMarkers, applySimulation } = useSimulation();
  const [isOpen, setIsOpen] = useState(false);
  const [localMarkers, setLocalMarkers] = useState(simulatedMarkers);
  const [localAge, setLocalAge] = useState(25);

  useEffect(() => {
    setLocalMarkers(simulatedMarkers);
  }, [simulatedMarkers, isOpen]);

  const handleProfileSelect = (profile) => {
    setLocalAge(profile.values.age);
    setLocalMarkers((prev) =>
      prev.map((m) => ({
        ...m,
        value: profile.values[m.id] ?? m.value,
      })),
    );
    toast.success(`${profile.label} Preset Loaded`, {
      style: { borderRadius: "10px", background: "#FFF", color: "#1A1A1A" },
    });
  };

  const handleSliderChange = (id, newVal) => {
    setLocalMarkers((prev) => prev.map((m) => (m.id === id ? { ...m, value: parseFloat(newVal) } : m)));
  };

  const handleRecalculate = () => {
    applySimulation(localMarkers);
    toast.success("Health Metrics Updated", {
      icon: <FiCheckCircle style={{ color: "#8e73ff" }} />,
    });
    setIsOpen(false);
  };

  return (
    <>
      <Toaster position="bottom-center" />
      <motion.button className="sim-trigger-btn light-theme" onClick={() => setIsOpen(true)} whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}>
        <FiSliders /> <span>Marker Lab</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div className="sim-backdrop light-theme" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} />
            <motion.div className="sim-drawer light-theme" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}>
              <div className="sim-header light-theme">
                <div className="d-flex align-items-center gap-3">
                  <div className="header-icon-box">
                    <GiHypodermicTest />
                  </div>
                  <div>
                    <h5>Marker Lab</h5>
                    <p className="muted">Simulate physiological changes</p>
                  </div>
                </div>
                <button className="close-btn light-theme" onClick={() => setIsOpen(false)}>
                  <FiX />
                </button>
              </div>

              <div className="sim-body light-theme">
                <section className="sim-section mb-5">
                  <h6 className="section-label">
                    <FiUser /> Quick Profiles
                  </h6>
                  <div className="profile-grid">
                    {PRESET_PROFILES.map((p) => (
                      <button key={p.id} className="profile-card" onClick={() => handleProfileSelect(p)}>
                        <span className="profile-icon">{p.icon}</span>
                        <span className="profile-name">{p.label}</span>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="sim-section mb-5">
                  <div className="d-flex justify-content-between mb-2">
                    <h6 className="section-label">
                      <FiActivity /> Biological Age
                    </h6>
                    <span className="marker-value">
                      {localAge} <small>yrs</small>
                    </span>
                  </div>
                  <input type="range" className="custom-range premium-slider" min="18" max="80" value={localAge} onChange={(e) => setLocalAge(parseInt(e.target.value))} />
                </section>

                <hr className="sim-divider" />

                <h6 className="section-label mb-4">Laboratory Markers</h6>
                {localMarkers.map((m) => (
                  <div key={m.id} className="marker-control light-theme">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="marker-label">{m.label}</span>
                      <span className="marker-value">
                        {m.value} <small>{m.unit}</small>
                      </span>
                    </div>
                    <input
                      type="range"
                      className="custom-range premium-slider"
                      min={m.min}
                      max={m.max}
                      step={m.id === "hba1c" ? "0.1" : "1"}
                      value={m.value}
                      onChange={(e) => handleSliderChange(m.id, e.target.value)}
                      style={{
                        background: `linear-gradient(to right, #8e73ff 0%, #8e73ff ${((m.value - m.min) / (m.max - m.min)) * 100}%, #e2e8f0 ${((m.value - m.min) / (m.max - m.min)) * 100}%, #e2e8f0 100%)`,
                      }}
                    />
                  </div>
                ))}
              </div>

              <div className="sim-footer light-theme">
                <button className="apply-btn light-theme" onClick={handleRecalculate}>
                  Recalculate Vitality <FiChevronRight />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
