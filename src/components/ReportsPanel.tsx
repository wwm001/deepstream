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

type ReportFilter = "all" | ReportStatus;

type ReportSegment = {
  kind: "title" | "summary" | "body";
  text: string;
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
const reportFilters: ReportFilter[] = ["all", "new", "reading", "archived"];

function splitBodyParagraphs(body: string) {
  return body
    .split(/\n\s*\n/g)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function buildReportSegments(report: ReportRecord): ReportSegment[] {
  const bodyParagraphs = splitBodyParagraphs(report.body);

  return [
    {
      kind: "title",
      text: report.title,
    },
    {
      kind: "summary",
      text: report.summary,
    },
    ...bodyParagraphs.map((paragraph) => ({
      kind: "body" as const,
      text: paragraph,
    })),
  ];
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
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState<number | null>(
    null
  );

  const [reportFilter, setReportFilter] = useState<ReportFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const segmentQueueRef = useRef<ReportSegment[]>([]);
  const activeReportIdRef = useRef<string | null>(null);
  const isStoppingRef = useRef(false);

  const speechSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  const filteredItems = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    return items.filter((item) => {
      const matchesFilter =
        reportFilter === "all" ? true : item.status === reportFilter;

      const matchesSearch =
        normalizedSearchTerm.length === 0
          ? true
          : `${item.title} ${item.source} ${item.summary} ${item.body}`
              .toLowerCase()
              .includes(normalizedSearchTerm);

      return matchesFilter && matchesSearch;
    });
  }, [items, reportFilter, searchTerm]);

  const selectedReport = useMemo(() => {
    if (filteredItems.length === 0) {
      return null;
    }

    if (!selectedReportId) {
      return filteredItems[0] ?? null;
    }

    return (
      filteredItems.find((item) => item.id === selectedReportId) ??
      filteredItems[0] ??
      null
    );
  }, [filteredItems, selectedReportId]);

  const selectedBodyParagraphs = useMemo(() => {
    if (!selectedReport) {
      return [];
    }

    return splitBodyParagraphs(selectedReport.body);
  }, [selectedReport]);

  const selectedSegments = useMemo(() => {
    if (!selectedReport) {
      return [];
    }

    return buildReportSegments(selectedReport);
  }, [selectedReport]);

  const filterCounts = useMemo(
    () => ({
      all: items.length,
      new: items.filter((item) => item.status === "new").length,
      reading: items.filter((item) => item.status === "reading").length,
      archived: items.filter((item) => item.status === "archived").length,
    }),
    [items]
  );

  const finishReading = () => {
    utteranceRef.current = null;
    segmentQueueRef.current = [];
    activeReportIdRef.current = null;
    isStoppingRef.current = false;
    setIsReading(false);
    setIsPaused(false);
    setReadingReportId(null);
    setCurrentSegmentIndex(null);
  };

  const stopReading = () => {
    if (!speechSupported) {
      return;
    }

    isStoppingRef.current = true;
    window.speechSynthesis.cancel();
    finishReading();
  };

  const speakSegmentAt = (segmentIndex: number) => {
    if (!speechSupported) {
      return;
    }

    const segment = segmentQueueRef.current[segmentIndex];

    if (!segment) {
      finishReading();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(segment.text);
    utterance.rate = playbackRate;
    utterance.lang = "ja-JP";

    utterance.onstart = () => {
      setIsReading(true);
      setIsPaused(false);
      setReadingReportId(activeReportIdRef.current);
      setCurrentSegmentIndex(segmentIndex);
    };

    utterance.onpause = () => {
      setIsPaused(true);
    };

    utterance.onresume = () => {
      setIsPaused(false);
    };

    utterance.onend = () => {
      if (isStoppingRef.current) {
        return;
      }

      const nextIndex = segmentIndex + 1;

      if (nextIndex < segmentQueueRef.current.length) {
        speakSegmentAt(nextIndex);
        return;
      }

      finishReading();
    };

    utterance.onerror = () => {
      finishReading();
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const startReading = () => {
    if (!speechSupported || !selectedReport) {
      return;
    }

    window.speechSynthesis.cancel();
    isStoppingRef.current = false;
    activeReportIdRef.current = selectedReport.id;
    segmentQueueRef.current = buildReportSegments(selectedReport);
    speakSegmentAt(0);
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

  const isSelectedReportBeingRead =
    Boolean(selectedReport) &&
    isReading &&
    selectedReport?.id === readingReportId;

  const currentSegment = useMemo(() => {
    if (
      currentSegmentIndex == null ||
      currentSegmentIndex < 0 ||
      currentSegmentIndex >= selectedSegments.length
    ) {
      return null;
    }

    return selectedSegments[currentSegmentIndex] ?? null;
  }, [currentSegmentIndex, selectedSegments]);

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
              marginBottom: "14px",
            }}
          >
            <div
              style={{
                display: "grid",
                gap: "10px",
                padding: "14px",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                background: "#f9fafb",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  flexWrap: "wrap",
                }}
              >
                {reportFilters.map((filter) => {
                  const isActive = reportFilter === filter;
                  const label = filter === "all" ? "all" : filter;

                  return (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setReportFilter(filter)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "7px 10px",
                        borderRadius: "999px",
                        border: isActive
                          ? "1px solid #0891b2"
                          : "1px solid #d1d5db",
                        background: isActive ? "#ecfeff" : "#ffffff",
                        color: isActive ? "#0f766e" : "#475569",
                        fontSize: "12px",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      <span>{label}</span>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          minWidth: "20px",
                          height: "20px",
                          padding: "0 6px",
                          borderRadius: "999px",
                          background: isActive ? "#ffffff" : "#f8fafc",
                          border: "1px solid #e5e7eb",
                          fontSize: "11px",
                          color: "#64748b",
                        }}
                      >
                        {filterCounts[filter]}
                      </span>
                    </button>
                  );
                })}
              </div>

              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="search reports"
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

              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  lineHeight: 1.6,
                  color: "#64748b",
                }}
              >
                {filteredItems.length} / {items.length} reports shown
              </p>
            </div>
          </div>

          {filteredItems.length > 0 ? (
            <div
              style={{
                display: "grid",
                gap: "12px",
              }}
            >
              {filteredItems.map((item) => {
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
          ) : (
            <div
              style={{
                padding: "18px 16px",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                background: "#ffffff",
                fontSize: "14px",
                lineHeight: 1.8,
                color: "#6b7280",
              }}
            >
              条件に一致するレポートがありません。
            </div>
          )}
        </DashboardPanel>

        <DashboardPanel title="Report Reader">
          {selectedReport ? (
            <div
              style={{
                display: "grid",
                gap: "14px",
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
                    isSelectedReportBeingRead
                      ? `1px solid ${isPaused ? "#fdba74" : "#86efac"}`
                      : "1px solid #e5e7eb",
                  background:
                    isSelectedReportBeingRead
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
                    color: isSelectedReportBeingRead
                      ? isPaused
                        ? "#b45309"
                        : "#047857"
                      : "#64748b",
                  }}
                >
                  {isSelectedReportBeingRead
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
                  {isSelectedReportBeingRead
                    ? isPaused
                      ? "現在のレポートを一時停止しています。"
                      : currentSegment
                        ? `現在は ${currentSegment.kind} を読み上げています。`
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
                  padding: "10px 12px",
                  borderRadius: "12px",
                  border:
                    isSelectedReportBeingRead && currentSegment?.kind === "title"
                      ? `1px solid ${isPaused ? "#fdba74" : "#86efac"}`
                      : "1px solid transparent",
                  background:
                    isSelectedReportBeingRead && currentSegment?.kind === "title"
                      ? isPaused
                        ? "#fff7ed"
                        : "#f0fdf4"
                      : "transparent",
                  transition:
                    "border-color 140ms ease, background 140ms ease",
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
                  background:
                    isSelectedReportBeingRead && currentSegment?.kind === "summary"
                      ? isPaused
                        ? "#fff7ed"
                        : "#f0fdf4"
                      : "#f9fafb",
                  border:
                    isSelectedReportBeingRead && currentSegment?.kind === "summary"
                      ? `1px solid ${isPaused ? "#fdba74" : "#86efac"}`
                      : "1px solid #e5e7eb",
                  fontSize: "13px",
                  lineHeight: 1.7,
                  color: "#4b5563",
                  minHeight: "88px",
                  maxHeight: "88px",
                  display: "flex",
                  alignItems: "flex-start",
                  overflow: "hidden",
                  transition:
                    "border-color 140ms ease, background 140ms ease",
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
                  display: "grid",
                  gap: "12px",
                }}
              >
                {selectedBodyParagraphs.map((paragraph, index) => {
                  const segmentIndex = index + 2;
                  const isActiveParagraph =
                    isSelectedReportBeingRead &&
                    currentSegment?.kind === "body" &&
                    currentSegmentIndex === segmentIndex;

                  return (
                    <section
                      key={`${selectedReport.id}-paragraph-${index}`}
                      style={{
                        padding: "14px 16px",
                        borderRadius: "12px",
                        border: isActiveParagraph
                          ? `1px solid ${isPaused ? "#fdba74" : "#86efac"}`
                          : "1px solid #e5e7eb",
                        background: isActiveParagraph
                          ? isPaused
                            ? "#fff7ed"
                            : "#f0fdf4"
                          : "#ffffff",
                        color: "#111827",
                        fontSize: "14px",
                        lineHeight: 1.9,
                        boxShadow: isActiveParagraph
                          ? "0 0 0 3px rgba(34, 197, 94, 0.10)"
                          : "none",
                        transition:
                          "border-color 140ms ease, background 140ms ease, box-shadow 140ms ease",
                      }}
                    >
                      {paragraph}
                    </section>
                  );
                })}
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