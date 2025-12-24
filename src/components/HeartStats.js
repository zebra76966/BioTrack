import { Card } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import { heartRateData, heartStats } from "../data/dummyData";

import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale);

export default function HeartStats() {
  return (
    <Card className="heart-card">
      <h5>Your Heart Statistic</h5>

      <div className="heart-numbers">
        <div>
          <strong>{heartStats.avg}</strong>
          <span>Avg BPM</span>
        </div>
        <div>
          <strong>{heartStats.min}</strong>
          <span>Min BPM</span>
        </div>
        <div>
          <strong>{heartStats.max}</strong>
          <span>Max BPM</span>
        </div>
      </div>

      <Bar
        data={heartRateData}
        options={{
          plugins: { legend: { display: false } },
          scales: {
            y: { display: false },
            x: { display: false },
          },
          borderRadius: 12,
          barThickness: 18,
        }}
      />
    </Card>
  );
}
