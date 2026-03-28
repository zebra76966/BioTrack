import { Container, Row, Col, Button, Modal, Form } from "react-bootstrap";
import { motion, AnimatePresence, delay } from "framer-motion";
import { useState } from "react";
import { SiGooglefit, SiFitbit, SiGarmin, SiSamsung } from "react-icons/si";
import { MdBloodtype } from "react-icons/md";

import toast from "react-hot-toast";
import "./DeviceConnections.css";
import { Toaster } from "react-hot-toast";

import { FaHeartbeat, FaPlus, FaApple, FaMobileAlt, FaWatchmanMonitoring } from "react-icons/fa";
import api from "../../auth/api";
import { useEffect } from "react";
import QRCode from "react-qr-code";
import baseUrl from "../../auth/baseUrl";

const devicesList = [
  { id: "googlefit", name: "Google Fit", icon: SiGooglefit, color: "#4285F4" },
  // { id: "fitbit", name: "Fitbit", icon: SiFitbit, color: "#00B0B9" },
  { id: "garmin", name: "Garmin", icon: SiGarmin, color: "#000000" },
  { id: "oura", name: "Oura Ring", type: "text", label: "OURA", color: "#111827" },
  { id: "dexcom", name: "Dexcom CGM", icon: MdBloodtype, color: "#FF8C00" },
  {
    id: "apple",
    name: "Apple Health",
    icon: FaApple,
    color: "#fff",
  },
];

const otherDevices = [
  { id: "apple", name: "Apple Health", icon: FaApple },
  { id: "dexcom", name: "Dexcom CGM" },
  { id: "freestyle", name: "FreeStyle Libre" },
  { id: "oneTouch", name: "OneTouch Glucose" },
  { id: "whoop", name: "Whoop Strap" },
];

