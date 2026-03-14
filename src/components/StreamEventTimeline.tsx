import type { StreamEvent } from "../dashboardCards";

type StreamEventTimelineProps = {
  items: StreamEvent[];
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

function StreamEventTimeline({ items }: StreamEventTimelineProps) {
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
        Stream Timeline
      </p>

      <div
        style={{
          display: "grid",
          gap: "12px",
        }}
      >
        {items.map((item, index) => {
          const phaseStyle = phaseStyles[item.phase];

          return (
            <article
              key={`${item.title}-${index}`}
              style={{
                display: "grid",
                gridTemplateColumns: "28px 1fr",
                gap: "12px",
                alignItems: "start",
              }}
            >
              <div
                style={{
                  display: "grid",
                  justifyItems: "center",
                  gap: "6px",
                }}
              >
                <span
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "999px",
                    background: phaseStyle.color,
                    marginTop: "6px",
                  }}
                />
                {index !== items.length - 1 && (
                  <span
                    style={{
                      width: "2px",
                      height: "100%",
                      minHeight: "52px",
                      background: "#e5e7eb",
                      display: "block",
                    }}
                  />
                )}
              </div>

              <div
                style={{
                  padding: "14px 16px",
                  borderRadius: "10px",
                  background: phaseStyle.background,
                  border: `1px solid ${phaseStyle.border}`,
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
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "16px",
                      color: "#111827",
                    }}
                  >
                    {item.title}
                  </h3>

                  <span
                    style={{
                      display: "inline-block",
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: phaseStyle.color,
                      background: "#ffffff",
                      padding: "4px 8px",
                      borderRadius: "999px",
                      border: `1px solid ${phaseStyle.border}`,
                    }}
                  >
                    {item.phase}
                  </span>
                </div>

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
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default StreamEventTimeline;