import { Container, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";

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
  const [mode, setMode] = useState("smart");

  // const { data, loading } = useActivityData(range);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [priority, setPriority] = useState({
    steps: "apple_health",
    calories: "apple_health",
    distance: "apple_health",
  });

  const sessions = useActivitySessions(range, refreshKey);

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

      await fetchMerged();
      setRefreshKey((prev) => prev + 1);

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
        intensity: s.duration_minutes > 45 ? "High" : s.duration_minutes > 20 ? "Moderate" : "Light",
        source: s.source || "apple_health", // <-- ADD THIS LINE
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
      title: "Latest Day Steps",
      value: today?.steps?.toLocaleString() ?? "--",
      sub: `${range} day window`,
      icon: "steps",
      sources: mode === "priority" ? [today?.chosenSource?.steps] : today?.sources || [],
    },
    {
      title: "Avg Daily Steps",
      value: avgSteps.toLocaleString(),
      sub: `Last ${range} days`,
      icon: "muscle",
      sources: mode === "priority" ? [today?.chosenSource?.steps] : today?.sources || [],
    },
    {
      title: "Calories Burned",
      value: `${totalCalories} kcal`,
      sub: `Last ${range} days`,
      icon: "calories",
      sources: mode === "priority" ? [today?.chosenSource?.calories] : today?.sources || [],
    },
  ];

  // function buildTimeline(data) {
  //   const today = data[data.length - 1];
  //   const yesterday = data[data.length - 2];

  //   return [
  //     {
  //       label: "Today",
  //       items: today?.steps
  //         ? [
  //             {
  //               type: "walk",
  //               title: "Daily Movement",
  //               time: "All day",
  //               duration: `${Math.round(today.steps / 120)} min`,
  //               intensity: today.steps > 7000 ? "High" : "Moderate",
  //             },
  //           ]
  //         : [],
  //     },
  //     {
  //       label: "Yesterday",
  //       items: yesterday?.steps
  //         ? [
  //             {
  //               type: "walk",
  //               title: "Daily Movement",
  //               time: "All day",
  //               duration: `${Math.round(yesterday.steps / 100)} min`,
  //               intensity: "Moderate",
  //             },
  //           ]
  //         : [],
  //     },
  //   ];
  // }
  function buildTimeline(data) {
    const today = data[data.length - 1];

    if (!today?.steps) return [];

    return [
      {
        label: "Today",
        items: [
          {
            type: "walk",
            title: "Daily Steps",
            time: "All day",
            duration: `${today.steps.toLocaleString()} steps`,
            intensity: today.steps > 8000 ? "High" : "Moderate",
          },
        ],
      },
    ];
  }

  const fetchMerged = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/activity/merged`, {
        params: {
          days: range,
          mode,
          priority: JSON.stringify(priority),
        },
      });
      setData(res.data);
    } catch (e) {
      console.error("Failed to fetch merged data", e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchMerged();
  }, [range, mode, priority]);

  // const timelineData = sessions.length > 0 ? buildTimelineFromSessions(sessions) : buildTimeline(data);
  // const timelineData = sessions.length > 0 ? buildTimelineFromSessions(sessions) : buildTimeline(data);
  const displaySessions =
    mode === "priority"
      ? sessions.filter((s) => {
          if (s.activity_type.toLowerCase().includes("walk")) {
            return s.source === priority.steps;
          }
          return s.source === priority.calories; // Default priority for other workouts
        })
      : sessions;

  // Use displaySessions for the timeline and table
  const timelineData = displaySessions.length > 0 ? buildTimelineFromSessions(displaySessions) : buildTimeline(data);

  return (
    <Container fluid>
      <div className="activity-shell">
        {/* Header */}

        {console.log("activity", sessions)}
        {console.log("activityTimeline", timelineData)}

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

                <motion.div className="mode-toggle" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
                  {["smart", "priority"].map((m) => (
                    <button key={m} className={`toggle-btn ${mode === m ? "active" : ""}`} onClick={() => setMode(m)}>
                      {m === "smart" ? "Smart" : m === "priority" ? "Priority" : "Raw"}
                    </button>
                  ))}
                </motion.div>

                {mode === "priority" && (
                  <div className="d-flex gap-2 animate-fade-in">
                    <select className="top-nav-select" value={priority.steps} onChange={(e) => setPriority({ ...priority, steps: e.target.value })}>
                      <option value="apple_health">Steps: Apple</option>
                      <option value="google_fit">Steps: Fit</option>
                    </select>
                    <select className="top-nav-select" value={priority.calories} onChange={(e) => setPriority({ ...priority, calories: e.target.value })}>
                      <option value="apple_health">Burn: Apple</option>
                      <option value="google_fit">Burn: Fit</option>
                    </select>
                  </div>
                )}

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

            {/* <ActivityTimeline data={buildTimelineFromSessions(sessions)} /> */}
            <ActivityTimeline data={timelineData} />
          </Col>

          <Col md={6}>
            {/* Placeholder for ActivityTrendsCard */}

            <ActivityTrendsCard data={data} />
          </Col>

          <Col md={12} className="mt-4">
            <ActivityLogTable data={displaySessions} />
          </Col>
        </Row>
      </div>
    </Container>
  );
}
