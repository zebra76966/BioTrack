import ImpactCard from "./ImpactCard";
import "./ImpactCard.css";

export default function ImpactList({ title, type, items }) {
  return (
    <div className="impact-section mt-0">
      <h6 className={`impact-section-title ${type}`}>{title}</h6>

      <div className="impact-list">
        {items.map((i, index) => (
          <ImpactCard key={`${i.label}-${index}`} {...i} />
        ))}
      </div>
    </div>
  );
}
