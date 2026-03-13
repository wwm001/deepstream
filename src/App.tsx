import { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Footer from "./components/Footer";
import PageCard from "./components/PageCard";
import AppLayout from "./components/AppLayout";
import {
  navigationItems,
  type NavigationSection,
} from "./navigationItems";

function App() {
  const [currentSection, setCurrentSection] = useState<NavigationSection>(
    navigationItems[0]
  );

  return (
    <AppLayout
      header={<Header />}
      sidebar={
        <PageCard>
          <Sidebar
            currentSection={currentSection}
            onSelectSection={setCurrentSection}
          />
        </PageCard>
      }
      content={
        <PageCard>
          <Dashboard currentSection={currentSection} />
        </PageCard>
      }
      footer={<Footer />}
    />
  );
}

export default App;