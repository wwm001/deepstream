import { useEffect, useMemo, useRef, useState } from "react";
import type { ReportRecord, ReportStatus } from "../dashboardData/types";
import DashboardPanel from "./DashboardPanel";
import DashboardBadge from "./DashboardBadge";
import DashboardActionButton from "./DashboardActionButton";
import { readStorageJSON, writeStorageJSON } from "../utils/safeLocalStorage";
import { DASHBOARD_STORAGE_NAMESPACE } from "../utils/dashboardState";

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

type PronunciationEntry = {
  source: string;
  target: string;
};

const PRONUNCIATION_DICTIONARY_STORAGE_KEY =
  "deepstream:report-pronunciation-dictionary";

const defaultPronunciationDictionary: PronunciationEntry[] = [
  { source: "Reports Queue", target: "レポートキュー" },
  { source: "Report Reader", target: "レポートリーダー" },
  { source: "DeepStream", target: "ディープストリーム" },
  { source: "READ", target: "リード" },
  { source: "Read", target: "リード" },
  { source: "Queue", target: "キュー" },
  { source: "reader", target: "リーダー" },
  { source: "Reader", target: "リーダー" },
  { source: "report", target: "レポート" },
  { source: "Report", target: "レポート" },
  { source: "MVP", target: "エムブイピー" },
  { source: "TTS", target: "ティーティーエス" },
  { source: "UI", target: "ユーアイ" },
];

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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isValidPronunciationEntry(value: unknown): value is PronunciationEntry {
  return (
    isRecord(value) &&
    typeof value.source === "string" &&
    typeof value.target === "string"
  );
}

function normalizePronunciationDictionary(
  entries: PronunciationEntry[]
): PronunciationEntry[] {
  const seen = new Set<string>();

  return entries
    .map((entry) => ({
      source: entry.source.trim(),
      target: entry.target.trim(),
    }))
    .filter((entry) => entry.source.length > 0 && entry.target.length > 0)
    .filter((entry) => {
      const key = entry.source.toLowerCase();

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    })
    .sort((a, b) => b.source.length - a.source.length);
}

