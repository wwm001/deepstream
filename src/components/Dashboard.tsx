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
        <article
          style={{
            padding: "16px",
            borderRadius: "10px",
            background: "#f3f4f6",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Now Status</h3>
          <p style={{ marginBottom: 0 }}>DeepStream は起動中です。</p>
        </article>

        <article
          style={{
            padding: "16px",
            borderRadius: "10px",
            background: "#f3f4f6",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Recent Activity</h3>
          <p style={{ marginBottom: 0 }}>コンポーネント分割を進行中です。</p>
        </article>

        <article
          style={{
            padding: "16px",
            borderRadius: "10px",
            background: "#f3f4f6",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Next Mission</h3>
          <p style={{ marginBottom: 0 }}>データ構造と画面設計を追加します。</p>
        </article>
      </div>
    </section>
  );
}

export default Dashboard;