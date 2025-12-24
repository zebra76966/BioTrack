import Dashboard from "./pages/dashboard";
import { useState } from "react";
import HeartbeatIntro from "./utils/HeartbeatIntro";
import { motion } from "framer-motion";

function App() {
  const [showIntro, setShowIntro] = useState(true);
  return (
    <>
      {showIntro && <HeartbeatIntro onComplete={() => setShowIntro(false)} />}
      {!showIntro && (
        <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.5, ease: "easeOut" }}>
          <Dashboard />
        </motion.div>
      )}
    </>
  );
}

export default App;
