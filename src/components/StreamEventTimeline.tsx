import {
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
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

type StreamFormErrors = Partial<Record<"title" | "detail", string>>;

const TITLE_MAX_LENGTH = 80;
const DETAIL_MAX_LENGTH = 300;

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

function validateStreamInput(input: {
  title: string;
  detail: string;
}): StreamFormErrors {
  const errors: StreamFormErrors = {};

  if (!input.title) {
    errors.title = "title を入力してください。";
  } else if (input.title.length > TITLE_MAX_LENGTH) {
    errors.title = `title は ${TITLE_MAX_LENGTH} 文字以内で入力してください。`;
  }

  if (!input.detail) {
    errors.detail = "detail を入力してください。";
  } else if (input.detail.length > DETAIL_MAX_LENGTH) {
    errors.detail = `detail は ${DETAIL_MAX_LENGTH} 文字以内で入力してください。`;
  }

  return errors;
}

function StreamEventTimeline({
  items,
  onRemoveEvent,
  onAddEvent,
  onResetEvents,
}: StreamEventTimelineProps) {
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [phase, setPhase] = useState<StreamEvent["phase"]>("current");
  const [errors, setErrors] = useState<StreamFormErrors>({});
  const [submitMessage, setSubmitMessage] = useState("");

  const formRef = useRef<HTMLFormElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const detailTextareaRef = useRef<HTMLTextAreaElement>(null);

  const trimmedTitle = title.trim();
  const trimmedDetail = detail.trim();

  const canSubmit = useMemo(() => {
    return (
      trimmedTitle.length > 0 &&
      trimmedDetail.length > 0 &&
      typeof onAddEvent === "function"
    );
  }, [trimmedTitle, trimmedDetail, onAddEvent]);

  const isDirty = useMemo(() => {
    return (
      title.length > 0 ||
      detail.length > 0 ||
      phase !== "current" ||
      Object.keys(errors).length > 0 ||
      submitMessage.length > 0
    );
  }, [title, detail, phase, errors, submitMessage]);

  const clearForm = (withMessage = false) => {
    setTitle("");
    setDetail("");
    setPhase("current");
    setErrors({});
    setSubmitMessage(withMessage ? "入力をクリアしました。" : "");
    titleInputRef.current?.focus();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!onAddEvent) {
      return;
    }

    const nextErrors = validateStreamInput({
      title: trimmedTitle,
      detail: trimmedDetail,
    });

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setSubmitMessage("");

      if (nextErrors.title) {
        titleInputRef.current?.focus();
      } else if (nextErrors.detail) {
        detailTextareaRef.current?.focus();
      }

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
    setErrors({});
    setSubmitMessage("event を追加しました。");
    titleInputRef.current?.focus();
  };

  const handleDetailKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter" && canSubmit) {
      event.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  const handleConfirmRemove = (item: StreamEventItem) => {
    if (!onRemoveEvent || !item.id) {
      return;
    }

    const accepted = window.confirm(
      `「${item.title}」をタイムラインから削除しますか？`
    );

    if (!accepted) {
      return;
    }

    onRemoveEvent(item.id);
  };

  const handleConfirmReset = () => {
    if (!onResetEvents) {
      return;
    }

    const accepted = window.confirm(
      "ストリームの一覧と表示状態を初期状態へ戻します。続行しますか？"
    );

    if (!accepted) {
      return;
    }

    onResetEvents();
  };

  return (
    <DashboardPanel title="Stream Timeline">
      {(onAddEvent || onResetEvents) && (
        <div
          style={{
            display: "grid",
            gap: "12px",
          }}
        >
          {onAddEvent && (
            <form
              ref={formRef}
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
                <div>
                  <input
                    ref={titleInputRef}
                    type="text"
                    value={title}
                    maxLength={TITLE_MAX_LENGTH}
                    onChange={(event) => {
                      setTitle(event.target.value);
                      setErrors((current) => ({ ...current, title: undefined }));
                      setSubmitMessage("");
                    }}
                    placeholder="title"
                    aria-invalid={Boolean(errors.title)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "10px",
                      border: errors.title
                        ? "1px solid #dc2626"
                        : "1px solid #d1d5db",
                      background: "#ffffff",
                      color: "#111827",
                      fontSize: "14px",
                      boxSizing: "border-box",
                    }}
                  />
                  {errors.title && (
                    <p
                      style={{
                        margin: "6px 0 0 0",
                        color: "#b91c1c",
                        fontSize: "12px",
                        lineHeight: 1.5,
                      }}
                    >
                      {errors.title}
                    </p>
                  )}
                </div>

                <select
                  value={phase}
                  onChange={(event) => {
                    setPhase(event.target.value as StreamEvent["phase"]);
                    setSubmitMessage("");
                  }}
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

              <div>
                <textarea
                  ref={detailTextareaRef}
                  value={detail}
                  maxLength={DETAIL_MAX_LENGTH}
                  onChange={(event) => {
                    setDetail(event.target.value);
                    setErrors((current) => ({ ...current, detail: undefined }));
                    setSubmitMessage("");
                  }}
                  onKeyDown={handleDetailKeyDown}
                  placeholder="detail"
                  rows={3}
                  aria-invalid={Boolean(errors.detail)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "10px",
                    border: errors.detail
                      ? "1px solid #dc2626"
                      : "1px solid #d1d5db",
                    background: "#ffffff",
                    color: "#111827",
                    fontSize: "14px",
                    boxSizing: "border-box",
                    resize: "vertical",
                    fontFamily: "inherit",
                  }}
                />
                {errors.detail && (
                  <p
                    style={{
                      margin: "6px 0 0 0",
                      color: "#b91c1c",
                      fontSize: "12px",
                      lineHeight: 1.5,
                    }}
                  >
                    {errors.detail}
                  </p>
                )}
              </div>

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
                    ? "add event できます。textarea では Ctrl/Cmd+Enter で送信できます"
                    : "title と detail を入れると追加できます"}
                </span>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  <DashboardActionButton
                    label="clear"
                    onClick={() => clearForm(true)}
                    disabled={!isDirty}
                  />
                  <DashboardActionButton
                    label="add event"
                    type="submit"
                    disabled={!canSubmit}
                  />
                </div>
              </div>

              {submitMessage && (
                <p
                  style={{
                    margin: 0,
                    color: "#047857",
                    fontSize: "12px",
                    lineHeight: 1.6,
                  }}
                >
                  {submitMessage}
                </p>
              )}
            </form>
          )}

          {onResetEvents && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <DashboardActionButton
                label="reset stream"
                onClick={handleConfirmReset}
              />
            </div>
          )}
        </div>
      )}

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
            Empty Result
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
            現在の filter 条件に一致するイベントはありません。
          </p>
        </article>
      ) : (
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
                          onClick={() => handleConfirmRemove(item)}
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
      )}
    </DashboardPanel>
  );
}

export default StreamEventTimeline;