import { Container, Row, Col, Button, Modal, Form } from "react-bootstrap";
import { motion, AnimatePresence, delay } from "framer-motion";
import { useState } from "react";
import { SiGooglefit, SiFitbit, SiGarmin, SiSamsung } from "react-icons/si";

import toast from "react-hot-toast";
import "./DeviceConnections.css";
import { Toaster } from "react-hot-toast";

import { FaHeartbeat, FaPlus, FaApple, FaMobileAlt, FaWatchmanMonitoring } from "react-icons/fa";
import api from "../../auth/api";
import { useEffect } from "react";

const devicesList = [
  { id: "googlefit", name: "Google Fit", icon: SiGooglefit, color: "#4285F4" },
  // { id: "fitbit", name: "Fitbit", icon: SiFitbit, color: "#00B0B9" },
  { id: "garmin", name: "Garmin", icon: SiGarmin, color: "#000000" },
  { id: "oura", name: "Oura Ring", type: "text", label: "OURA", color: "#111827" },
  { id: "glucose", name: "Glucose Monitor", icon: FaHeartbeat, color: "#ef4444" },
];

const otherDevices = [
  { id: "apple", name: "Apple Health", icon: FaApple },
  { id: "dexcom", name: "Dexcom CGM" },
  { id: "freestyle", name: "FreeStyle Libre" },
  { id: "oneTouch", name: "OneTouch Glucose" },
  { id: "whoop", name: "Whoop Strap" },
];

