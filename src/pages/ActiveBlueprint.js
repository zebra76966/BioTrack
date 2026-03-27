import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaRegClock, FaCheckDouble, FaExclamationCircle, FaChartBar, FaCalendarAlt, FaWalking, FaFire, FaTint, FaCheckCircle } from "react-icons/fa";
import { FaArrowTrendUp, FaArrowTrendDown, FaMinus } from "react-icons/fa6"; // New Trend Icons
import { GiStethoscope } from "react-icons/gi";
import api from "../auth/api";
import "../styles/ActiveBlueprint.css";
export default function ActiveBlueprint() {
  const [activePlan, setActivePlan] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);

  const getPulseIcon = (label, type) => {
    const text = label.toLowerCase();
    if (text.includes("step")) return <FaWalking />;
    if (text.includes("glucose")) return <FaTint />;
    if (text.includes("calor")) return <FaFire />;
    return type === "success" ? <FaCheckCircle /> : <FaExclamationCircle />;
  };

  // Helper for Trend Icons
  const renderTrend = (trend) => {
    if (trend === "up") return <FaArrowTrendUp className="trend-icon up" style={{ color: "#22c55e" }} />;
    if (trend === "down") return <FaArrowTrendDown className="trend-icon down" style={{ color: "#ef4444" }} />;
    return <FaMinus className="trend-icon stable" style={{ color: "#94a3b8" }} />;
  };

  useEffect(() => {
    const fetchBlueprintData = async () => {
      try {
        const res = await api.get("/user/get-plan");
        const rawData = res.data.plan;
        const data = typeof rawData === "string" ? JSON.parse(rawData) : rawData;
        setActivePlan({ ...data, createdAt: res.data.createdAt || new Date() });

        const insightRes = await api.get("/user/blueprint-comparison");
        setSuggestions(insightRes.data.comparisons || []);
      } catch (err) {
        console.error("Blueprint fetch error:", err);
      } finally {
        setLoadingSuggestions(false);
      }
    };
    fetchBlueprintData();
  }, []);

  if (!activePlan)
    return (
      <div className="no-plan-state">
        <GiStethoscope size={48} className="mb-3 opacity-20" />
        <p>No active blueprint locked in. Generate one via the Architect.</p>
      </div>
    );

  const formattedDate = new Date(activePlan.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="blueprint-page-container">
      <div className="pulse-bar-wrapper">
        <div className="pulse-header">
          <FaChartBar className="me-2 pulse-animate" /> Live Metabolic Pulse
        </div>
        <div className="pulse-scroll-container">
          {loadingSuggestions ? (
            <div className="pulse-loading">Syncing Biometrics...</div>
          ) : (
            <div className="pulse-row">
              {suggestions.map((item, i) => (
                <motion.div key={i} className={`pulse-card-v2 ${item.type}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div className={`pulse-icon-box ${item.type}`}>{getPulseIcon(item.label, item.type)}</div>
                  <div className="pulse-content">
                    <div className="pulse-top-line">
                      <span className="pulse-label">{item.label}</span>
                      <div className="pulse-meta-tags">
                        {renderTrend(item.trend)}
                        <span className={`pulse-status-tag status-${item.type}`}>{item.type === "success" ? "Optimal" : item.type === "warning" ? "Notice" : "Urgent"}</span>
                      </div>
                    </div>
                    <p className="pulse-msg">{item.message}</p>
                    <div className="pulse-suggestion-tip">
                      <span className="tip-label">Protocol Tip:</span> {item.cta}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {console.log("suggestion", suggestions)}

      {/* MAIN CONTENT AREA */}
      <div className="blueprint-content-grid">
        <div className="blueprint-header-v2">
          <div className="header-text-group">
            <h2 className="main-title">Performance Blueprint</h2>
            <div className="header-meta">
              <span className="meta-item">
                <FaCalendarAlt className="me-1" /> {formattedDate}
              </span>
              <span className="meta-divider">|</span>
              <span className="meta-item">Punjab, India</span>
            </div>
          </div>
          <div className="status-pill">
            <FaCheckDouble className="me-2" /> BIOTRACK SYNCED
          </div>
        </div>

        <div className="blueprint-timeline">
          {(activePlan.plan || activePlan.sections || activePlan.optimizationPlan || []).map((section, idx) => (
            <motion.div key={idx} className="timeline-item pb-3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}>
              <div className="timeline-marker">
                <div className="marker-node" />
                <div className="marker-line" />
              </div>
              <div className="timeline-content-card shadow-sm">
                <h5 className="section-title">
                  <FaRegClock className="me-2 clock-icon" />
                  {section.heading || section.timeBlock}
                </h5>
                <div className="action-step-list">
                  {(section.actions || section.Actions || []).map((action, aIdx) => (
                    <div key={aIdx} className="step-item">
                      <div className="step-bullet" />
                      <span className="step-text">{typeof action === "object" ? action.Description || action.task : action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
