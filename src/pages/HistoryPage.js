import { Container, Row, Col } from "react-bootstrap";
import { useState } from "react";

// import "../styles/history.css";

import HistoryTimeline from "../components/history/HistoryTimeline";
import HistoryTable from "../components/history/HistoryTable";
import HistoryFilters from "../components/history/HistoryFilters";
import HistoryDetailDrawer from "../components/history/HistoryDetailDrawer";

export default function HistoryPage() {
  const [filter, setFilter] = useState("All");

  /* Dummy history records */
  const records = [
    {
      type: "labs",
      title: "Hormone Panel",
      date: "Apr 18, 2024",
      provider: "HealthPlus Diagnostics",
      status: "completed",
    },
    {
      type: "medical",
      title: "Dental Checkup",
      date: "Apr 10, 2024",
      provider: "City Dental Clinic",
      status: "completed",
    },
    {
      type: "recovery",
      title: "Recovery Session",
      date: "Apr 08, 2024",
      provider: "Coach Alex",
      status: "completed",
    },
    {
      type: "labs",
      title: "Lipid Panel",
      date: "Mar 30, 2024",
      provider: "HealthPlus Diagnostics",
      status: "completed",
    },
  ];

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const filteredRecords = records.filter((r) => {
    const matchesFilter = filter === "All" || r.type === filter.toLowerCase() || (filter === "Appointments" && r.type === "medical");

    const matchesQuery = r.title.toLowerCase().includes(query.toLowerCase()) || r.provider.toLowerCase().includes(query.toLowerCase());

    return matchesFilter && matchesQuery;
  });

  return (
    <Container fluid>
      <div className="history-shell">
        {/* Top navigation */}

        {/* Page header */}

        {/* Filters (next step) */}
        <Row className="mb-3">
          <Col md={8}>
            {/* Placeholder for HistoryFilters */}

            <div className="history-header mb-4">
              <h2>History</h2>
              <p className="muted">A complete record of your appointments, labs, and recovery sessions</p>
            </div>
            <HistoryFilters active={filter} setActive={setFilter} />
            <HistoryTable filter={filter} records={filteredRecords} onSelect={setSelected} />

            <HistoryDetailDrawer record={selected} onClose={() => setSelected(null)} />
          </Col>

          <Col md={4}>
            <HistoryTimeline filter={filter} />
          </Col>
        </Row>
      </div>
    </Container>
  );
}
