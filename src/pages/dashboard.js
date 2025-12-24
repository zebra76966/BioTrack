import { Container, Row, Col } from "react-bootstrap";
import { useState } from "react";
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

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");

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

  const [filter, setFilter] = useState("All");

  const filteredAppointments = filter === "All" ? appointments : appointments.filter((a) => a.type.toLowerCase() === filter.toLowerCase());

  return (
    <Container fluid className="app-bg">
      <div className="dashboard-shell">
        <TopTabs active={activeTab} setActive={setActiveTab} />

        {activeTab === "Dashboard" && (
          <Row>
            <Col md={7}>
              <h2 className="page-title">Overview Of Your Health</h2>
              <p className="page-subtitle">Harmonious Living: Balance, Strength, Vitality, Wellness.</p>

              <Row className="mb-4">
                {stats.map((s, i) => (
                  <Col md={4} key={i}>
                    <StatCard {...s} />
                  </Col>
                ))}
              </Row>

              <div className="mb-4">
                <CheckupSchedule appointments={filteredAppointments} />
              </div>
              <ActivityTable />
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
            <ActivityPage />
          </div>
        )}
      </div>
    </Container>
  );
}
