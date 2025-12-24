import ImpactCard from "./ImpactCard";
import "./ImpactCard.css";

export default function ImpactList({ title, type, items }) {
  return (
    <div className="impact-section">
      <h6 className={`impact-section-title ${type}`}>{title}</h6>

      <div className="impact-list">
        {items
          .filter((i) => i.type === type)
          .map((i) => (
            <ImpactCard key={i.key} {...i} />
          ))}
      </div>
    </div>
  );
}
