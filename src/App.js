import { Routes, Route, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { useState } from "react";

import Dashboard from "./pages/dashboard";
import SignIn from "./auth/signin";
import SignUp from "./auth/signup";
import HeartbeatIntro from "./utils/HeartbeatIntro";
import { useAuth } from "./auth/AuthContext";

import "./App.css";
import AuthSuccess from "./auth/AuthSuccess";

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="fullscreen-loader">Loading...</div>;
  }

  return (
    <>
      <Toaster position="bottom-center" />

      {showIntro && <HeartbeatIntro onComplete={() => setShowIntro(false)} />}

      {!showIntro && (
        <motion.div initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.2, ease: "easeOut" }}>
          <Routes>
            {/* ROOT */}
            <Route path="/auth/success" element={<AuthSuccess />} />
            <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/signin" replace />} />

            {/* AUTH */}
            <Route path="/signin" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignIn />} />

            <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignUp />} />

            {/* PROTECTED */}
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/signin" replace />} />

            {/* FALLBACK */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </motion.div>
      )}
    </>
  );
}

export default App;
