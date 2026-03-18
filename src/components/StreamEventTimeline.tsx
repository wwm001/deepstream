import { useMemo, useState, type FormEvent } from "react";
import type { StreamEvent } from "../dashboardData/types";
import DashboardPanel from "./DashboardPanel";
import DashboardBadge from "./DashboardBadge";
import DashboardActionButton from "./DashboardActionButton";

type StreamEventItem = StreamEvent & {
  id?: string;
};

type StreamEventTimelineProps = {
  items: StreamEventItem[];
  onRemoveEvent?: (eventId: string) => void;
  onAddEvent?: (event: Omit<StreamEvent, "id">) => void;
  onResetEvents?: () => void;
};

const phaseStyles: Record<
  StreamEvent["phase"],
  { color: string; background: string; border: string }
> = {
  done: {
    color: "#1d4ed8",
    background: "#eff6ff",
    border: "#bfdbfe",
  },
  current: {
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

function StreamEventTimeline({
  items,
  onRemoveEvent,
  onAddEvent,
  onResetEvents,
}: StreamEventTimelineProps) {
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [phase, setPhase] = useState<StreamEvent["phase"]>("current");

  const trimmedTitle = title.trim();
  const trimmedDetail = detail.trim();

  const canSubmit = useMemo(() => {
    return (
      trimmedTitle.length > 0 &&
      trimmedDetail.length > 0 &&
      typeof onAddEvent === "function"
    );
  }, [trimmedTitle, trimmedDetail, onAddEvent]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit || !onAddEvent) {
      return;
    }

    onAddEvent({
      title: trimmedTitle,
      detail: trimmedDetail,
      phase,
    });

    setTitle("");
    setDetail("");
    setPhase("current");
  };

  return (
    <DashboardPanel title="Stream Timeline">
      {(onAddEvent || onResetEvents) && (
        <div
          style={{
            display: "grid",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          {onAddEvent && (
            <form
              onSubmit={handleSubmit}
              style={{
                display: "grid",
                gap: "10px",
                padding: "14px",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                background: "#f9fafb",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "10px",
                }}
              >
                <input
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="title"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "10px",
                    border: "1px solid #d1d5db",
                    background: "#ffffff",
                    color: "#111827",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />

                <select
                  value={phase}
                  onChange={(event) =>
                    setPhase(event.target.value as StreamEvent["phase"])
                  }
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "10px",
                    border: "1px solid #d1d5db",
                    background: "#ffffff",
                    color: "#111827",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="done">done</option>
                  <option value="current">current</option>
                  <option value="next">next</option>
                </select>
              </div>

              <textarea
                value={detail}
                onChange={(event) => setDetail(event.target.value)}
                placeholder="detail"
                rows={3}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: "1px solid #d1d5db",
                  background: "#ffffff",
                  color: "#111827",
                  fontSize: "14px",
                  boxSizing: "border-box",
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    color: canSubmit ? "#047857" : "#6b7280",
                    lineHeight: 1.6,
                  }}
                >
                  {canSubmit
                    ? "Enter または add event で追加できます"
                    : "title と detail を入れると追加できます"}
                </span>

                <DashboardActionButton
                  label="add event"
                  type="submit"
                  disabled={!canSubmit}
                />
              </div>
            </form>
          )}

          {onResetEvents && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <DashboardActionButton label="reset" onClick={onResetEvents} />
            </div>
          )}
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
                      <DashboardActionButton
                        label="remove"
                        onClick={() => onRemoveEvent(item.id!)}
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