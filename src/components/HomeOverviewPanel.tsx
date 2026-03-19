import type { HomeSignal } from "../dashboardData/types";
import DashboardPanel from "./DashboardPanel";

type HomeOverviewPanelProps = {
  items: HomeSignal[];
};

const toneStyles: Record<
  HomeSignal["tone"],
  {
    color: string;
    background: string;
    border: string;
    accent: string;
  }
> = {
  primary: {
    color: "#1d4ed8",
    background: "#eff6ff",
    border: "#bfdbfe",
    accent: "#2563eb",
  },
  success: {
    color: "#047857",
    background: "#ecfdf5",
    border: "#a7f3d0",
    accent: "#10b981",
  },
  warning: {
    color: "#b45309",
    background: "#fffbeb",
    border: "#fde68a",
    accent: "#f59e0b",
  },
  neutral: {
    color: "#4b5563",
    background: "#f9fafb",
    border: "#e5e7eb",
    accent: "#9ca3af",
  },
};

function HomeOverviewPanel({ items }: HomeOverviewPanelProps) {
  const activeSectionSignal =
    items.find((item) => item.label === "Active Section") ?? null;

  const highlightedSignalCount = items.filter(
    (item) => item.tone !== "neutral"
  ).length;

  const summaryText = activeSectionSignal
    ? `現在の主表示は「${activeSectionSignal.value}」です。主要信号 ${items.length} 本のうち、注視対象は ${highlightedSignalCount} 本です。`
    : `主要信号 ${items.length} 本を司令室パネルに集約しています。`;

  return (
    <DashboardPanel title="Home Signals">
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
            border: "1px solid #dbe4f0",
            background:
              "linear-gradient(135deg, #f8fafc 0%, #eef6ff 55%, #f8fafc 100%)",
            boxShadow: "0 8px 18px rgba(15, 23, 42, 0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <div>
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
                Command Summary
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
                {summaryText}
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  minWidth: "92px",
                  padding: "10px 12px",
                  borderRadius: "12px",
                  background: "#ffffff",
                  border: "1px solid #dbe4f0",
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
                  Signals
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "22px",
                    fontWeight: 800,
                    color: "#111827",
                    lineHeight: 1,
                  }}
                >
                  {items.length}
                </p>
              </div>

              <div
                style={{
                  minWidth: "120px",
                  padding: "10px 12px",
                  borderRadius: "12px",
                  background: "#ffffff",
                  border: "1px solid #dbe4f0",
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
                  Active View
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "18px",
                    fontWeight: 800,
                    color: "#111827",
                    lineHeight: 1.2,
                  }}
                >
                  {activeSectionSignal?.value ?? "Unknown"}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "12px",
          }}
        >
          {items.map((item) => {
            const toneStyle = toneStyles[item.tone];

            return (
              <article
                key={item.label}
                style={{
                  position: "relative",
                  overflow: "hidden",
                  padding: "16px 16px 16px 18px",
                  borderRadius: "12px",
                  background: toneStyle.background,
                  border: `1px solid ${toneStyle.border}`,
                  boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: "0 auto 0 0",
                    width: "6px",
                    background: toneStyle.accent,
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
                  <p
                    style={{
                      margin: 0,
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: toneStyle.color,
                    }}
                  >
                    {item.label}
                  </p>

                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: "58px",
                      padding: "4px 8px",
                      borderRadius: "999px",
                      background: "#ffffff",
                      border: `1px solid ${toneStyle.border}`,
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      color: toneStyle.color,
                    }}
                  >
                    {item.tone}
                  </span>
                </div>

                <p
                  style={{
                    margin: "12px 0 0 0",
                    fontSize: "28px",
                    fontWeight: 800,
                    lineHeight: 1,
                    color: "#111827",
                  }}
                >
                  {item.value}
                </p>

                <p
                  style={{
                    margin: "12px 0 0 0",
                    color: "#334155",
                    lineHeight: 1.65,
                    fontSize: "13px",
                  }}
                >
                  {item.note}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </DashboardPanel>
  );
}

export default HomeOverviewPanel;