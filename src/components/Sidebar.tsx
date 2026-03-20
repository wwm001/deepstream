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
    note: string;
    color: string;
    background: string;
    border: string;
    accent: string;
  }
> = {
  ホーム: {
    shortLabel: "HOME",
    note: "全体俯瞰と主要信号を確認する司令室です。",
    color: "#1d4ed8",
    background: "#eff6ff",
    border: "#bfdbfe",
    accent: "#2563eb",
  },
  ストリーム: {
    shortLabel: "STREAM",
    note: "進行イベントの流れを扱う時系列パネルです。",
    color: "#047857",
    background: "#ecfdf5",
    border: "#a7f3d0",
    accent: "#10b981",
  },
  ライブラリ: {
    shortLabel: "LIBRARY",
    note: "再利用資産の棚卸しと検索を行う区画です。",
    color: "#b45309",
    background: "#fffbeb",
    border: "#fde68a",
    accent: "#f59e0b",
  },
  レポート: {
    shortLabel: "REPORTS",
    note: "完成レポートを読み込み、本文を確認する読書区画です。",
    color: "#0f766e",
    background: "#ecfeff",
    border: "#a5f3fc",
    accent: "#06b6d4",
  },
  設定: {
    shortLabel: "SETTINGS",
    note: "状態監視と切り替えを行う監視区画です。",
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
        gap: "14px",
      }}
    >
      <section
        style={{
          padding: "16px 18px",
          borderRadius: "14px",
          border: "1px solid #dbe4f0",
          background:
            "linear-gradient(135deg, #ffffff 0%, #f8fafc 48%, #eef6ff 100%)",
          boxShadow: "0 8px 18px rgba(15, 23, 42, 0.04)",
        }}
      >
        <p
          style={{
            margin: "0 0 8px 0",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#475569",
          }}
        >
          Navigation Console
        </p>

        <p
          style={{
            margin: 0,
            fontSize: "14px",
            lineHeight: 1.7,
            color: "#0f172a",
            fontWeight: 600,
          }}
        >
          現在地を確認しながら、目的のセクションへ安全に移動できます。
        </p>
      </section>

      <div
        style={{
          display: "grid",
          gap: "10px",
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
                display: "grid",
                gap: "12px",
                width: "100%",
                padding: "14px 14px 14px 18px",
                borderRadius: "14px",
                border: `1px solid ${isActive ? meta.border : "#e5e7eb"}`,
                background: isActive ? meta.background : "#ffffff",
                boxShadow: isActive
                  ? "0 10px 18px rgba(15, 23, 42, 0.06)"
                  : "0 2px 8px rgba(15, 23, 42, 0.03)",
                cursor: "pointer",
                transition:
                  "transform 140ms ease, box-shadow 140ms ease, border-color 140ms ease, background 140ms ease",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: "0 auto 0 0",
                  width: "6px",
                  background: isActive ? meta.accent : "#cbd5e1",
                }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "10px",
                }}
              >
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: isActive ? meta.color : "#64748b",
                    }}
                  >
                    {meta.shortLabel}
                  </p>

                  <p
                    style={{
                      margin: "8px 0 0 0",
                      fontSize: "20px",
                      lineHeight: 1.15,
                      fontWeight: 800,
                      color: "#111827",
                    }}
                  >
                    {item}
                  </p>
                </div>

                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: "58px",
                    padding: "4px 8px",
                    borderRadius: "999px",
                    background: isActive ? "#ffffff" : "#f8fafc",
                    border: `1px solid ${isActive ? meta.border : "#e5e7eb"}`,
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    color: isActive ? meta.color : "#64748b",
                  }}
                >
                  {isActive ? "active" : "open"}
                </span>
              </div>

              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  lineHeight: 1.65,
                  color: "#334155",
                  fontWeight: 500,
                }}
              >
                {meta.note}
              </p>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

export default Sidebar;