import { Container, Row, Col } from "react-bootstrap";
import { useState } from "react";

import StatCard from "../components/StatCards";
// (Next components we’ll add)
import ActivityTimeline from "../components/activity/ActivityTimeline";
import ActivityTrendsCard from "../components/activity/ActivityTrendsCard";
import ActivityLogTable from "../components/activity/ActivityLogTable";
import { useActivityData } from "../hooks/useActivityData";
import toast from "react-hot-toast";
import api from "../auth/api";
import { motion } from "framer-motion";

import "../styles/activity.css";
import { FiRefreshCw } from "react-icons/fi";
import { useActivitySessions } from "../hooks/useActivitySessions";

export default function ActivityPage({ setActiveTab }) {
  const [range, setRange] = useState(7);
  const { data, loading } = useActivityData(range);

  const sessions = useActivitySessions(range);

  const hasActivityData = data && data.length > 0;
  const [activeRange, setActiveRange] = useState(7);

  const [syncing, setSyncing] = useState(false);

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

  function buildTimelineFromSessions(sessions) {
    const grouped = {};

    sessions.forEach((s) => {
      const day = new Date(s.start_time).toDateString();
      if (!grouped[day]) grouped[day] = [];
      grouped[day].push({
        type: "workout",
        title: s.activity_type,
        time: new Date(s.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        duration: `${s.duration_minutes} min`,
        intensity: s.duration_minutes > 40 ? "High" : "Moderate",
      });
    });

    return Object.entries(grouped)
      .sort((a, b) => new Date(b[0]) - new Date(a[0]))
      .map(([label, items]) => ({
        label,
        items,
      }));
  }

  const validDays = data.filter((d) => d.steps > 0);

  const today = data[data.length - 1];

  const avgSteps = validDays.length > 0 ? Math.round(validDays.reduce((s, d) => s + d.steps, 0) / validDays.length) : 0;

  const totalCalories = Math.round(validDays.reduce((s, d) => s + d.calories, 0));

  const activityStats = [
    {
      title: "Steps Today",
      value: today?.steps?.toLocaleString() ?? "--",
      sub: today ? "vs recent days" : "",
      icon: "steps",
    },
    {
      title: "Avg Daily Steps",
      value: avgSteps.toLocaleString(),
      sub: "Last 7 days",
      icon: "muscle",
    },
    {
      title: "Calories Burned",
      value: `${totalCalories} kcal`,
      sub: "Last 7 days",
      icon: "calories",
    },
  ];

  function buildTimeline(data) {
    const today = data[data.length - 1];
    const yesterday = data[data.length - 2];

    return [
      {
        label: "Today",
        items: today?.steps
          ? [
              {
                type: "walk",
                title: "Daily Movement",
                time: "All day",
                duration: `${Math.round(today.steps / 100)} min`,
                intensity: today.steps > 7000 ? "High" : "Moderate",
              },
            ]
          : [],
      },
      {
        label: "Yesterday",
        items: yesterday?.steps
          ? [
              {
                type: "walk",
                title: "Daily Movement",
                time: "All day",
                duration: `${Math.round(yesterday.steps / 100)} min`,
                intensity: "Moderate",
              },
            ]
          : [],
      },
    ];
  }

  return (
    <Container fluid>
      <div className="activity-shell">
        {/* Header */}

        {/* Summary stats */}
        <Row className="mb-4">
          <Col md={6}>
            <Row className="align-items-center mb-4">
              <Col>
                <div className="activity-header d-block">
                  <h2>Activity</h2>
                  <p className="muted">Track your movement, workouts, and daily activity patterns</p>
                </div>
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
                {activityStats.map((s, i) => (
                  <Col md={4} key={i}>
                    <StatCard {...s} />
                  </Col>
                ))}
              </Row>
            )}

            <ActivityTimeline data={buildTimelineFromSessions(sessions)} />
          </Col>

          <Col md={6}>
            {/* Placeholder for ActivityTrendsCard */}

            <ActivityTrendsCard data={data} />
          </Col>

          <Col md={12} className="mt-4">
            <ActivityLogTable data={sessions} />
          </Col>
        </Row>
      </div>
    </Container>
  );
}
