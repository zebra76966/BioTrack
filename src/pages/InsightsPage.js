import { Row, Col } from "react-bootstrap";
import { BASE_SCORE, FINAL_SCORE, impacts, actions, confidence, notes } from "../data/healthInsights";

import OverallHealthCard from "../components/insights/OverallHealthCard";
import ConfidenceCard from "../components/insights/ConfidenceCard";
import NotesCard from "../components/insights/NotesCard";
import WaterfallCard from "../components/insights/WaterfallCard";
import ImpactList from "../components/insights/ImpactList";
import ActionsCard from "../components/insights/ActionsCard";

import "../styles/insights.css";
import HormoneTrendsCard from "../components/insights/HormoneTrendsCard";

export default function InsightsPage() {
  return (
    <div className="insights-page">
      <Row className="g-4">
        {/* LEFT COLUMN */}
        <Col md={8}>
          <header className="insights-header">
            <h2>Health Insights</h2>
            <p className="muted">Understand what’s impacting your overall health score</p>
          </header>
          <OverallHealthCard score={FINAL_SCORE} />

          <Row className="g-4">
            <Col md={4}>
              <ImpactList title="Negative Contributors" type="negative" items={impacts} />

              <ImpactList title="Positive Contributors" type="positive" items={impacts} />
            </Col>

            <Col md={8}>
              <HormoneTrendsCard />
              <WaterfallCard base={BASE_SCORE} impacts={impacts} />
            </Col>
          </Row>
        </Col>

        {/* RIGHT COLUMN */}
        <Col md={4}>
          <ConfidenceCard confidence={confidence} />
          <ActionsCard actions={actions} />
          <NotesCard notes={notes} />
        </Col>
      </Row>
    </div>
  );
}
