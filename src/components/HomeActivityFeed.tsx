import DashboardPanel from "./DashboardPanel";

export type HomeActivityItem = {
  id: string;
  title: string;
  detail: string;
  timeLabel: string;
  tone: "neutral" | "success" | "warning";
};

type HomeActivityFeedProps = {
  items: HomeActivityItem[];
};

const toneStyles: Record<
  HomeActivityItem["tone"],
  {
    color: string;
    background: string;
    border: string;
    accent: string;
  }
> = {
  neutral: {
    color: "#475569",
    background: "#f8fafc",
    border: "#e2e8f0",
    accent: "#94a3b8",
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
};

function HomeActivityFeed({ items }: HomeActivityFeedProps) {
  return (
    <DashboardPanel title="Recent Activity">
      {items.length === 0 ? (
        <article
          style={{
            padding: "16px 18px",
            borderRadius: "14px",
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 10px rgba(15, 23, 42, 0.03)",
          }}
        >
          <p
            style={{
              margin: "0 0 6px 0",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#64748b",
            }}
          >
            Activity Feed
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              lineHeight: 1.7,
              color: "#334155",
              fontWeight: 500,
            }}
          >
            このセッション中の操作履歴はまだありません。
          </p>
        </article>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "12px",
          }}
        >
          {items.map((item) => {
            const toneStyle = toneStyles[item.tone];

            return (
              <article
                key={item.id}
                style={{
                  position: "relative",
                  overflow: "hidden",
                  padding: "16px 16px 16px 18px",
                  borderRadius: "14px",
                  background: toneStyle.background,
                  border: `1px solid ${toneStyle.border}`,
                  boxShadow: "0 4px 10px rgba(15, 23, 42, 0.03)",
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
                    flexWrap: "wrap",
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
                    {item.title}
                  </p>

                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: "62px",
                      padding: "4px 8px",
                      borderRadius: "999px",
                      background: "#ffffff",
                      border: `1px solid ${toneStyle.border}`,
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                      color: toneStyle.color,
                    }}
                  >
                    {item.timeLabel}
                  </span>
                </div>

                <p
                  style={{
                    margin: "10px 0 0 0",
                    fontSize: "14px",
                    lineHeight: 1.7,
                    color: "#334155",
                    fontWeight: 500,
                  }}
                >
                  {item.detail}
                </p>
              </article>
            );
          })}
        </div>
      )}
    </DashboardPanel>
  );
}

export default HomeActivityFeed;