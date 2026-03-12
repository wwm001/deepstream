function App() {
  return (
    <main style={{ minHeight: "100vh", padding: "40px" }}>
      <header style={{ marginBottom: "32px" }}>
        <h1 style={{ margin: 0, fontSize: "32px" }}>DeepStream</h1>
        <p style={{ marginTop: "8px" }}>
          DeepStream アプリのベース画面です。
        </p>
      </header>

      <section
        style={{
          background: "#ffffff",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        }}
      >
        <h2 style={{ marginTop: 0 }}>現在の状態</h2>
        <p>React + TypeScript + Vite の初期環境が動作しています。</p>
      </section>
    </main>
  );
}

export default App;