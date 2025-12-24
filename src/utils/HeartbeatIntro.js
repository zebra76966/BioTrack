import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./heartbeatIntro.css";

const HeartbeatIntro = ({ onComplete }) => {
  const [stage, setStage] = useState("ecg");

  useEffect(() => {
    const run = async () => {
      await delay(1800); // ECG draw
      setStage("circle");

      await delay(1200); // circle draw
      setStage("fade");

      await delay(800); // circle collapse
      setStage("logo");

      await delay(1400); // <-- let logo animate
      onComplete?.();
    };

    run();
  }, [onComplete]);

  return (
    <div className="heartbeat-intro">
      <Particles />

      <AnimatePresence>
        {stage !== "logo" && (
          <motion.svg key="svg" className="heartbeat-svg" viewBox="0 0 600 200">
            {/* ECG LINE */}
            <motion.path d={ECG_PATH} className="heartbeat-path" initial={{ pathLength: 0 }} animate={{ pathLength: stage === "ecg" ? 1 : 1 }} transition={{ duration: 1.6, ease: "easeInOut" }} />

            {/* CIRCLE FORMED FROM END */}
            {stage !== "ecg" && (
              <motion.circle
                cx="480"
                cy="100"
                r="28"
                className="heartbeat-path"
                initial={{ pathLength: 0, scale: 1, opacity: 1 }}
                animate={{
                  pathLength: 1,
                  scale: stage === "fade" ? 0 : 1,
                  opacity: stage === "fade" ? 0 : 1,
                }}
                transition={{
                  pathLength: { duration: 0.9 },
                  scale: { duration: 0.8, ease: "easeInOut" },
                  opacity: { duration: 0.6 },
                }}
              />
            )}
          </motion.svg>
        )}
      </AnimatePresence>

      {stage === "logo" && <LogoReveal />}
    </div>
  );
};

export default HeartbeatIntro;

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const ECG_PATH = "M0 100 L80 100 L120 60 L160 140 L200 100 L260 100 L300 40 L340 160 L380 100 L450 100";
const Particles = () => (
  <div className="particles">
    {[...Array(20)].map((_, i) => (
      <span
        key={i}
        style={{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 6}s`,
          animationDuration: `${6 + Math.random() * 6}s`,
        }}
      />
    ))}
  </div>
);

const LogoReveal = () => (
  <motion.div
    className="logo-container"
    initial={{ scale: 0.85, opacity: 0, y: 100 }}
    animate={{ scale: 1, opacity: 1, y: 0 }}
    transition={{
      type: "spring",
      stiffness: 200,
      damping: 20,
      mass: 1,
    }}
  >
    <div className="biotrack-logo">
      <span className="dot purple" />
      <span className="dot yellow" />
      <span className="dot purple light" />
    </div>
    <span className="logo-text2">BioTrack</span>
  </motion.div>
);
