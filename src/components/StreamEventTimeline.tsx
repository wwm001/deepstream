import { useState } from "react";
import type { StreamEvent } from "../dashboardData/types";
import DashboardPanel from "./DashboardPanel";
import DashboardBadge from "./DashboardBadge";
import DashboardActionButton from "./DashboardActionButton";

type StreamEventTimelineProps = {
  items: StreamEvent[];
  onRemoveEvent?: (eventId: string) => void;
  onAddEvent?: (event: Omit<StreamEvent, "id">) => void;
  onResetEvents?: () => void;
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
  onAddEvent,
  onResetEvents,
}: StreamEventTimelineProps) {
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [phase, setPhase] = useState<StreamEvent["phase"]>("next");

  const handleSubmit = () => {
    const trimmedTitle = title.trim();
    const trimmedDetail = detail.trim();

    if (!onAddEvent || !trimmedTitle || !trimmedDetail) return;

    onAddEvent({
      title: trimmedTitle,
      detail: trimmedDetail,
      phase,
    });

    setTitle("");
    setDetail("");
    setPhase("next");
  };

  return (
    <DashboardPanel
      title="Stream Timeline"
      right={
        onResetEvents ? (
          <DashboardActionButton
            label="reset"
            onClick={onResetEvents}
          />
        ) : undefined
      }
    >
      {onAddEvent && (
        <div
          style={{
            display: "grid",
            gap: "10px",
            marginBottom: "16px",
            padding: "14px 16px",
            borderRadius: "10px",
            background: "#f9fafb",
            border: "1px solid #f3f4f6",
          }}
        >
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="event title"
            style={{
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              fontSize: "14px",
            }}
          />
          <input
            value={detail}
            onChange={(event) => setDetail(event.target.value)}
            placeholder="detail"
            style={{
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              fontSize: "14px",
            }}
          />
          <select
            value={phase}
            onChange={(event) =>
              setPhase(event.target.value as StreamEvent["phase"])
            }
            style={{
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              fontSize: "14px",
              background: "#ffffff",
            }}
          >
            <option value="done">done</option>
            <option value="current">current</option>
            <option value="next">next</option>
          </select>
          <div>
            <DashboardActionButton
              label="add event"
              onClick={handleSubmit}
            />
          </div>
        </div>
      )}

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
              key={item.id}
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

                    {onRemoveEvent && (
                      <DashboardActionButton
                        label="remove"
                        onClick={() => onRemoveEvent(item.id)}
                      />
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