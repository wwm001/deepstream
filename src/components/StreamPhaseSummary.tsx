import type { StreamEvent } from "../data/dashboard";

type StreamPhaseSummaryProps = {
  doneCount: number;
  currentCount: number;
  nextCount: number;
};

const phaseStyles: Record<
  StreamEvent["phase"],
  { color: string; background: string; border: string }
> = {
  done: {
    color: "#047857",
    background: "#ecfdf5",
    border: "#a7f3d0",
  },
  current: {
    color: "#1d4ed8",
    background: "#eff6ff",
    border: "#bfdbfe",
  },
  next: {
    color: "#b45309",
    background: "#fffbeb",
    border: "#fde68a",
  },
};

function StreamPhaseSummary({
  doneCount,
  currentCount,
  nextCount,
}: StreamPhaseSummaryProps) {
  const items: Array<{
    label: StreamEvent["phase"];
    value: number;
    note: string;
  }> = [
    {
      label: "done",
      value: doneCount,
      note: "完了済みのイベントです。",
    },
    {
      label: "current",
      value: currentCount,
      note: "現在進行中のイベントです。",
    },
    {
      label: "next",
      value: nextCount,
      note: "次に控えているイベントです。",
    },
  ];

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
        Stream Summary
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "12px",
        }}
      >
        {items.map((item) => {
          const phaseStyle = phaseStyles[item.label];

          return (
            <article
              key={item.label}
              style={{
                padding: "14px 16px",
                borderRadius: "10px",
                background: phaseStyle.background,
                border: `1px solid ${phaseStyle.border}`,
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
                  color: phaseStyle.color,
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

export default StreamPhaseSummary;