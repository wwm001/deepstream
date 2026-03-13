import StreamCard from "./StreamCard";

function Dashboard() {
  return (
    <section>
      <h2 style={{ marginTop: 0 }}>Dashboard</h2>
      <p>ここにメインの情報表示エリアを作っていきます。</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
          marginTop: "24px",
        }}
      >
        <StreamCard
          title="Now Status"
          description="DeepStream は起動中です。"
        />
        <StreamCard
          title="Recent Activity"
          description="コンポーネント分割を進行中です。"
        />
        <StreamCard
          title="Next Mission"
          description="データ構造と画面設計を追加します。"
        />
      </div>
    </section>
  );
}

export default Dashboard;