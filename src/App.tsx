import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Footer from "./components/Footer";

function App() {
  return (
    <main style={{ minHeight: "100vh", padding: "40px" }}>
      <Header />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "240px 1fr",
          gap: "24px",
          marginTop: "32px",
        }}
      >
        <section
          style={{
            background: "#ffffff",
            padding: "24px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
          }}
        >
          <Sidebar />
        </section>

        <section
          style={{
            background: "#ffffff",
            padding: "24px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
          }}
        >
          <Dashboard />
        </section>
      </div>

      <Footer />
    </main>
  );
}

export default App;