function readStoredPronunciationDictionary() {
  const parsed = readStorageJSON<unknown>(
    PRONUNCIATION_DICTIONARY_STORAGE_KEY,
    DASHBOARD_STORAGE_NAMESPACE,
    defaultPronunciationDictionary
  );

  if (!Array.isArray(parsed)) {
    return normalizePronunciationDictionary(defaultPronunciationDictionary);
  }

  if (parsed.length === 0) {
    return [];
  }

  const validEntries = parsed.filter(isValidPronunciationEntry);

  if (validEntries.length === 0) {
    return normalizePronunciationDictionary(defaultPronunciationDictionary);
  }

  return normalizePronunciationDictionary(validEntries);
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function applyPronunciationDictionary(
  text: string,
  dictionary: PronunciationEntry[]
) {
  return dictionary.reduce((currentText, entry) => {
    const pattern = new RegExp(escapeRegExp(entry.source), "gi");
    return currentText.replace(pattern, entry.target);
  }, text);
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
  const [pronunciationDictionary, setPronunciationDictionary] = useState<
    PronunciationEntry[]
  >(() => readStoredPronunciationDictionary());
  const [dictionarySourceInput, setDictionarySourceInput] = useState("");
  const [dictionaryTargetInput, setDictionaryTargetInput] = useState("");
  const [dictionaryError, setDictionaryError] = useState<string | null>(null);
  const [editingDictionaryKey, setEditingDictionaryKey] = useState<
    string | null
  >(null);
  const [editingDictionarySource, setEditingDictionarySource] = useState("");
  const [editingDictionaryTarget, setEditingDictionaryTarget] = useState("");

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const segmentQueueRef = useRef<ReportSegment[]>([]);
  const activeReportIdRef = useRef<string | null>(null);
  const playbackSessionIdRef = useRef(0);
  const pronunciationDictionaryRef = useRef<PronunciationEntry[]>(
    pronunciationDictionary
  );

  const speechSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    pronunciationDictionaryRef.current = pronunciationDictionary;

    writeStorageJSON(
      PRONUNCIATION_DICTIONARY_STORAGE_KEY,
      pronunciationDictionary,
      DASHBOARD_STORAGE_NAMESPACE
    );
  }, [pronunciationDictionary]);

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

  const resetDictionaryInputs = () => {
    setDictionarySourceInput("");
    setDictionaryTargetInput("");
  };

  const cancelDictionaryEditing = () => {
    setEditingDictionaryKey(null);
    setEditingDictionarySource("");
    setEditingDictionaryTarget("");
  };

  const upsertPronunciationEntry = (
    sourceValue: string,
    targetValue: string,
    previousSourceKey?: string | null
  ) => {
    const normalizedSource = sourceValue.trim();
    const normalizedTarget = targetValue.trim();

    if (normalizedSource.length === 0 || normalizedTarget.length === 0) {
      setDictionaryError("source と target の両方を入力してください。");
      return false;
    }

    const nextEntries = normalizePronunciationDictionary([
      ...pronunciationDictionary.filter((entry) => {
        const entryKey = entry.source.toLowerCase();

        if (previousSourceKey && entryKey === previousSourceKey) {
          return false;
        }

        if (entryKey === normalizedSource.toLowerCase()) {
          return false;
        }

        return true;
      }),
      {
        source: normalizedSource,
        target: normalizedTarget,
      },
    ]);

    setPronunciationDictionary(nextEntries);
    setDictionaryError(null);
    return true;
  };

  const handleDictionaryAdd = () => {
    const added = upsertPronunciationEntry(
      dictionarySourceInput,
      dictionaryTargetInput
    );

    if (!added) {
      return;
    }

    resetDictionaryInputs();
  };

  const handleDictionaryEditStart = (entry: PronunciationEntry) => {
    setEditingDictionaryKey(entry.source.toLowerCase());
    setEditingDictionarySource(entry.source);
    setEditingDictionaryTarget(entry.target);
    setDictionaryError(null);
  };

  const handleDictionaryEditSave = () => {
    if (!editingDictionaryKey) {
      return;
    }

    const saved = upsertPronunciationEntry(
      editingDictionarySource,
      editingDictionaryTarget,
      editingDictionaryKey
    );

    if (!saved) {
      return;
    }

    cancelDictionaryEditing();
  };

  const handleDictionaryRemove = (entry: PronunciationEntry) => {
    const shouldRemove =
      typeof window === "undefined"
        ? true
        : window.confirm(`"${entry.source}" を辞書から削除しますか？`);

    if (!shouldRemove) {
      return;
    }

    setPronunciationDictionary((currentEntries) =>
      currentEntries.filter(
        (currentEntry) =>
          currentEntry.source.toLowerCase() !== entry.source.toLowerCase()
      )
    );

    if (editingDictionaryKey === entry.source.toLowerCase()) {
      cancelDictionaryEditing();
    }

    setDictionaryError(null);
  };

  const finishReading = (sessionId?: number) => {
    if (
      typeof sessionId === "number" &&
      playbackSessionIdRef.current !== sessionId
    ) {
      return;
    }

    utteranceRef.current = null;
    segmentQueueRef.current = [];
    activeReportIdRef.current = null;
    setIsReading(false);
    setIsPaused(false);
    setReadingReportId(null);
    setCurrentSegmentIndex(null);
  };

  const stopReading = () => {
    if (!speechSupported) {
      return;
    }

    playbackSessionIdRef.current += 1;
    window.speechSynthesis.cancel();
    finishReading();
  };

  const speakSegmentAt = (sessionId: number, segmentIndex: number) => {
    if (!speechSupported) {
      return;
    }

    const segment = segmentQueueRef.current[segmentIndex];

    if (!segment) {
      finishReading(sessionId);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(
      applyPronunciationDictionary(
        segment.text,
        pronunciationDictionaryRef.current
      )
    );
    utterance.rate = playbackRate;
    utterance.lang = "ja-JP";

    utterance.onstart = () => {
      if (playbackSessionIdRef.current !== sessionId) {
        return;
      }

      setIsReading(true);
      setIsPaused(false);
      setReadingReportId(activeReportIdRef.current);
      setCurrentSegmentIndex(segmentIndex);
    };

    utterance.onpause = () => {
      if (playbackSessionIdRef.current !== sessionId) {
        return;
      }

      setIsPaused(true);
    };

    utterance.onresume = () => {
      if (playbackSessionIdRef.current !== sessionId) {
        return;
      }

      setIsPaused(false);
    };

    utterance.onend = () => {
      if (playbackSessionIdRef.current !== sessionId) {
        return;
      }

      const nextIndex = segmentIndex + 1;

      if (nextIndex < segmentQueueRef.current.length) {
        speakSegmentAt(sessionId, nextIndex);
        return;
      }

      finishReading(sessionId);
    };

    utterance.onerror = () => {
      finishReading(sessionId);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const startReadingFromSegment = (segmentIndex: number) => {
    if (!speechSupported || !selectedReport) {
      return;
    }

    const segments = buildReportSegments(selectedReport);

    if (segmentIndex < 0 || segmentIndex >= segments.length) {
      return;
    }

    playbackSessionIdRef.current += 1;
    const sessionId = playbackSessionIdRef.current;

    window.speechSynthesis.cancel();
    activeReportIdRef.current = selectedReport.id;
    segmentQueueRef.current = segments;
    setCurrentSegmentIndex(segmentIndex);
    speakSegmentAt(sessionId, segmentIndex);
  };

  const startReading = () => {
    startReadingFromSegment(0);
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

  const skipToNextSegment = () => {
    if (!speechSupported || !selectedReport || currentSegmentIndex == null) {
      return;
    }

    const nextIndex = currentSegmentIndex + 1;

    if (nextIndex >= selectedSegments.length) {
      stopReading();
      return;
    }

    startReadingFromSegment(nextIndex);
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

  const canSkipNext =
    speechSupported &&
    selectedReport != null &&
    currentSegmentIndex != null &&
    currentSegmentIndex < selectedSegments.length - 1;

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

          <p
            style={{
              margin: 0,
              fontSize: "12px",
              lineHeight: 1.6,
              color: "#64748b",
            }}
          >
            pronunciation dictionary active: {pronunciationDictionary.length}{" "}
            entries
          </p>
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
            label="skip next"
            onClick={skipToNextSegment}
            disabled={!canSkipNext}
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

      <DashboardPanel title="Pronunciation Dictionary">
        <div
          style={{
            display: "grid",
            gap: "14px",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "13px",
              lineHeight: 1.7,
              color: "#475569",
            }}
          >
            読み上げ直前に source を target へ置換します。保存後は次の発話から即反映されます。
          </p>

          <div
            style={{
              display: "grid",
              gap: "10px",
              padding: "14px",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              background: "#f8fafc",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "minmax(180px, 1fr) minmax(180px, 1fr) auto",
                gap: "10px",
                alignItems: "end",
              }}
            >
              <label
                style={{
                  display: "grid",
                  gap: "6px",
                  fontSize: "12px",
                  color: "#475569",
                  fontWeight: 600,
                }}
              >
                <span>source</span>
                <input
                  type="text"
                  value={dictionarySourceInput}
                  onChange={(event) => setDictionarySourceInput(event.target.value)}
                  placeholder="DeepStream"
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
              </label>

              <label
                style={{
                  display: "grid",
                  gap: "6px",
                  fontSize: "12px",
                  color: "#475569",
                  fontWeight: 600,
                }}
              >
                <span>target</span>
                <input
                  type="text"
                  value={dictionaryTargetInput}
                  onChange={(event) => setDictionaryTargetInput(event.target.value)}
                  placeholder="ディープストリーム"
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
              </label>

              <button
                type="button"
                onClick={handleDictionaryAdd}
                style={{
                  height: "40px",
                  padding: "0 14px",
                  borderRadius: "10px",
                  border: "1px solid #0ea5e9",
                  background: "#e0f2fe",
                  color: "#075985",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                add entry
              </button>
            </div>

            {dictionaryError && (
              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: "1px solid #fecaca",
                  background: "#fef2f2",
                  color: "#b91c1c",
                  fontSize: "12px",
                  lineHeight: 1.6,
                }}
              >
                {dictionaryError}
              </div>
            )}
          </div>

          <div
            style={{
              display: "grid",
              gap: "10px",
              maxHeight: "320px",
              overflowY: "auto",
              paddingRight: "4px",
            }}
          >
            {pronunciationDictionary.map((entry) => {
              const entryKey = entry.source.toLowerCase();
              const isEditing = editingDictionaryKey === entryKey;

              return (
                <div
                  key={entryKey}
                  style={{
                    display: "grid",
                    gap: "10px",
                    padding: "12px 14px",
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    background: "#ffffff",
                  }}
                >
                  {isEditing ? (
                    <>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "minmax(180px, 1fr) minmax(180px, 1fr)",
                          gap: "10px",
                        }}
                      >
                        <label
                          style={{
                            display: "grid",
                            gap: "6px",
                            fontSize: "12px",
                            color: "#475569",
                            fontWeight: 600,
                          }}
                        >
                          <span>source</span>
                          <input
                            type="text"
                            value={editingDictionarySource}
                            onChange={(event) =>
                              setEditingDictionarySource(event.target.value)
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
                          />
                        </label>

                        <label
                          style={{
                            display: "grid",
                            gap: "6px",
                            fontSize: "12px",
                            color: "#475569",
                            fontWeight: 600,
                          }}
                        >
                          <span>target</span>
                          <input
                            type="text"
                            value={editingDictionaryTarget}
                            onChange={(event) =>
                              setEditingDictionaryTarget(event.target.value)
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
                          />
                        </label>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          flexWrap: "wrap",
                          justifyContent: "flex-end",
                        }}
                      >
                        <button
                          type="button"
                          onClick={handleDictionaryEditSave}
                          style={{
                            height: "36px",
                            padding: "0 12px",
                            borderRadius: "10px",
                            border: "1px solid #16a34a",
                            background: "#f0fdf4",
                            color: "#166534",
                            fontSize: "12px",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          save
                        </button>

                        <button
                          type="button"
                          onClick={cancelDictionaryEditing}
                          style={{
                            height: "36px",
                            padding: "0 12px",
                            borderRadius: "10px",
                            border: "1px solid #d1d5db",
                            background: "#ffffff",
                            color: "#475569",
                            fontSize: "12px",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        style={{
                          display: "grid",
                          gap: "6px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#64748b",
                            letterSpacing: "0.04em",
                            textTransform: "uppercase",
                            fontWeight: 700,
                          }}
                        >
                          source
                        </div>
                        <div
                          style={{
                            fontSize: "14px",
                            color: "#111827",
                            fontWeight: 600,
                            lineHeight: 1.6,
                            wordBreak: "break-word",
                          }}
                        >
                          {entry.source}
                        </div>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gap: "6px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#64748b",
                            letterSpacing: "0.04em",
                            textTransform: "uppercase",
                            fontWeight: 700,
                          }}
                        >
                          target
                        </div>
                        <div
                          style={{
                            fontSize: "14px",
                            color: "#0f172a",
                            lineHeight: 1.6,
                            wordBreak: "break-word",
                          }}
                        >
                          {entry.target}
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          flexWrap: "wrap",
                          justifyContent: "flex-end",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => handleDictionaryEditStart(entry)}
                          style={{
                            height: "36px",
                            padding: "0 12px",
                            borderRadius: "10px",
                            border: "1px solid #d1d5db",
                            background: "#ffffff",
                            color: "#475569",
                            fontSize: "12px",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDictionaryRemove(entry)}
                          style={{
                            height: "36px",
                            padding: "0 12px",
                            borderRadius: "10px",
                            border: "1px solid #fecaca",
                            background: "#fff1f2",
                            color: "#be123c",
                            fontSize: "12px",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </DashboardPanel>

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
                role="button"
                tabIndex={speechSupported ? 0 : -1}
                onClick={() => startReadingFromSegment(0)}
                onKeyDown={(event) => {
                  if (!speechSupported) {
                    return;
                  }

                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    startReadingFromSegment(0);
                  }
                }}
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
                  cursor: speechSupported ? "pointer" : "default",
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
                role="button"
                tabIndex={speechSupported ? 0 : -1}
                onClick={() => startReadingFromSegment(1)}
                onKeyDown={(event) => {
                  if (!speechSupported) {
                    return;
                  }

                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    startReadingFromSegment(1);
                  }
                }}
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
                  cursor: speechSupported ? "pointer" : "default",
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
                      role="button"
                      tabIndex={speechSupported ? 0 : -1}
                      onClick={() => startReadingFromSegment(segmentIndex)}
                      onKeyDown={(event) => {
                        if (!speechSupported) {
                          return;
                        }

                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          startReadingFromSegment(segmentIndex);
                        }
                      }}
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
                        cursor: speechSupported ? "pointer" : "default",
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