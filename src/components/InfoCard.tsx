import "./InfoCard.css";

interface InfoCardProps {
  heading: string;
  items: { label: string; value?: string }[];
}

export default function InfoCard({ heading, items }: InfoCardProps) {
  return (
    <div className="info-card">
      <h3 className="info-card__heading">{heading}</h3>
      <ul className="info-card__list">
        {items.map((item) => (
          <li key={item.label} className="info-card__item">
            <span className="info-card__label">{item.label}</span>
            {item.value && <span className="info-card__value">{item.value}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