export default function DeviceConnections() {
  const [qrToken, setQrToken] = useState(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [expiresIn, setExpiresIn] = useState(60);
  const [appleNotified, setAppleNotified] = useState(false);

  useEffect(() => {
    if (!qrToken) return;

    setExpiresIn(60);

    const interval = setInterval(() => {
      setExpiresIn((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setQrToken(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [qrToken]);

  const generateQr = async () => {
    try {
      setQrLoading(true);

      const res = await api.post("/auth/qr/generate");

      setQrToken(res.data.token);
    } catch (e) {
      toast.error("Failed to generate QR");
    } finally {
      setQrLoading(false);
    }
  };

  const [devices, setDevices] = useState(
    devicesList.map((d) => ({
      ...d,
      status: "disconnected",
    })),
  );

  const refreshDeviceStatus = async () => {
    try {
      const res = await api.get("/devices/status");

      setDevices((prev) =>
        prev.map((d) => ({
          ...d,
          // This dynamically matches 'googlefit', 'apple', or 'dexcom' from the res.data keys
          status: res.data[d.id] ? "connected" : "disconnected",
        })),
      );
    } catch {
      toast.error("Failed to refresh device status");
    }
  };
  useEffect(() => {
    refreshDeviceStatus();
  }, []);

  const [showAppleModal, setShowAppleModal] = useState(false);

  const connectDevice = (id) => {
    if (id === "apple") {
      setShowAppleModal(true);
      generateQr();
      return;
    }

    const jwtToken = localStorage.getItem("jwt");
    const authUrls = {
      googlefit: `${baseUrl}/auth/google?token=${jwtToken}&platform=web`,
      dexcom: `${baseUrl}/auth/dexcom?token=${jwtToken}&platform=web`,
    };

    if (!authUrls[id]) {
      toast("Coming soon 🚧");
      return;
    }

    const width = id === "dexcom" ? 700 : 520;
    const height = 720;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(authUrls[id], `${id}Auth`, `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`);

    if (!popup) {
      toast.error("Popup blocked. Please allow popups.");
      return;
    }

    // 1. Set state to connecting
    setDevices((prev) => prev.map((d) => (d.id === id ? { ...d, status: "connecting" } : d)));

    const toastId = `${id}-auth`;
    const deviceName = id === "dexcom" ? "Dexcom" : "Google Fit";
    toast.loading(`Waiting for ${deviceName} authorization…`, { id: toastId });

    // 2. Use a local variable to track if we've already handled the success
    let isHandled = false;

    const handleMessage = (event) => {
      // Only handle relevant messages
      if (event.data === `${id}_connected`) {
        isHandled = true; // Mark as successful
        clearInterval(checkPopupClosed);
        toast.success(`${deviceName} connected!`, { id: toastId });
        refreshDeviceStatus();
        window.removeEventListener("message", handleMessage);
      }
    };

    window.addEventListener("message", handleMessage);

    const checkPopupClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkPopupClosed);
        window.removeEventListener("message", handleMessage);

        // 3. ONLY reset to disconnected if it wasn't handled by the message event
        if (!isHandled) {
          setDevices((prev) => prev.map((d) => (d.id === id && d.status === "connecting" ? { ...d, status: "disconnected" } : d)));
          toast.dismiss(toastId);
        }
      }
    }, 1000);
  };

  const disconnectDexcom = async () => {
    try {
      await api.post("/devices/dexcom/disconnect"); // Ensure this route exists on backend
      toast.success("Dexcom disconnected");
      refreshDeviceStatus();
    } catch {
      toast.error("Failed to disconnect Dexcom");
    }
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

  const token = localStorage.getItem("jwt");
  useEffect(() => {
    if (!token) return;

    const eventSource = new EventSource(`${baseUrl}/devices/stream?token=${token}`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setDevices((prev) =>
        prev.map((d) => {
          // 🛡️ PROTECTIVE SHIELD: If the device is currently "connecting",
          // do NOT let the SSE stream reset it to "disconnected".
          if (d.status === "connecting") return d;

          if (d.id === "googlefit") {
            return { ...d, status: data.googlefit ? "connected" : "disconnected" };
          }
          if (d.id === "apple") {
            return {
              ...d,
              status: data.apple ? "connected" : "disconnected",
              lastSynced: data.timestamp,
            };
          }
          if (d.id === "dexcom") {
            return { ...d, status: data.dexcom ? "connected" : "disconnected" };
          }
          return d;
        }),
      );
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => eventSource.close();
  }, [token]);

  useEffect(() => {
    const apple = devices.find((d) => d.id === "apple");

    if (apple?.status === "connected" && !appleNotified) {
      setShowAppleModal(false);
      setAppleNotified(true);

      toast.success("Apple Health connected via iPhone 🍏", {
        duration: 4000,
      });
    }
    if (apple?.status === "disconnected") {
      setAppleNotified(false);
    }
  }, [devices]);

  function timeAgo(ts) {
    if (!ts) return "—";

    const diff = Math.floor((Date.now() - ts) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;

    return `${Math.floor(diff / 3600)}h ago`;
  }
  const disconnectApple = async () => {
    await api.post("/devices/apple/disconnect");
    refreshDeviceStatus();
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

                {device.id === "apple" && device.status === "connected" && (
                  <div className="apple-meta mt-2">
                    {/* <span className="text-muted small">Connected · 
                    Last sync {timeAgo(device.lastSynced)}
                    
                    </span> */}

                    <span className="text-muted small">Connected · Sync it Via App</span>
                  </div>
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
                      {device.id === "googlefit" && <Button onClick={syncGoogleFit}>Sync Now</Button>}
                      <Button
                        onClick={
                          device.id === "googlefit"
                            ? disconnectGoogleFit
                            : device.id === "apple"
                              ? disconnectApple
                              : device.id === "dexcom"
                                ? disconnectDexcom // ✅ Added this
                                : null
                        }
                      >
                        Disconnect
                      </Button>{" "}
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

      <Modal show={showAppleModal} centered onHide={() => setShowAppleModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Connect Apple Health</Modal.Title>
        </Modal.Header>

        <Modal.Body className="text-center">
          <FaApple size={42} style={{ marginBottom: 16 }} />

          <p className="mb-3">Scan this QR code from your iPhone</p>

          {qrLoading && <p className="text-muted">Generating secure QR…</p>}

          {!qrLoading && qrToken && (
            <div className="qr-box mb-3">
              <QRCode value={`biotrack://auth?token=${qrToken}`} size={180} />
            </div>
          )}

          {qrToken && (
            <>
              <div className="text-muted small mt-2">Expires in {expiresIn}s</div>

              <div style={{ height: 4, background: "#e5e7eb", marginTop: 8 }}>
                <div
                  style={{
                    width: `${(expiresIn / 60) * 100}%`,
                    height: "100%",
                    background: "#2563eb",
                    transition: "width 1s linear",
                  }}
                />
              </div>
            </>
          )}

          {!qrToken && !qrLoading && (
            <Button size="sm" onClick={generateQr}>
              Generate QR
            </Button>
          )}

          <div className="mt-3 text-muted small">
            1. Open BioTrack app on your iPhone
            <br />
            2. Tap "Scan QR"
            <br />
            3. Allow Apple Health permissions
            <br />
            4. Your data will sync automatically
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAppleModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </motion.div>
  );
}
