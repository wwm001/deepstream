import Header from "./components/Header";

function App() {
  return (
    <main style={{ minHeight: "100vh", padding: "40px" }}>
      <Header />

      <section
        style={{
          background: "#ffffff",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
          marginTop: "32px",
        }}
      >
        <h2 style={{ marginTop: 0 }}>現在の状態</h2>
        <p>React + TypeScript + Vite の初期環境が動作しています。</p>
      </section>
    </main>
  );
}

export default App;