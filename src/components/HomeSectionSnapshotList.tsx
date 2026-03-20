import type { HomeSectionSnapshot } from "../dashboardData/types";
import type { NavigationSection } from "../navigationItems";
import DashboardPanel from "./DashboardPanel";
import DashboardActionButton from "./DashboardActionButton";

type HomeSectionSnapshotListProps = {
  items: HomeSectionSnapshot[];
  onSelectSection: (section: NavigationSection) => void;
};

const sectionStyles: Record<
  NavigationSection,
  {
    color: string;
    background: string;
    border: string;
    accent: string;
  }
> = {
  ホーム: {
    color: "#1d4ed8",
    background: "#eff6ff",
    border: "#bfdbfe",
    accent: "#2563eb",
  },
  ストリーム: {
    color: "#047857",
    background: "#ecfdf5",
    border: "#a7f3d0",
    accent: "#10b981",
  },
  ライブラリ: {
    color: "#b45309",
    background: "#fffbeb",
    border: "#fde68a",
    accent: "#f59e0b",
  },
  レポート: {
    color: "#0f766e",
    background: "#ecfeff",
    border: "#a5f3fc",
    accent: "#06b6d4",
  },
  設定: {
    color: "#6d28d9",
    background: "#f5f3ff",
    border: "#ddd6fe",
    accent: "#8b5cf6",
  },
};

function HomeSectionSnapshotList({
  items,
  onSelectSection,
}: HomeSectionSnapshotListProps) {
  return (
    <DashboardPanel title="Section Map">
      <div
        style={{
          display: "grid",
          gap: "14px",
        }}
      >
        <section
          style={{
            padding: "16px 18px",
            borderRadius: "14px",
            border: "1px solid #e2e8f0",
            background:
              "linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #eef6ff 100%)",
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
            Navigation Grid
          </p>

          <p
            style={{
              margin: 0,
              fontSize: "15px",
              lineHeight: 1.7,
              color: "#0f172a",
              fontWeight: 600,
            }}
          >
            各セクションの現在地を確認し、そのまま目的の画面へ移動できます。
          </p>
        </section>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "12px",
          }}
        >
          {items.map((item) => {
            const sectionStyle = sectionStyles[item.section];

            return (
              <article
                key={item.section}
                style={{
                  position: "relative",
                  overflow: "hidden",
                  display: "grid",
                  gap: "14px",
                  padding: "16px 16px 16px 18px",
                  borderRadius: "14px",
                  background: sectionStyle.background,
                  border: `1px solid ${sectionStyle.border}`,
                  boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: "0 auto 0 0",
                    width: "6px",
                    background: sectionStyle.accent,
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "12px",
                  }}
                >
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "11px",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: sectionStyle.color,
                      }}
                    >
                      Section
                    </p>

                    <h3
                      style={{
                        margin: "8px 0 0 0",
                        fontSize: "22px",
                        lineHeight: 1.2,
                        color: "#111827",
                      }}
                    >
                      {item.section}
                    </h3>
                  </div>

                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: "76px",
                      padding: "5px 10px",
                      borderRadius: "999px",
                      background: "#ffffff",
                      border: `1px solid ${sectionStyle.border}`,
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      color: sectionStyle.color,
                    }}
                  >
                    {item.cardCount} cards
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      padding: "10px 12px",
                      borderRadius: "12px",
                      background: "#ffffff",
                      border: `1px solid ${sectionStyle.border}`,
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 4px 0",
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: "#64748b",
                      }}
                    >
                      Status
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "14px",
                        fontWeight: 700,
                        lineHeight: 1.5,
                        color: "#111827",
                      }}
                    >
                      {item.status}
                    </p>
                  </div>

                  <div
                    style={{
                      padding: "10px 12px",
                      borderRadius: "12px",
                      background: "#ffffff",
                      border: `1px solid ${sectionStyle.border}`,
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 4px 0",
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: "#64748b",
                      }}
                    >
                      Focus
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "14px",
                        fontWeight: 700,
                        lineHeight: 1.5,
                        color: "#111827",
                      }}
                    >
                      {item.focus}
                    </p>
                  </div>
                </div>

                <p
                  style={{
                    margin: 0,
                    fontSize: "13px",
                    lineHeight: 1.7,
                    color: "#334155",
                    fontWeight: 500,
                  }}
                >
                  {item.note}
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <DashboardActionButton
                    label="open section"
                    onClick={() => onSelectSection(item.section)}
                  />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </DashboardPanel>
  );
}

export default HomeSectionSnapshotList;