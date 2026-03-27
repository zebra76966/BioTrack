import { Row, Col, Spinner } from "react-bootstrap";
import { useState, useEffect } from "react";
import api from "../auth/api";

import { notes } from "../data/healthInsights";

// Components
import OverallHealthCard from "../components/insights/OverallHealthCard";
import ConfidenceCard from "../components/insights/ConfidenceCard";
import NotesCard from "../components/insights/NotesCard";
import WaterfallCard from "../components/insights/WaterfallCard";
import ImpactList from "../components/insights/ImpactList";
import ActionsCard from "../components/insights/ActionsCard";
import MetabolicHealthCard from "../components/insights/MetabolicHealthCard";
import HormoneTrendsCard from "../components/insights/HormoneTrendsCard";

import "../styles/insights.css";
import AiBadge from "../utils/aibadge";

export default function InsightsPage() {
  const [metabolicData, setMetabolicData] = useState(null);
  const [aiInsights, setAiInsights] = useState(null); // New state for AI
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch both CGM data and the AI Analysis in parallel
        const [metabolicRes, aiRes] = await Promise.all([api.get("/insights/metabolic-full"), api.get("/insights/ai-generate")]);

        setMetabolicData(metabolicRes.data);
        setAiInsights(aiRes.data);
      } catch (err) {
        console.error("Failed to fetch health insights", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
        <Spinner animation="border" variant="warning" />
      </div>
    );
  }

  return (
    <div className="insights-page">
      <Row className="g-4">
        {/* LEFT COLUMN */}
        <Col md={8}>
          <header className="insights-header">
            <h2>Health Insights</h2>
            <p className="muted">Understand what’s impacting your overall health score</p>
          </header>

          {/* Uses metabolicScore from AI response */}

          <OverallHealthCard score={aiInsights?.metabolicScore || 0} />

          <MetabolicHealthCard data={metabolicData} />

          <Row className="g-4">
            <Col md={4}>
              <div>
                <AiBadge text="AI Verified" /> {/* Using custom text */}
              </div>
              {/* Filter AI contributors for Negative items */}
              <ImpactList title="Negative Contributors" type="negative" items={aiInsights?.contributors?.filter((i) => i.type === "negative") || []} />

              {/* Filter AI contributors for Positive items */}
              <ImpactList title="Positive Contributors" type="positive" items={aiInsights?.contributors?.filter((i) => i.type === "positive") || []} />
            </Col>

            <Col md={8}>
              <HormoneTrendsCard />
              {/* Waterfall can use the filtered contributors for its visualization */}
              <WaterfallCard base={85} impacts={aiInsights?.contributors || []} />
            </Col>
          </Row>
        </Col>

        {/* RIGHT COLUMN */}
        <Col md={4}>
          {/* Dynamic AI Confidence and Actions */}
          <ConfidenceCard
            confidence={{
              value: aiInsights?.stabilityStatus === "Stable" ? 0.92 : 0.75,
              label: aiInsights?.stabilityStatus || "Analyzing",
              reason: aiInsights?.stabilityStatus === "Stable" ? "High data consistency from Dexcom & Google Fit." : "Variability detected in recent glucose readings.",
            }}
          />

          <ActionsCard actions={aiInsights?.suggestedActions || []} />

          <NotesCard notes={notes} />
        </Col>
      </Row>
    </div>
  );
}
