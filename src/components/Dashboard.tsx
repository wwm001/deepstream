import StreamCard from "./StreamCard";
import StatusPill from "./StatusPill";
import SectionHeader from "./SectionHeader";
import { dashboardCards } from "../dashboardCards";

function Dashboard() {
  return (
    <section>
      <SectionHeader
        title="Dashboard"
        description="ここにメインの情報表示エリアを作っていきます。"
        right={
          <StatusPill
            label={`表示カード数: ${dashboardCards.length}`}
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
        {dashboardCards.map((card) => (
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