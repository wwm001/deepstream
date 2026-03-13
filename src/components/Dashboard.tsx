import StreamCard from "./StreamCard";
import StatusPill from "./StatusPill";
import SectionHeader from "./SectionHeader";
import {
  dashboardCardsBySection,
  dashboardSectionDescriptions,
} from "../dashboardCards";
import type { NavigationSection } from "../navigationItems";

type DashboardProps = {
  currentSection: NavigationSection;
};

function Dashboard({ currentSection }: DashboardProps) {
  const cards = dashboardCardsBySection[currentSection];
  const description = dashboardSectionDescriptions[currentSection];

  return (
    <section>
      <SectionHeader
        title={`${currentSection} Dashboard`}
        description={description}
        right={
          <StatusPill
            label={`表示カード数: ${cards.length}`}
            tone="gray"
            uppercase={false}
          />
        }
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginTop: "24px",
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
    </section>
  );
}

export default Dashboard;