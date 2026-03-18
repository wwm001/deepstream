import { useEffect, useState } from "react";
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
import { STORAGE_KEYS } from "./utils/storageKeys";
import {
  readStorageJSON,
  writeStorageJSON,
} from "./utils/safeLocalStorage";

const STORAGE_NAMESPACE = "App";

function isNavigationSection(value: unknown): value is NavigationSection {
  return (
    typeof value === "string" &&
    navigationItems.includes(value as NavigationSection)
  );
}

function readStoredCurrentSection(): NavigationSection {
  const fallback = navigationItems[0];
  const parsed = readStorageJSON<unknown>(
    STORAGE_KEYS.currentSection,
    STORAGE_NAMESPACE,
    fallback
  );

  return isNavigationSection(parsed) ? parsed : fallback;
}

function App() {
  const [currentSection, setCurrentSection] = useState<NavigationSection>(() =>
    readStoredCurrentSection()
  );

  useEffect(() => {
    writeStorageJSON(
      STORAGE_KEYS.currentSection,
      currentSection,
      STORAGE_NAMESPACE
    );
  }, [currentSection]);

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
          <Dashboard
            currentSection={currentSection}
            onSelectSection={setCurrentSection}
          />
        </PageCard>
      }
      footer={<Footer />}
    />
  );
}

export default App;