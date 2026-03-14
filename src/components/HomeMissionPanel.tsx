import type { HomeFocusItem } from "../dashboardCards";

type HomeMissionPanelProps = {
  items: HomeFocusItem[];
};

const stateStyles: Record<
  HomeFocusItem["state"],
  { color: string; background: string; border: string }
> = {
  now: {
    color: "#1d4ed8",
    background: "#eff6ff",
    border: "#bfdbfe",
  },
  ready: {
    color: "#047857",
    background: "#ecfdf5",
    border: "#a7f3d0",
  },
  next: {
    color: "#b45309",
    background: "#fffbeb",
    border: "#fde68a",
  },
};

function HomeMissionPanel({ items }: HomeMissionPanelProps) {
  return (
    <section
      style={{
        marginTop: "20px",
        padding: "18px",
        borderRadius: "12px",
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
      }}
    >
      <p
        style={{
          margin: "0 0 14px 0",
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#6b7280",
        }}
      >
        Mission Board
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "12px",
        }}
      >
        {items.map((item) => {
          const stateStyle = stateStyles[item.state];

          return (
            <article
              key={item.label}
              style={{
                padding: "14px 16px",
                borderRadius: "10px",
                background: stateStyle.background,
                border: `1px solid ${stateStyle.border}`,
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
                <p
                  style={{
                    margin: 0,
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "#6b7280",
                  }}
                >
                  {item.label}
                </p>

                <span
                  style={{
                    display: "inline-block",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: stateStyle.color,
                    background: "#ffffff",
                    padding: "4px 8px",
                    borderRadius: "999px",
                    border: `1px solid ${stateStyle.border}`,
                  }}
                >
                  {item.state}
                </span>
              </div>

              <h3
                style={{
                  margin: "10px 0 0 0",
                  fontSize: "18px",
                  color: "#111827",
                }}
              >
                {item.title}
              </h3>

              <p
                style={{
                  margin: "10px 0 0 0",
                  color: "#374151",
                  lineHeight: 1.7,
                  fontSize: "14px",
                }}
              >
                {item.detail}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default HomeMissionPanel;