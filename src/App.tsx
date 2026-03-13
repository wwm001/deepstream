import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Footer from "./components/Footer";
import PageCard from "./components/PageCard";

function App() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px 24px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <Header />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "240px 1fr",
          gap: "24px",
          marginTop: "32px",
        }}
      >
        <PageCard>
          <Sidebar />
        </PageCard>

        <PageCard>
          <Dashboard />
        </PageCard>
      </div>

      <Footer />
    </main>
  );
}

export default App;