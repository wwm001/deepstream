import {
  navigationItems,
  type NavigationSection,
} from "../navigationItems";

type SidebarProps = {
  currentSection: NavigationSection;
  onSelectSection: (section: NavigationSection) => void;
};

const sectionMeta: Record<
  NavigationSection,
  {
    shortLabel: string;
    color: string;
    background: string;
    border: string;
    accent: string;
  }
> = {
  ホーム: {
    shortLabel: "HOME",
    color: "#1d4ed8",
    background: "#eff6ff",
    border: "#bfdbfe",
    accent: "#2563eb",
  },
  ストリーム: {
    shortLabel: "STREAM",
    color: "#047857",
    background: "#ecfdf5",
    border: "#a7f3d0",
    accent: "#10b981",
  },
  ライブラリ: {
    shortLabel: "LIBRARY",
    color: "#b45309",
    background: "#fffbeb",
    border: "#fde68a",
    accent: "#f59e0b",
  },
  レポート: {
    shortLabel: "REPORTS",
    color: "#0f766e",
    background: "#ecfeff",
    border: "#a5f3fc",
    accent: "#06b6d4",
  },
  設定: {
    shortLabel: "SETTINGS",
    color: "#6d28d9",
    background: "#f5f3ff",
    border: "#ddd6fe",
    accent: "#8b5cf6",
  },
};

function Sidebar({
  currentSection,
  onSelectSection,
}: SidebarProps) {
  return (
    <aside
      style={{
        display: "grid",
        gap: "12px",
      }}
    >
      <div
        style={{
          display: "grid",
          gap: "4px",
          padding: "4px 2px 8px",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#64748b",
          }}
        >
          Sections
        </p>

        <p
          style={{
            margin: 0,
            fontSize: "13px",
            lineHeight: 1.6,
            color: "#475569",
            fontWeight: 600,
          }}
        >
          セクションをすばやく切り替えます。
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gap: "8px",
        }}
      >
        {navigationItems.map((item) => {
          const meta = sectionMeta[item];
          const isActive = currentSection === item;

          return (
            <button
              key={item}
              type="button"
              onClick={() => onSelectSection(item)}
              aria-current={isActive ? "page" : undefined}
              style={{
                position: "relative",
                overflow: "hidden",
                textAlign: "left",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "12px",
                width: "100%",
                minHeight: "60px",
                padding: "12px 14px",
                borderRadius: "14px",
                border: `1px solid ${isActive ? meta.border : "#e5e7eb"}`,
                background: isActive ? meta.background : "#ffffff",
                boxShadow: isActive
                  ? "0 10px 18px rgba(15, 23, 42, 0.06)"
                  : "0 2px 8px rgba(15, 23, 42, 0.03)",
                cursor: "pointer",
                touchAction: "manipulation",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: "0 auto 0 0",
                  width: "5px",
                  background: isActive ? meta.accent : "#cbd5e1",
                }}
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  minWidth: 0,
                  flex: "1 1 auto",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: "64px",
                    padding: "5px 8px",
                    borderRadius: "999px",
                    border: `1px solid ${isActive ? meta.border : "#e5e7eb"}`,
                    background: isActive ? "#ffffff" : "#f8fafc",
                    color: isActive ? meta.color : "#64748b",
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    flexShrink: 0,
                  }}
                >
                  {meta.shortLabel}
                </span>

                <span
                  style={{
                    fontSize: "17px",
                    lineHeight: 1.2,
                    fontWeight: 800,
                    color: "#111827",
                    wordBreak: "break-word",
                  }}
                >
                  {item}
                </span>
              </div>

              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "24px",
                  minHeight: "24px",
                  borderRadius: "999px",
                  background: isActive ? "#ffffff" : "#f8fafc",
                  border: `1px solid ${isActive ? meta.border : "#e5e7eb"}`,
                  color: isActive ? meta.color : "#94a3b8",
                  fontSize: "10px",
                  fontWeight: 800,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  flexShrink: 0,
                }}
              >
                {isActive ? "ON" : "GO"}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

export default Sidebar;