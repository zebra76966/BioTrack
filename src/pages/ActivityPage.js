import { Container, Row, Col } from "react-bootstrap";
import { useState } from "react";

import StatCard from "../components/StatCards";
// (Next components we’ll add)
import ActivityTimeline from "../components/activity/ActivityTimeline";
import ActivityTrendsCard from "../components/activity/ActivityTrendsCard";
import ActivityLogTable from "../components/activity/ActivityLogTable";

import "../styles/activity.css";

/* Dummy summary stats */
const activityStats = [
  {
    title: "Steps Today",
    value: "8,420",
    sub: "+12% vs yesterday",
    icon: "steps",
  },
  {
    title: "Active Minutes",
    value: "74 min",
    sub: "Moderate intensity",
    icon: "muscle",
  },
  {
    title: "Calories Burned",
    value: "540 kcal",
    sub: "Above average",
    icon: "calories",
  },
];

export default function ActivityPage() {
  return (
    <Container fluid>
      <div className="activity-shell">
        {/* Header */}

        {/* Summary stats */}
        <Row className="mb-4">
          <Col md={6}>
            <div className="activity-header d-block">
              <h2>Activity</h2>
              <p className="muted">Track your movement, workouts, and daily activity patterns</p>
            </div>

            <Row className="mb-4">
              {activityStats.map((s, i) => (
                <Col md={4} key={i}>
                  <StatCard {...s} />
                </Col>
              ))}
            </Row>

            <ActivityTimeline />
          </Col>

          <Col md={6}>
            {/* Placeholder for ActivityTrendsCard */}

            <ActivityTrendsCard />
          </Col>

          <Col md={12} className="mt-4">
            <ActivityLogTable />
          </Col>
        </Row>
      </div>
    </Container>
  );
}
