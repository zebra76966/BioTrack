import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaBookmark, FaRobot, FaMagic, FaRegClock, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { GiSparkles } from "react-icons/gi";
import api from "../auth/api";
import "./AiChatPanel.css";

export default function AiChatPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  // New States for the Save Flow
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const togglePanel = () => {
    if (isOpen) {
      setResponse(null);
      setShowConfirm(false);
      setIsSaved(false);
    }
    setIsOpen(!isOpen);
  };

  const generateBlueprint = async () => {
    setLoading(true);
    setIsSaved(false); // Reset saved status for new generation
    try {
      const res = await api.post("/ai/generate-plan");
      setResponse(res.data); // Ensure you are accessing .plan if using the parsed backend fix
    } catch (err) {
      setResponse({ error: "Architect connection lost." });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveClick = () => {
    if (isSaved) return;
    setShowConfirm(true);
  };

  const confirmSave = async () => {
    try {
      await api.post("/user/save-plan", { plan: JSON.stringify(response) });
      setIsSaved(true);
      setShowConfirm(false);
    } catch (err) {
      alert("System failed to save blueprint.");
    }
  };

  const getPlanData = () => {
    if (!response) return [];
    const root = response["24_Hour_Optimization_Plan"] || response;
    return root.Plan || root.sections || root.plan || root.optimizationPlan || root.steps || [];
  };

  const [botUtlized, setBotUtlized] = useState(false);

  useEffect(() => {
    if (response?.aiSuggestion === "Our AI engine is currently resting. Please try again in a moment.") {
      setBotUtlized(true);
    } else {
      setBotUtlized(false);
    }
  }, [response]);

  return (
    <>
      <motion.div className="ai-floating-trigger" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={togglePanel}>
        <FaRobot size={22} />
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div className="chat-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={togglePanel} />

            <motion.div className="gemini-panel noScroll" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}>
              <div className="panel-handle" />

              <div className="panel-header d-flex justify-content-between mb-3">
                <h6>
                  <GiSparkles className="me-2" /> BIOBOT
                </h6>
                <div className="close-btn" onClick={togglePanel}>
                  <FaTimes size={18} />
                </div>
              </div>

              {botUtlized ? (
                <div className="text-danger text-center p-4">Our AI engine is currently resting.</div>
              ) : (
                <div className="chat-content">
                  {!response && !loading && (
                    <motion.div className="prompt-suggestion shadow" onClick={generateBlueprint}>
                      <FaMagic className="prompt-icon" />
                      <span>Generate performance plan from my stats</span>
                    </motion.div>
                  )}

                  {loading && <div className="ai-typing">Compiling metabolic data...</div>}

                  {response && !response.error && (
                    <motion.div className="ai-response-area">
                      <div className="plan-header-card mb-4">
                        <h5 className="plan-title">{response.planTitle || "Health Optimization Plan"}</h5>
                        {response.dataInsights && (
                          <div className="insight-chips mt-2 d-flex flex-wrap gap-2">
                            {Object.entries(response.dataInsights).map(([key, val]) => (
                              <div key={key} className="insight-badge">
                                {val}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="plan-steps-container">
                        {getPlanData().map((section, idx) => (
                          <div key={idx} className="plan-block mb-4">
                            <div className="d-flex align-items-center mb-2">
                              <FaRegClock className="block-clock-icon me-2" size={14} />
                              <span className="block-heading">{section.heading || section.time || section.Time_Block}</span>
                            </div>
                            <ul className="action-list">
                              {(section.Actions || section.actions)?.map((action, aIdx) => (
                                <li key={aIdx} className="action-item">
                                  {typeof action === "object" ? action.Description || action.task : action}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>

                      {/* Overwrite Confirmation UI */}
                      <AnimatePresence>
                        {showConfirm && (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="save-confirm-box p-3 mb-3">
                            <p className="small text-muted mb-2">
                              <FaExclamationTriangle className="text-warning me-2" />
                              This will overwrite your existing active blueprint. Continue?
                            </p>
                            <div className="d-flex gap-2">
                              <button className="btn btn-sm btn-dark flex-grow-1" onClick={confirmSave}>
                                Confirm Overwrite
                              </button>
                              <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowConfirm(false)}>
                                Cancel
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Main Save Button */}
                      <button className={`btn-save-plan mt-3 ${isSaved ? "btn-saved-success" : ""}`} onClick={handleSaveClick} disabled={isSaved}>
                        {isSaved ? (
                          <>
                            <FaCheckCircle className="me-2" /> BLUEPRINT SAVED
                          </>
                        ) : (
                          <>
                            <FaBookmark className="me-2" /> SAVE ACTIVE BLUEPRINT
                          </>
                        )}
                      </button>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
