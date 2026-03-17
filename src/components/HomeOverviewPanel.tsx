import type { HomeSignal } from "../dashboardCards";

type HomeOverviewPanelProps = {
  items: HomeSignal[];
};

const toneStyles: Record<
  HomeSignal["tone"],
  { color: string; background: string; border: string }
> = {
  primary: {
    color: "#1d4ed8",
    background: "#eff6ff",
    border: "#bfdbfe",
  },
  success: {
    color: "#047857",
    background: "#ecfdf5",
    border: "#a7f3d0",
  },
  warning: {
    color: "#b45309",
    background: "#fffbeb",
    border: "#fde68a",
  },
  neutral: {
    color: "#4b5563",
    background: "#f9fafb",
    border: "#e5e7eb",
  },
};

function HomeOverviewPanel({ items }: HomeOverviewPanelProps) {
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
        Home Signals
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "12px",
        }}
      >
        {items.map((item) => {
          const toneStyle = toneStyles[item.tone];

          return (
            <article
              key={item.label}
              style={{
                padding: "14px 16px",
                borderRadius: "10px",
                background: toneStyle.background,
                border: `1px solid ${toneStyle.border}`,
              }}
            >
              <p
                style={{
                  margin: "0 0 8px 0",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: toneStyle.color,
                }}
              >
                {item.label}
              </p>

              <p
                style={{
                  margin: 0,
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#111827",
                }}
              >
                {item.value}
              </p>

              <p
                style={{
                  margin: "10px 0 0 0",
                  color: "#374151",
                  lineHeight: 1.6,
                  fontSize: "14px",
                }}
              >
                {item.note}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default HomeOverviewPanel;