import { Container, Row, Col } from "react-bootstrap";
import CheckupSchedule from "../components/CheckupSchedule";
import CalendarOverview from "../components/schedule/CalendarOverview";
import "../styles/schedule.css";
import TodayTimeline from "../components/schedule/TodayTimeline";
import ScheduleFilters from "../components/schedule/ScheduleFilters";
import { useState } from "react";

export default function SchedulePage() {
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
    <Container fluid>
      <div className="schedule-shell">
        {/* Main Row */}
        <Row>
          {/* LEFT */}
          <Col md={8}>
            <div className="schedule-header d-block">
              <h2>Schedule</h2>
              <p className="muted d-block">Manage your appointments, checkups, and bookings</p>
            </div>
            <ScheduleFilters active={filter} setActive={setFilter} />
            <CheckupSchedule mode="full" appointments={filteredAppointments} />
          </Col>

          {/* RIGHT */}
          <Col md={4}>
            <CalendarOverview />
            <TodayTimeline />
          </Col>
        </Row>
      </div>
    </Container>
  );
}
