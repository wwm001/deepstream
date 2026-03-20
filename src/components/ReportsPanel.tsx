import { useEffect, useMemo, useRef, useState } from "react";
import type { ReportRecord, ReportStatus } from "../dashboardData/types";
import DashboardPanel from "./DashboardPanel";
import DashboardBadge from "./DashboardBadge";
import DashboardActionButton from "./DashboardActionButton";

type ReportsPanelProps = {
  items: ReportRecord[];
  selectedReportId: string | null;
  onSelectReport: (reportId: string) => void;
  onCycleReportStatus: (reportId: string) => void;
};

const statusStyles: Record<
  ReportStatus,
  { color: string; background: string; label: string }
> = {
  new: {
    color: "#1d4ed8",
    background: "#dbeafe",
    label: "new",
  },
  reading: {
    color: "#047857",
    background: "#d1fae5",
    label: "reading",
  },
  archived: {
    color: "#6b7280",
    background: "#e5e7eb",
    label: "archived",
  },
};

const playbackRates = [0.8, 1.0, 1.2, 1.5, 2.0] as const;

function buildSpeechText(report: ReportRecord) {
  return [report.title, report.summary, report.body].join("\n\n");
}

function ReportsPanel({
  items,
  selectedReportId,
  onSelectReport,
  onCycleReportStatus,
}: ReportsPanelProps) {
  const [playbackRate, setPlaybackRate] =
    useState<(typeof playbackRates)[number]>(1.0);
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [readingReportId, setReadingReportId] = useState<string | null>(null);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speechSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  const selectedReport = useMemo(() => {
    if (!selectedReportId) {
      return items[0] ?? null;
    }

    return items.find((item) => item.id === selectedReportId) ?? items[0] ?? null;
  }, [items, selectedReportId]);

  const stopReading = () => {
    if (!speechSupported) {
      return;
    }

    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setIsReading(false);
    setIsPaused(false);
    setReadingReportId(null);
  };

  const pauseReading = () => {
    if (!speechSupported || !isReading || isPaused) {
      return;
    }

    window.speechSynthesis.pause();
    setIsPaused(true);
  };

  const resumeReading = () => {
    if (!speechSupported || !isReading || !isPaused) {
      return;
    }

    window.speechSynthesis.resume();
    setIsPaused(false);
  };

  const startReading = () => {
    if (!speechSupported || !selectedReport) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(
      buildSpeechText(selectedReport)
    );
    utterance.rate = playbackRate;
    utterance.lang = "ja-JP";

    utterance.onstart = () => {
      setIsReading(true);
      setIsPaused(false);
      setReadingReportId(selectedReport.id);
    };

    utterance.onend = () => {
      setIsReading(false);
      setIsPaused(false);
      setReadingReportId(null);
      utteranceRef.current = null;
    };

    utterance.onerror = () => {
      setIsReading(false);
      setIsPaused(false);
      setReadingReportId(null);
      utteranceRef.current = null;
    };

    utterance.onpause = () => {
      setIsPaused(true);
    };

    utterance.onresume = () => {
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => {
      if (speechSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [speechSupported]);

  useEffect(() => {
    if (!isReading) {
      return;
    }

    if (selectedReport?.id !== readingReportId) {
      stopReading();
    }
  }, [selectedReport?.id, readingReportId, isReading]);

  const readingStatusLabel = !speechSupported
    ? "speech unavailable"
    : isReading
    ? isPaused
      ? "paused"
      : "speaking"
    : "idle";

  const readingStatusColor = !speechSupported
    ? "#b45309"
    : isReading
    ? isPaused
      ? "#b45309"
      : "#047857"
    : "#64748b";

  return (
    <div
      style={{
        display: "grid",
        gap: "16px",
      }}
    >
      <section
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "16px",
          flexWrap: "wrap",
          padding: "14px 16px",
          borderRadius: "14px",
          border: "1px solid #dbe4f0",
          background:
            "linear-gradient(135deg, #ffffff 0%, #f8fafc 48%, #eef6ff 100%)",
          boxShadow: "0 8px 18px rgba(15, 23, 42, 0.04)",
        }}
      >
        <div
          style={{
            display: "grid",
            gap: "6px",
            minWidth: "220px",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#475569",
            }}
          >
            Reader Controls
          </p>

          <p
            style={{
              margin: 0,
              fontSize: "14px",
              lineHeight: 1.7,
              color: "#0f172a",
              fontWeight: 600,
            }}
          >
            選択中レポートの読み上げ操作をここから行います。
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexWrap: "wrap",
              minHeight: "22px",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 8px",
                borderRadius: "999px",
                border: `1px solid ${isReading ? "#bbf7d0" : "#e5e7eb"}`,
                background: isReading ? "#f0fdf4" : "#f8fafc",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: readingStatusColor,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "999px",
                  background: readingStatusColor,
                }}
              />
              {readingStatusLabel}
            </span>

            <span
              style={{
                margin: 0,
                fontSize: "12px",
                lineHeight: 1.5,
                color: "#64748b",
              }}
            >
              {!speechSupported
                ? "このブラウザでは読み上げを利用できません"
                : selectedReport
                ? `selected report: ${selectedReport.title}`
                : "selected report ready"}
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexWrap: "wrap",
            justifyContent: "flex-end",
            marginLeft: "auto",
          }}
        >
          <label
            style={{
              fontSize: "12px",
              color: "#475569",
              fontWeight: 600,
            }}
          >
            speed
          </label>

          <select
            value={playbackRate}
            onChange={(event) =>
              setPlaybackRate(
                Number(event.target.value) as (typeof playbackRates)[number]
              )
            }
            style={{
              padding: "8px 10px",
              borderRadius: "10px",
              border: "1px solid #d1d5db",
              background: "#ffffff",
              color: "#111827",
              fontSize: "13px",
            }}
          >
            {playbackRates.map((rate) => (
              <option key={rate} value={rate}>
                {rate.toFixed(1)}x
              </option>
            ))}
          </select>

          <DashboardActionButton
            label="read aloud"
            onClick={startReading}
            disabled={!speechSupported || !selectedReport}
          />

          <DashboardActionButton
            label="pause"
            onClick={pauseReading}
            disabled={!isReading || isPaused}
          />

          <DashboardActionButton
            label="resume"
            onClick={resumeReading}
            disabled={!isReading || !isPaused}
          />

          <DashboardActionButton
            label="stop"
            onClick={stopReading}
            disabled={!isReading}
          />

          {selectedReport && (
            <DashboardActionButton
              label={`status: ${selectedReport.status}`}
              onClick={() => onCycleReportStatus(selectedReport.id)}
            />
          )}
        </div>
      </section>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(280px, 360px) minmax(0, 1fr)",
          gap: "16px",
          alignItems: "start",
        }}
      >
        <DashboardPanel title="Reports Queue">
          <div
            style={{
              display: "grid",
              gap: "12px",
            }}
          >
            {items.map((item) => {
              const isSelected = item.id === selectedReport?.id;
              const isCurrentlyReading = item.id === readingReportId && isReading;
              const statusStyle = statusStyles[item.status];

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectReport(item.id)}
                  style={{
                    textAlign: "left",
                    border: isCurrentlyReading
                      ? "2px solid #22c55e"
                      : isSelected
                      ? "1px solid #0891b2"
                      : "1px solid #e5e7eb",
                    background: isCurrentlyReading
                      ? "#f0fdf4"
                      : isSelected
                      ? "#ecfeff"
                      : "#ffffff",
                    borderRadius: "12px",
                    padding: "14px",
                    cursor: "pointer",
                    display: "grid",
                    gap: "10px",
                    minHeight: "148px",
                    boxShadow: isCurrentlyReading
                      ? "0 0 0 3px rgba(34, 197, 94, 0.12)"
                      : "none",
                    transition:
                      "border-color 140ms ease, box-shadow 140ms ease, background 140ms ease",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "start",
                      gap: "10px",
                      flexWrap: "wrap",
                      minHeight: "44px",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gap: "6px",
                        minHeight: "44px",
                        alignContent: "start",
                      }}
                    >
                      <strong
                        style={{
                          fontSize: "14px",
                          color: "#111827",
                          lineHeight: 1.5,
                        }}
                      >
                        {item.title}
                      </strong>
                      <span
                        style={{
                          fontSize: "12px",
                          color: "#6b7280",
                        }}
                      >
                        {item.source} ・ {item.createdAt}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        flexWrap: "wrap",
                        justifyContent: "flex-end",
                      }}
                    >
                      {isCurrentlyReading && (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "4px 8px",
                            borderRadius: "999px",
                            background: isPaused ? "#fff7ed" : "#ecfdf5",
                            border: `1px solid ${isPaused ? "#fdba74" : "#86efac"}`,
                            color: isPaused ? "#b45309" : "#047857",
                            fontSize: "10px",
                            fontWeight: 700,
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                          }}
                        >
                          <span
                            aria-hidden="true"
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "999px",
                              background: isPaused ? "#f59e0b" : "#22c55e",
                            }}
                          />
                          {isPaused ? "paused" : "speaking"}
                        </span>
                      )}

                      <DashboardBadge
                        label={statusStyle.label}
                        color={statusStyle.color}
                        background={statusStyle.background}
                      />
                    </div>
                  </div>

                  <p
                    style={{
                      margin: 0,
                      fontSize: "13px",
                      lineHeight: 1.7,
                      color: "#4b5563",
                      minHeight: "54px",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {item.summary}
                  </p>
                </button>
              );
            })}
          </div>
        </DashboardPanel>

        <DashboardPanel title="Report Reader">
          {selectedReport ? (
            <div
              style={{
                display: "grid",
                gap: "14px",
                gridTemplateRows: "auto 88px 88px auto",
                alignItems: "start",
              }}
            >
              <div
                style={{
                  minHeight: "42px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "10px",
                  flexWrap: "wrap",
                  padding: "10px 12px",
                  borderRadius: "12px",
                  border:
                    isReading && readingReportId === selectedReport.id
                      ? `1px solid ${isPaused ? "#fdba74" : "#86efac"}`
                      : "1px solid #e5e7eb",
                  background:
                    isReading && readingReportId === selectedReport.id
                      ? isPaused
                        ? "#fff7ed"
                        : "#f0fdf4"
                      : "#f8fafc",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    color:
                      isReading && readingReportId === selectedReport.id
                        ? isPaused
                          ? "#b45309"
                          : "#047857"
                        : "#64748b",
                  }}
                >
                  {isReading && readingReportId === selectedReport.id
                    ? isPaused
                      ? "Reader paused"
                      : "Reader speaking"
                    : "Reader ready"}
                </span>

                <span
                  style={{
                    fontSize: "12px",
                    color: "#64748b",
                    lineHeight: 1.5,
                  }}
                >
                  {isReading && readingReportId === selectedReport.id
                    ? isPaused
                      ? "現在のレポートを一時停止しています。"
                      : "現在のレポートを読み上げ中です。"
                    : "選択中レポートを表示しています。"}
                </span>
              </div>

              <section
                style={{
                  minHeight: "88px",
                  maxHeight: "88px",
                  display: "grid",
                  gap: "6px",
                  alignContent: "start",
                  overflow: "hidden",
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: "18px",
                    color: "#111827",
                    lineHeight: 1.35,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {selectedReport.title}
                </h3>

                <div
                  style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    lineHeight: 1.6,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {selectedReport.source} ・ {selectedReport.createdAt}
                </div>
              </section>

              <section
                style={{
                  padding: "12px 14px",
                  borderRadius: "12px",
                  background: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  fontSize: "13px",
                  lineHeight: 1.7,
                  color: "#4b5563",
                  minHeight: "88px",
                  maxHeight: "88px",
                  display: "flex",
                  alignItems: "flex-start",
                  overflow: "hidden",
                }}
              >
                <span
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {selectedReport.summary}
                </span>
              </section>

              <article
                style={{
                  whiteSpace: "pre-wrap",
                  fontSize: "14px",
                  lineHeight: 1.9,
                  color: "#111827",
                }}
              >
                {selectedReport.body}
              </article>
            </div>
          ) : (
            <div
              style={{
                color: "#6b7280",
                fontSize: "14px",
                lineHeight: 1.8,
              }}
            >
              表示できるレポートがありません。
            </div>
          )}
        </DashboardPanel>
      </div>
    </div>
  );
}

export default ReportsPanel;