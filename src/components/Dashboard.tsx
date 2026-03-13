import StreamCard from "./StreamCard";
import { dashboardCards } from "../dashboardCards";

function Dashboard() {
  return (
    <section>
      <h2 style={{ marginTop: 0 }}>Dashboard</h2>
      <p>ここにメインの情報表示エリアを作っていきます。</p>

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