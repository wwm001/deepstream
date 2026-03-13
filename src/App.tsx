import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Footer from "./components/Footer";
import PageCard from "./components/PageCard";
import AppLayout from "./components/AppLayout";

function App() {
  return (
    <AppLayout
      header={<Header />}
      sidebar={
        <PageCard>
          <Sidebar />
        </PageCard>
      }
      content={
        <PageCard>
          <Dashboard />
        </PageCard>
      }
      footer={<Footer />}
    />
  );
}

export default App;