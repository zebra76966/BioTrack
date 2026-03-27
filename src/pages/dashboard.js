import { Container, Row, Col } from "react-bootstrap";
import { useEffect, useState, useCallback } from "react";
import TopTabs from "../components/TopTabs";
import StatCard from "../components/StatCards";
import ActivityTable from "../components/ActivityTable";
import VitalStatCard from "../components/VitalStatCard";
import CheckupSchedule from "../components/CheckupSchedule";

// Tab Pages
import InsightsPage from "./InsightsPage";
import SchedulePage from "./SchedulePage";
import HistoryPage from "./HistoryPage";
import ActivityPage from "./ActivityPage";
import DeviceConnections from "../components/devices/DeviceConnections";

import { FiRefreshCw } from "react-icons/fi";
import api from "../auth/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import "../styles/dashboard.css";
import { useActivitySessions } from "../hooks/useActivitySessions";
import BiomarkerSimulator from "../utils/BiomarkerSimulator";
import AiChatPanel from "../utils/AiChatPanel";
import ActiveBlueprint from "./ActiveBlueprint";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [range, setRange] = useState(7);
  const [mode, setMode] = useState("smart");
  const [filter, setFilter] = useState("All");
  const [activeRange, setActiveRange] = useState(7);
  const [loading, setLoading] = useState(true);
  const [activityData, setActivityData] = useState([]);
  const [syncing, setSyncing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const sessions = useActivitySessions(range, refreshKey);

  const [priority, setPriority] = useState({
    steps: "apple_health",
    calories: "apple_health",
    distance: "apple_health",
  });

  // Fetch merged data using the same logic as ActivityPage
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/activity/merged`, {
        params: {
          days: range,
          mode,
          priority: JSON.stringify(priority),
        },
      });
      setActivityData(res.data);
      setActiveRange(range);
    } catch (e) {
      console.error("Dashboard fetch error", e);
    } finally {
      setLoading(false);
    }
  }, [range, mode, priority]);

  useEffect(() => {
    if (activeTab === "Dashboard") {
      fetchDashboardData();
    }
  }, [activeTab, fetchDashboardData]);

  const syncActivity = async () => {
    try {
      setSyncing(true);
      toast.loading(`Syncing...`, { id: "dash-sync" });
      await api.post("/sync/manual", { days: range });
      toast.success("Synced", { id: "dash-sync" });

      fetchDashboardData();
      setRefreshKey((prev) => prev + 1); // 2. Refresh sessions after sync
    } catch (e) {
      toast.error("Sync failed", { id: "dash-sync" });
    } finally {
      setSyncing(false);
    }
  };

  // Derived Stats
  const hasActivityData = activityData && activityData.length > 0;
  const activeDays = activityData.filter((d) => d.steps > 0);
  const today = activityData[activityData.length - 1];

  const avgSteps = activeDays.length > 0 ? Math.round(activeDays.reduce((sum, d) => sum + d.steps, 0) / activeDays.length) : 0;
  const totalCalories = Math.round(activityData.reduce((sum, d) => sum + d.calories, 0));
  const totalDistance = (activityData.reduce((sum, d) => sum + d.distance, 0) / 1000).toFixed(1);

  const appointments = [
    {
      title: "Dental Checkup",
      doctor: "Dr. Jane Cooper",
      date: "Apr 28",
      time: "10:20 AM",
      status: "confirmed",
      type: "medical",
      avatar: "https://i.pravatar.cc/80?img=12",
      clinicLogo: "logodark.svg",
      notes: "Routine dental cleaning & X-ray",
    },
    {
      title: "Bloodwork Panel",
      doctor: "Dr. Emily Watson",
      date: "Apr 29",
      time: "09:00 AM",
      status: "confirmed",
      type: "labs",
      avatar: "https://i.pravatar.cc/80?img=22",
      clinicLogo: "logodark.svg",
      notes: "Hormone & lipid panel",
    },
    {
      title: "Recovery Session",
      doctor: "Coach Alex",
      date: "Apr 29",
      time: "18:00 PM",
      status: "confirmed",
      type: "recovery",
      avatar: "https://i.pravatar.cc/80?img=45",
      clinicLogo: "logodark.svg",
      notes: "Mobility & breathing work",
    },
    {
      title: "Dental Checkup",
      doctor: "Dr. Jane Cooper",
      date: "Apr 28",
      time: "10:20 AM",
      status: "confirmed",
      type: "medical",
      avatar: "https://i.pravatar.cc/80?img=12",
      clinicLogo: "logodark.svg",
      notes: "Routine dental cleaning & X-ray",
    },
    {
      title: "Bloodwork Panel",
      doctor: "Dr. Emily Watson",
      date: "Apr 29",
      time: "09:00 AM",
      status: "confirmed",
      type: "labs",
      avatar: "https://i.pravatar.cc/80?img=22",
      clinicLogo: "logodark.svg",
      notes: "Hormone & lipid panel",
    },
    {
      title: "Recovery Session",
      doctor: "Coach Alex",
      date: "Apr 29",
      time: "18:00 PM",
      status: "confirmed",
      type: "recovery",
      avatar: "https://i.pravatar.cc/80?img=45",
      clinicLogo: "logodark.svg",
      notes: "Mobility & breathing work",
    },
  ];

  const filteredAppointments = filter === "All" ? appointments : appointments.filter((a) => a.type.toLowerCase() === filter.toLowerCase());

  return (
    <Container fluid className="app-bg">
      <div className="dashboard-shell">
        <TopTabs active={activeTab} setActive={setActiveTab} />

        {activeTab === "Dashboard" && (
          <Row>
            <Col md={7}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h2 className="page-title mb-1">Overview Of Your Health</h2>
                  <p className="page-subtitle mb-0">Balance, Strength, Vitality, Wellness.</p>
                </div>

                <div className="d-flex align-items-center gap-2">
                  {/* RANGE TOGGLE */}
                  <div className="range-toggle">
                    {[7, 30].map((d) => (
                      <button key={d} className={`toggle-btn ${range === d ? "active" : ""}`} onClick={() => setRange(d)}>
                        {d}D
                      </button>
                    ))}
                  </div>

                  {/* MODE TOGGLE */}
                  <div className="mode-toggle">
                    {["smart", "priority"].map((m) => (
                      <button key={m} className={`toggle-btn ${mode === m ? "active" : ""}`} onClick={() => setMode(m)}>
                        {m === "smart" ? "Smart" : "Priority"}
                      </button>
                    ))}
                  </div>

                  {/* PRIORITY SELECTORS */}
                  {mode === "priority" && (
                    <select className="top-nav-select" value={priority.steps} onChange={(e) => setPriority({ ...priority, steps: e.target.value })}>
                      <option value="apple_health">Apple</option>
                      <option value="google_fit">Fit</option>
                    </select>
                  )}

                  <motion.button className="sync-activity-btn" onClick={syncActivity} disabled={syncing} whileTap={{ scale: 0.95 }}>
                    <FiRefreshCw className={syncing ? "spin" : ""} />
                  </motion.button>
                </div>
              </div>

              {hasActivityData ? (
                <>
                  <Row className="mb-4">
                    <Col md={4}>
                      <StatCard
                        title="Today's Steps"
                        value={today?.steps?.toLocaleString() ?? "0"}
                        sub={`${activeRange}d window`}
                        icon="steps"
                        sources={mode === "priority" ? [today?.chosenSource?.steps] : today?.sources || []}
                      />
                    </Col>
                    <Col md={4}>
                      <StatCard
                        title="Avg Steps"
                        value={avgSteps.toLocaleString()}
                        sub="Daily Average"
                        icon="muscle"
                        sources={mode === "priority" ? [today?.chosenSource?.steps] : today?.sources || []}
                      />
                    </Col>
                    <Col md={4}>
                      <StatCard title="Calories" value={`${totalCalories} kcal`} sub="Total Burn" icon="calories" sources={mode === "priority" ? [today?.chosenSource?.steps] : today?.sources || []} />
                    </Col>
                  </Row>

                  <div className="mb-4">
                    <CheckupSchedule appointments={filteredAppointments} />
                  </div>

                  <ActivityTable
                    data={sessions} // 3. PASS SESSIONS INSTEAD OF activityData
                    loading={loading}
                    activeRange={range}
                  />
                </>
              ) : (
                !loading && (
                  <div className="empty-state">
                    <h5>No activity data</h5>
                    <button className="btn btn-primary mt-2" onClick={() => setActiveTab("Devices")}>
                      Connect Device
                    </button>
                  </div>
                )
              )}
            </Col>

            <Col md={5} className="position-sticky top-0">
              <VitalStatCard todaySteps={today?.steps || 0} todayCalories={today?.calories || 0} />
            </Col>
          </Row>
        )}

        {activeTab === "Insights" && (
          <div className="insights-wrapper">
            <InsightsPage />
          </div>
        )}

        {activeTab === "Schedule" && (
          <div className="insights-wrapper">
            <SchedulePage />
          </div>
        )}
        {activeTab === "History" && (
          <div className="insights-wrapper">
            <HistoryPage />
          </div>
        )}
        {activeTab === "Activity" && (
          <div className="insights-wrapper">
            <ActivityPage setActiveTab={(e) => setActiveTab(e)} />
          </div>
        )}
        {activeTab === "Devices" && (
          <div className="insights-wrapper">
            <DeviceConnections />
          </div>
        )}
        {activeTab === "Blueprints" && (
          <div className="insights-wrapper">
            <ActiveBlueprint />
          </div>
        )}

        <BiomarkerSimulator />
        <AiChatPanel />
      </div>
    </Container>
  );
}