export default function DeviceConnections() {
  const [devices, setDevices] = useState(
    devicesList.map((d) => ({
      ...d,
      status: "disconnected",
    })),
  );

  const refreshDeviceStatus = async () => {
    try {
      const res = await api.get("/devices/status");

      setDevices((prev) => prev.map((d) => (d.id === "googlefit" ? { ...d, status: res.data.googlefit ? "connected" : "disconnected" } : d)));
    } catch {
      toast.error("Failed to refresh device status");
    }
  };

  useEffect(() => {
    refreshDeviceStatus();
  }, []);

  const connectDevice = (id) => {
    if (id !== "googlefit") {
      toast("Coming soon 🚧");
      return;
    }

    const width = 520;
    const height = 620;

    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open("http://localhost:5000/auth/google", "googleFitAuth", `width=${width},height=${height},left=${left},top=${top}`);

    if (!popup) {
      toast.error("Popup blocked. Please allow popups.");
      return;
    }

    setDevices((prev) => prev.map((d) => (d.id === "googlefit" ? { ...d, status: "connecting" } : d)));
    toast.loading("Waiting for Google Fit authorization…", {
      id: "googlefit-auth",
    });

    // 👂 Listen for success message
    const handleMessage = (event) => {
      if (event.origin !== "http://localhost:3000") return;

      if (event.data === "googlefit_connected") {
        toast.success("Google Fit connected!", {
          id: "googlefit-auth",
        });

        // Refresh device status
        refreshDeviceStatus();

        window.removeEventListener("message", handleMessage);
      }
    };

    window.addEventListener("message", handleMessage);
  };

  const disconnectGoogleFit = async () => {
    try {
      await api.post("/devices/googlefit/disconnect");
      toast.success("Google Fit disconnected");

      setDevices((prev) => prev.map((d) => (d.id === "googlefit" ? { ...d, status: "disconnected" } : d)));
    } catch {
      toast.error("Failed to disconnect");
    }
  };

  const syncGoogleFit = async () => {
    try {
      toast.loading("Syncing Google Fit...", { id: "sync" });

      await api.post("/sync/manual");

      toast.success("Google Fit synced successfully", {
        id: "sync",
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to sync Google Fit", {
        id: "sync",
      });
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const AnimatedSourceIcon = ({ children, delay = 0, label }) => {
    return (
      <motion.div
        title={label}
        animate={{
          scale: [1, 1.7, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 2.8,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 1,
          delay,
        }}
      >
        {children}
      </motion.div>
    );
  };

  return (
    <motion.div className="mt-4 container-fluid px-5" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className="mb-2">Connected Devices</h2>
      <p className="text-muted mb-4">Sync your health devices & apps to get accurate insights</p>

      <motion.div className="w-100" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Row>
          {devices.map((device) => (
            <Col md={6} lg={4} key={device.id} className="mb-4">
              <motion.div className={`device-card h-100 ${device.status}`} whileHover={{ y: -6 }} animate={device.status === "connected" ? { scale: [1, 1.03, 1] } : {}} transition={{ duration: 0.4 }}>
                {/* Confetti */}
                <AnimatePresence>
                  {device.status === "connected" && <motion.div className="confetti" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} />}
                </AnimatePresence>

                {/* Icon with loader */}
                <div className="icon-wrapper">
                  {device.status === "connecting" && <motion.div className="loader-ring" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }} />}

                  {device.type === "text" ? (
                    <span className="text-icon" style={{ color: device.color }}>
                      {device.label}
                    </span>
                  ) : (
                    <device.icon size={36} style={{ color: device.color, zIndex: 2 }} />
                  )}
                </div>

                <h5>{device.name}</h5>
                {device.id === "googlefit" && device.status === "connected" && (
                  <motion.div className="connected-sources mt-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {/* <span className="source-label">Sources</span> */}

                    <div className="source-icons animated">
                      <AnimatedSourceIcon delay={0} label="Google Fit">
                        <SiSamsung className="source-icon google" />
                      </AnimatedSourceIcon>

                      <AnimatedSourceIcon delay={1} label="Fitbit">
                        <SiFitbit className="source-icon fitbit" />
                      </AnimatedSourceIcon>

                      <AnimatedSourceIcon delay={2} label="Phone">
                        <FaMobileAlt className="source-icon phone" />
                      </AnimatedSourceIcon>

                      <AnimatedSourceIcon delay={3} label="Wear OS">
                        <FaWatchmanMonitoring className="source-icon wearos" />
                      </AnimatedSourceIcon>
                    </div>
                  </motion.div>
                )}
                <div className="mt-4">
                  {device.status === "disconnected" && (
                    <Button className="connect-btn" onClick={() => connectDevice(device.id)}>
                      Connect
                    </Button>
                  )}

                  {device.status === "connecting" && <span className="connecting-text">Connecting…</span>}

                  {device.status === "connected" && (
                    <div className="d-flex justify-content-center align-items-center gap-2 mt-4">
                      <Button className="sync-btn mb-0" size="sm" onClick={syncGoogleFit}>
                        Sync Now
                      </Button>

                      <Button variant="danger" className="connect-btn rounded-2 bg-warning " onClick={disconnectGoogleFit}>
                        Disconnect
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            </Col>
          ))}

          <Col md={6} lg={4} className="mb-4">
            <motion.div className="device-card add-device-card" whileHover={{ y: -6 }} onClick={() => setShowModal(true)}>
              <div className="icon-wrapper add-icon">
                <FaPlus size={28} />
              </div>
              <h5>Add Device</h5>
              <p className="text-muted small">Connect more health apps & devices</p>
            </motion.div>
          </Col>
        </Row>
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <Modal show centered onHide={() => setShowModal(false)} contentClassName="device-modal">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} transition={{ duration: 0.25 }}>
              <Modal.Header closeButton>
                <Modal.Title>Add a Device</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <Form.Control placeholder="Search devices..." className="mb-3" value={search} onChange={(e) => setSearch(e.target.value)} />

                <div className="device-search-list">
                  {otherDevices
                    .filter((d) => d.name.toLowerCase().includes(search.toLowerCase()))
                    .map((device) => (
                      <div key={device.id} className="search-device-item">
                        <span>{device.name}</span>
                        <Button
                          size="sm"
                          className="connect-btn"
                          onClick={() => {
                            toast.success(`${device.name} added`);
                            setShowModal(false);
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    ))}
                </div>
              </Modal.Body>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
