import StreamCard from "./StreamCard";
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
          <p style={{ margin: 0 }}>ここにメインの情報表示エリアを作っていきます。</p>
        </div>

        <p
          style={{
            margin: 0,
            fontSize: "14px",
            color: "#6b7280",
            fontWeight: 600,
          }}
        >
          表示カード数: {dashboardCards.length}
        </p>
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
          />
        ))}
      </div>
    </section>
  );
}

export default Dashboard;