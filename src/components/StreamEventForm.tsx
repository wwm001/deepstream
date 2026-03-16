import { useState } from "react";
import type { StreamEvent } from "../data/dashboard";

type StreamEventFormProps = {
  onAddEvent: (input: {
    title: string;
    detail: string;
    phase: StreamEvent["phase"];
  }) => void;
};

function StreamEventForm({ onAddEvent }: StreamEventFormProps) {
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [phase, setPhase] = useState<StreamEvent["phase"]>("current");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim() || !detail.trim()) {
      setErrorMessage("タイトルと詳細は両方入力してください。");
      return;
    }

    onAddEvent({
      title,
      detail,
      phase,
    });

    setTitle("");
    setDetail("");
    setPhase("current");
    setErrorMessage("");
  };

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
        Add Stream Event
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gap: "14px",
        }}
      >
        <div>
          <label
            htmlFor="stream-event-title"
            style={{
              display: "block",
              margin: "0 0 8px 0",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#6b7280",
            }}
          >
            Title
          </label>

          <input
            id="stream-event-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="イベント名を入力"
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "10px",
              border: "1px solid #d1d5db",
              background: "#f9fafb",
              color: "#111827",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div>
          <label
            htmlFor="stream-event-detail"
            style={{
              display: "block",
              margin: "0 0 8px 0",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#6b7280",
            }}
          >
            Detail
          </label>

          <textarea
            id="stream-event-detail"
            value={detail}
            onChange={(event) => setDetail(event.target.value)}
            placeholder="イベント詳細を入力"
            rows={4}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "10px",
              border: "1px solid #d1d5db",
              background: "#f9fafb",
              color: "#111827",
              fontSize: "14px",
              boxSizing: "border-box",
              resize: "vertical",
              fontFamily: "inherit",
            }}
          />
        </div>

        <div>
          <label
            htmlFor="stream-event-phase"
            style={{
              display: "block",
              margin: "0 0 8px 0",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#6b7280",
            }}
          >
            Phase
          </label>

          <select
            id="stream-event-phase"
            value={phase}
            onChange={(event) =>
              setPhase(event.target.value as StreamEvent["phase"])
            }
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "10px",
              border: "1px solid #d1d5db",
              background: "#f9fafb",
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

        {errorMessage && (
          <p
            style={{
              margin: 0,
              color: "#b91c1c",
              fontSize: "13px",
              lineHeight: 1.6,
            }}
          >
            {errorMessage}
          </p>
        )}

        <div>
          <button
            type="submit"
            style={{
              border: "none",
              background: "#111827",
              color: "#ffffff",
              borderRadius: "10px",
              padding: "10px 14px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Add Event
          </button>
        </div>
      </form>
    </section>
  );
}

export default StreamEventForm;