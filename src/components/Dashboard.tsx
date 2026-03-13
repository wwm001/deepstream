import StreamCard from "./StreamCard";
import StatusPill from "./StatusPill";
import { dashboardCards } from "../dashboardCards";

function Dashboard() {
  return (
    <section>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2 style={{ marginTop: 0, marginBottom: "8px" }}>Dashboard</h2>
          <p
            style={{
              margin: 0,
              color: "#4b5563",
              lineHeight: 1.6,
            }}
          >
            ここにメインの情報表示エリアを作っていきます。
          </p>
        </div>

        <StatusPill
          label={`表示カード数: ${dashboardCards.length}`}
          tone="gray"
          uppercase={false}
        />
      </div>

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