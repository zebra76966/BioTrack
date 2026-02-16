import { Container, Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import TopTabs from "../components/TopTabs";

import StatCard from "../components/StatCards";
import HeartStats from "../components/HeartStats";
import ActivityTable from "../components/ActivityTable";
import { stats } from "../data/dummyData";

import "../styles/dashboard.css";
import VitalStatCard from "../components/VitalStatCard";
import CheckupSchedule from "../components/CheckupSchedule";
import InsightsPage from "./InsightsPage";
import SchedulePage from "./SchedulePage";
import HistoryPage from "./HistoryPage";
import ActivityPage from "./ActivityPage";
import DeviceConnections from "../components/devices/DeviceConnections";
import { FiRefreshCw } from "react-icons/fi";

import { useActivityTrends } from "../hooks/useActivityTrends";
import { useNavigate } from "react-router-dom";
import api from "../auth/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [range, setRange] = useState(7);
  const [activeRange, setActiveRange] = useState(7);

  const [syncing, setSyncing] = useState(false);

  const { data: activityData, loading, refetch } = useActivityTrends(range, activeTab === "Dashboard");

  useEffect(() => {
    if (activeTab === "Dashboard") {
      refetch();
      toast.dismiss();
      toast("Refreshing activity data…", {
        duration: 1200,
        position: "bottom-center",
      });
    }
  }, [activeTab]);

  const hasActivityData = activityData && activityData.length > 0;

  const syncActivity = async () => {
    try {
      setSyncing(true);

      toast.loading(`Syncing last ${range} days…`, {
        id: "activity-sync",
        position: "bottom-center",
      });

      await api.post("/sync/manual", { days: range });

      toast.success("Activity synced successfully ", {
        id: "activity-sync",
        position: "bottom-center",
      });
      setActiveRange(range);
    } catch (e) {
      toast.error("Failed to sync activity ❌", {
        id: "activity-sync",
        position: "bottom-center",
      });
    } finally {
      setSyncing(false);
    }
  };

  // days where user actually walked
  const activeDays = hasActivityData ? activityData.filter((d) => d.steps > 0) : [];

  const totalSteps = hasActivityData ? activityData.reduce((sum, d) => sum + d.steps, 0) : 0;

  const avgSteps = activeDays.length > 0 ? Math.round(activeDays.reduce((sum, d) => sum + d.steps, 0) / activeDays.length) : 0;

  const totalCalories = hasActivityData ? Math.round(activityData.reduce((sum, d) => sum + d.calories, 0)) : 0;

  const totalDistance = hasActivityData ? (activityData.reduce((sum, d) => sum + d.distance, 0) / 1000).toFixed(1) : "0.0";

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
              <Row className="align-items-center mb-4">
                <Col>
                  <h2 className="page-title mb-1">Overview Of Your Health</h2>
                  <p className="page-subtitle mb-0">Harmonious Living: Balance, Strength, Vitality, Wellness.</p>
                </Col>

                <Col xs="auto" className="d-flex align-items-center gap-3">
                  {/* RANGE TOGGLE */}
                  <motion.div className="range-toggle" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
                    {[7, 30].map((d) => (
                      <button key={d} className={`toggle-btn ${range === d ? "active" : ""}`} onClick={() => setRange(d)}>
                        {d} Days
                      </button>
                    ))}
                  </motion.div>

                  {/* SYNC BUTTON */}
                  <motion.button className="sync-activity-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} disabled={syncing} onClick={syncActivity}>
                    {syncing ? (
                      <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                        <FiRefreshCw />
                      </motion.span>
                    ) : (
                      <FiRefreshCw />
                    )}
                    <span>Resync</span>
                  </motion.button>
                </Col>
              </Row>

              {/* EMPTY STATE — NO DEVICE / NO DATA */}
              {!loading && !hasActivityData && (
                <div className="empty-state mb-4">
                  <h5>No activity data yet</h5>
                  <p className="text-muted">Connect Google Fit to start tracking your health insights.</p>
                  <button className="btn btn-primary" onClick={() => setActiveTab("Devices")}>
                    Connect Device
                  </button>
                </div>
              )}

              {/* STAT CARDS — ONLY IF DATA EXISTS */}
              {hasActivityData && (
                <Row className="mb-4">
                  <Col md={4}>
                    <StatCard title={`Avg Steps (${activeRange} days)`} value={avgSteps} sub="steps" icon="steps" />
                  </Col>

                  <Col md={4}>
                    <StatCard title={`Total Calories Burned (${activeRange} days)`} value={totalCalories} sub="kcal" icon="calories" />
                  </Col>

                  <Col md={4}>
                    <StatCard title={`Total Distance (${activeRange} days)`} value={totalDistance} sub="km" icon="muscle" />
                  </Col>
                </Row>
              )}

              <div className="mb-4">
                <CheckupSchedule appointments={filteredAppointments} />
              </div>
              <ActivityTable range={range} activeRange={activeRange} />
            </Col>

            <Col md={5} className="position-sticky top-0 start-0">
              <VitalStatCard />
              {/* <HeartStats /> */}
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
      </div>
    </Container>
  );
}
