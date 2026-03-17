import type { StreamEvent } from "../dashboardData/types";
import DashboardPanel from "./DashboardPanel";
import DashboardBadge from "./DashboardBadge";

type StreamEventItem = StreamEvent & {
  id?: string;
};

type StreamEventTimelineProps = {
  items: StreamEventItem[];
  onRemoveEvent?: (eventId: string) => void;
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

function StreamEventTimeline({
  items,
  onRemoveEvent,
}: StreamEventTimelineProps) {
  return (
    <DashboardPanel title="Stream Timeline">
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
              key={item.id ?? `${item.title}-${index}`}
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

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      flexWrap: "wrap",
                    }}
                  >
                    <DashboardBadge
                      label={item.phase}
                      color={phaseStyle.color}
                      background="#ffffff"
                      borderColor={phaseStyle.border}
                    />

                    {onRemoveEvent && item.id && (
                      <button
                        type="button"
                        onClick={() => onRemoveEvent(item.id!)}
                        style={{
                          border: "1px solid #e5e7eb",
                          background: "#ffffff",
                          color: "#6b7280",
                          borderRadius: "999px",
                          padding: "4px 8px",
                          fontSize: "11px",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        remove
                      </button>
                    )}
                  </div>
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
    </DashboardPanel>
  );
}

export default StreamEventTimeline;