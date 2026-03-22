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
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const [viewportWidth, setViewportWidth] = useState<number>(() =>
    typeof window === "undefined" ? 1280 : window.innerWidth
  );

  const isPhoneLayout = viewportWidth < 640;
  const isCompactHeader = viewportWidth < 900;

  useEffect(() => {
    writeStorageJSON(
      STORAGE_KEYS.currentSection,
      currentSection,
      STORAGE_NAMESPACE
    );
  }, [currentSection]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    if (isNavigationOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = previousOverflow || "";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isNavigationOpen]);

  const handleSelectSection = (section: NavigationSection) => {
    setCurrentSection(section);
    setIsNavigationOpen(false);
  };

  const navigationOverlay = isNavigationOpen ? (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      onClick={() => setIsNavigationOpen(false)}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(15, 23, 42, 0.42)",
        backdropFilter: "blur(2px)",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "stretch",
      }}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          width: isPhoneLayout ? "100%" : "380px",
          maxWidth: "100%",
          height: "100%",
          background: "#f8fafc",
          boxShadow: "12px 0 32px rgba(15, 23, 42, 0.18)",
          padding: isPhoneLayout ? "14px 12px 20px" : "18px 16px 24px",
          boxSizing: "border-box",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            marginBottom: "12px",
          }}
        >
          <div
            style={{
              display: "grid",
              gap: "4px",
              minWidth: 0,
            }}
          >
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#64748b",
              }}
            >
              Navigation
            </span>
            <span
              style={{
                fontSize: "15px",
                lineHeight: 1.4,
                fontWeight: 700,
                color: "#0f172a",
                wordBreak: "break-word",
              }}
            >
              現在地: {currentSection}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsNavigationOpen(false)}
            aria-label="Close navigation menu"
            style={{
              minWidth: "44px",
              minHeight: "44px",
              borderRadius: "12px",
              border: "1px solid #dbe4f0",
              background: "#ffffff",
              color: "#334155",
              fontSize: "20px",
              fontWeight: 700,
              cursor: "pointer",
              touchAction: "manipulation",
              flexShrink: 0,
            }}
          >
            ×
          </button>
        </div>

        <PageCard>
          <Sidebar
            currentSection={currentSection}
            onSelectSection={handleSelectSection}
          />
        </PageCard>
      </div>
    </div>
  ) : null;

  return (
    <AppLayout
      header={
        <Header
          currentSection={currentSection}
          onOpenNavigation={() => setIsNavigationOpen(true)}
          isNavigationOpen={isNavigationOpen}
          isCompact={isCompactHeader}
        />
      }
      content={
        <PageCard>
          <Dashboard
            currentSection={currentSection}
            onSelectSection={handleSelectSection}
          />
        </PageCard>
      }
      footer={<Footer />}
      overlay={navigationOverlay}
    />
  );
}

export default App;