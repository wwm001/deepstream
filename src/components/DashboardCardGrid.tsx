import StreamCard from "./StreamCard";
import type { DashboardCard } from "../types";

type DashboardCardGridProps = {
  cards: DashboardCard[];
};

function DashboardCardGrid({ cards }: DashboardCardGridProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "16px",
      }}
    >
      {cards.map((card) => (
        <StreamCard
          key={card.title}
          title={card.title}
          description={card.description}
          type={card.type}
        />
      ))}
    </div>
  );
}

export default DashboardCardGrid;