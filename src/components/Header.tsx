import { appMeta } from "../appMeta";
import type { NavigationSection } from "../navigationItems";
import StatusPill from "./StatusPill";

type HeaderProps = {
  currentSection: NavigationSection;
  onOpenNavigation: () => void;
  isNavigationOpen: boolean;
  isCompact: boolean;
};

function Header({
  currentSection,
  onOpenNavigation,
  isNavigationOpen,
  isCompact,
}: HeaderProps) {
  return (
    <header
      style={{
        display: "grid",
        gap: "12px",
        marginBottom: "4px",
      }}
    >
      <div
        style={{
          padding: isCompact ? "16px 14px" : "20px 22px",
          borderRadius: "18px",
          border: "1px solid #dbe4f0",
          background:
            "linear-gradient(135deg, #ffffff 0%, #f8fafc 46%, #eef6ff 100%)",
          boxShadow: "0 12px 24px rgba(15, 23, 42, 0.05)",
        }}
      >
        <div
          style={{
            display: "grid",
            gap: isCompact ? "14px" : "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "grid",
                gap: "8px",
                minWidth: 0,
                flex: "1 1 320px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#475569",
                }}
              >
                Command Deck
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  flexWrap: "wrap",
                }}
              >
                <StatusPill label={appMeta.badge} tone="indigo" />
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "4px 10px",
                    minHeight: "28px",
                    borderRadius: "999px",
                    border: "1px solid #dbe4f0",
                    background: "#ffffff",
                    color: "#475569",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                  }}
                >
                  {currentSection}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenNavigation}
              aria-label="Open navigation menu"
              aria-pressed={isNavigationOpen}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "44px",
                minHeight: "44px",
                borderRadius: "12px",
                border: isNavigationOpen
                  ? "1px solid #bfdbfe"
                  : "1px solid #dbe4f0",
                background: isNavigationOpen ? "#eff6ff" : "#ffffff",
                cursor: "pointer",
                flexShrink: 0,
                touchAction: "manipulation",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  display: "grid",
                  gap: "4px",
                }}
              >
                <span
                  style={{
                    display: "block",
                    width: "18px",
                    height: "2px",
                    borderRadius: "999px",
                    background: "#334155",
                  }}
                />
                <span
                  style={{
                    display: "block",
                    width: "18px",
                    height: "2px",
                    borderRadius: "999px",
                    background: "#334155",
                  }}
                />
                <span
                  style={{
                    display: "block",
                    width: "18px",
                    height: "2px",
                    borderRadius: "999px",
                    background: "#334155",
                  }}
                />
              </span>
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gap: "8px",
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: isCompact ? "30px" : "34px",
                lineHeight: 1.08,
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: "#0f172a",
                wordBreak: "break-word",
              }}
            >
              {appMeta.title}
            </h1>

            <p
              style={{
                margin: 0,
                color: "#334155",
                lineHeight: 1.65,
                fontSize: isCompact ? "14px" : "15px",
                fontWeight: 500,
                maxWidth: "760px",
              }}
            >
              {appMeta.subtitle}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;