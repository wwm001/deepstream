export type MetricSummaryTone = "green" | "amber" | "blue" | "gray";

export type MetricSummaryItem = {
  label: string;
  value: number | string;
  note: string;
  tone: MetricSummaryTone;
};

type MetricSummaryPanelProps = {
  title: string;
  items: MetricSummaryItem[];
};

const toneStyles: Record<
  MetricSummaryTone,
  { color: string; background: string; border: string }
> = {
  green: {
    color: "#047857",
    background: "#ecfdf5",
    border: "#a7f3d0",
  },
  amber: {
    color: "#b45309",
    background: "#fffbeb",
    border: "#fde68a",
  },
  blue: {
    color: "#1d4ed8",
    background: "#eff6ff",
    border: "#bfdbfe",
  },
  gray: {
    color: "#374151",
    background: "#f9fafb",
    border: "#e5e7eb",
  },
};

function MetricSummaryPanel({
  title,
  items,
}: MetricSummaryPanelProps) {
  return (
    <section
      style={{
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
        {title}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
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

              <p
                style={{
                  margin: "10px 0 0 0",
                  fontSize: "28px",
                  fontWeight: 800,
                  lineHeight: 1,
                  color: toneStyle.color,
                }}
              >
                {item.value}
              </p>

              <p
                style={{
                  margin: "10px 0 0 0",
                  color: "#4b5563",
                  lineHeight: 1.6,
                  fontSize: "13px",
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

export default MetricSummaryPanel;