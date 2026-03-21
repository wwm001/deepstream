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

type ReaderLanguage = "ja" | "en";
type DetectionConfidence = "high" | "medium" | "low";

type ReaderPlaybackRate = 0.8 | 1.0 | 1.2 | 1.5 | 2.0;
type VoiceSelectionsByLanguage = Record<ReaderLanguage, string>;
type PlaybackRatesByLanguage = Record<ReaderLanguage, ReaderPlaybackRate>;
type PronunciationDictionaryByLanguage = Record<
  ReaderLanguage,
  PronunciationEntry[]
>;

type ReaderLanguageConfig = {
  label: string;
  fallbackUtteranceLang: string;
  voiceLangPrefix: string;
  dictionarySourcePlaceholder: string;
  dictionaryTargetPlaceholder: string;
};

type DetectedLanguageSuggestion = {
  language: ReaderLanguage;
  confidence: DetectionConfidence;
  reason: string;
};

type ReaderSummaryItem = {
  label: string;
  value: string;
  wide?: boolean;
};

const playbackRates: ReaderPlaybackRate[] = [0.8, 1.0, 1.2, 1.5, 2.0];
const reportFilters: ReportFilter[] = ["all", "new", "reading", "archived"];

const readerLanguageConfigs: Record<ReaderLanguage, ReaderLanguageConfig> = {
  ja: {
    label: "日本語",
    fallbackUtteranceLang: "ja-JP",
    voiceLangPrefix: "ja",
    dictionarySourcePlaceholder: "DeepStream",
    dictionaryTargetPlaceholder: "ディープストリーム",
  },
  en: {
    label: "English",
    fallbackUtteranceLang: "en-US",
    voiceLangPrefix: "en",
    dictionarySourcePlaceholder: "MVP",
    dictionaryTargetPlaceholder: "M V P",
  },
};

const readerLanguages = Object.keys(readerLanguageConfigs) as ReaderLanguage[];

const PRONUNCIATION_DICTIONARY_STORAGE_KEY =
  "deepstream:report-pronunciation-dictionary";
const REPORT_READER_LANGUAGE_STORAGE_KEY =
  "deepstream:report-reader-language";
const REPORT_READER_VOICE_SELECTIONS_STORAGE_KEY =
  "deepstream:report-reader-voice-selections";
const REPORT_READER_PLAYBACK_RATES_STORAGE_KEY =
  "deepstream:report-reader-playback-rates";

function mapReaderLanguages<T>(
  mapper: (language: ReaderLanguage) => T
): Record<ReaderLanguage, T> {
  return readerLanguages.reduce((accumulator, language) => {
    accumulator[language] = mapper(language);
    return accumulator;
  }, {} as Record<ReaderLanguage, T>);
}

const defaultPronunciationDictionaries: PronunciationDictionaryByLanguage = {
  ja: [
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
  ],
  en: [
    { source: "DeepStream", target: "Deep Stream" },
    { source: "READ", target: "read" },
    { source: "MVP", target: "M V P" },
    { source: "TTS", target: "T T S" },
    { source: "UI", target: "U I" },
    { source: "UX", target: "U X" },
    { source: "API", target: "A P I" },
    { source: "QA", target: "Q A" },
  ],
};

const defaultVoiceSelections: VoiceSelectionsByLanguage = mapReaderLanguages(
  () => ""
);

const defaultPlaybackRatesByLanguage: PlaybackRatesByLanguage =
  mapReaderLanguages(() => 1.0);

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

function splitBodyParagraphs(body: string) {
  return body
    .split(/\n\s*\n/g)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function buildReportSegments(report: ReportRecord): ReportSegment[] {
  return [
    {
      kind: "title",
      text: report.title,
    },
    {
      kind: "summary",
      text: report.summary,
    },
    ...splitBodyParagraphs(report.body).map((paragraph) => ({
      kind: "body" as const,
      text: paragraph,
    })),
  ];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isReaderLanguage(value: unknown): value is ReaderLanguage {
  return readerLanguages.includes(value as ReaderLanguage);
}

function isValidPronunciationEntry(value: unknown): value is PronunciationEntry {
  return (
    isRecord(value) &&
    typeof value.source === "string" &&
    typeof value.target === "string"
  );
}

function isValidPlaybackRate(value: unknown): value is ReaderPlaybackRate {
  return (
    typeof value === "number" &&
    playbackRates.includes(value as ReaderPlaybackRate)
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

function normalizePronunciationDictionaryField(
  value: unknown,
  fallback: PronunciationEntry[]
) {
  if (!Array.isArray(value)) {
    return normalizePronunciationDictionary(fallback);
  }

  if (value.length === 0) {
    return [];
  }

  const validEntries = value.filter(isValidPronunciationEntry);

  if (validEntries.length === 0) {
    return normalizePronunciationDictionary(fallback);
  }

  return normalizePronunciationDictionary(validEntries);
}

function readStoredReaderLanguage(): ReaderLanguage {
  const parsed = readStorageJSON<unknown>(
    REPORT_READER_LANGUAGE_STORAGE_KEY,
    DASHBOARD_STORAGE_NAMESPACE,
    "ja"
  );

  return isReaderLanguage(parsed) ? parsed : "ja";
}

function readStoredPronunciationDictionaries(): PronunciationDictionaryByLanguage {
  const parsed = readStorageJSON<unknown>(
    PRONUNCIATION_DICTIONARY_STORAGE_KEY,
    DASHBOARD_STORAGE_NAMESPACE,
    defaultPronunciationDictionaries
  );

  if (Array.isArray(parsed)) {
    return {
      ja: normalizePronunciationDictionaryField(
        parsed,
        defaultPronunciationDictionaries.ja
      ),
      en: [],
    };
  }

  if (!isRecord(parsed)) {
    return mapReaderLanguages((language) =>
      normalizePronunciationDictionary(defaultPronunciationDictionaries[language])
    );
  }

  return mapReaderLanguages((language) =>
    normalizePronunciationDictionaryField(
      parsed[language],
      defaultPronunciationDictionaries[language]
    )
  );
}

function readStoredVoiceSelections(): VoiceSelectionsByLanguage {
  const parsed = readStorageJSON<unknown>(
    REPORT_READER_VOICE_SELECTIONS_STORAGE_KEY,
    DASHBOARD_STORAGE_NAMESPACE,
    defaultVoiceSelections
  );

  if (typeof parsed === "string") {
    return {
      ja: parsed,
      en: "",
    };
  }

  if (!isRecord(parsed)) {
    return defaultVoiceSelections;
  }

  return mapReaderLanguages((language) =>
    typeof parsed[language] === "string" ? parsed[language] : ""
  );
}

function readStoredPlaybackRates(): PlaybackRatesByLanguage {
  const parsed = readStorageJSON<unknown>(
    REPORT_READER_PLAYBACK_RATES_STORAGE_KEY,
    DASHBOARD_STORAGE_NAMESPACE,
    defaultPlaybackRatesByLanguage
  );

  if (isValidPlaybackRate(parsed)) {
    return {
      ja: parsed,
      en: defaultPlaybackRatesByLanguage.en,
    };
  }

  if (!isRecord(parsed)) {
    return defaultPlaybackRatesByLanguage;
  }

  return mapReaderLanguages((language) =>
    isValidPlaybackRate(parsed[language])
      ? parsed[language]
      : defaultPlaybackRatesByLanguage[language]
  );
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

function sortVoices(voices: SpeechSynthesisVoice[]) {
  return [...voices].sort((a, b) => {
    const langComparison = a.lang.localeCompare(b.lang);
    if (langComparison !== 0) {
      return langComparison;
    }

    return a.name.localeCompare(b.name);
  });
}

function formatVoiceLabel(voice: SpeechSynthesisVoice) {
  const parts = [voice.name];

  if (voice.lang) {
    parts.push(voice.lang);
  }

  if (voice.default) {
    parts.push("default");
  }

  return parts.join(" / ");
}

function voiceMatchesLanguage(
  voice: SpeechSynthesisVoice,
  language: ReaderLanguage
) {
  return voice.lang
    .toLowerCase()
    .startsWith(readerLanguageConfigs[language].voiceLangPrefix);
}

function getLanguageLabel(language: ReaderLanguage) {
  return readerLanguageConfigs[language].label;
}

function getDetectionConfidenceLabel(confidence: DetectionConfidence) {
  if (confidence === "high") {
    return "high confidence";
  }

  if (confidence === "medium") {
    return "medium confidence";
  }

  return "low confidence";
}

function detectReaderLanguageFromReport(
  report: ReportRecord | null
): DetectedLanguageSuggestion | null {
  if (!report) {
    return null;
  }

  const text = `${report.title}\n${report.summary}\n${report.body}`.trim();

  if (text.length === 0) {
    return null;
  }

  const hiraganaMatches = text.match(/[\u3040-\u309f]/g) ?? [];
  const katakanaMatches = text.match(/[\u30a0-\u30ff]/g) ?? [];
  const kanjiMatches = text.match(/[\u4e00-\u9fff]/g) ?? [];
  const latinWordMatches =
    text.match(/[A-Za-z]+(?:['’-][A-Za-z]+)*/g) ?? [];
  const asciiLetterMatches = text.match(/[A-Za-z]/g) ?? [];

  const japaneseScore =
    hiraganaMatches.length * 3 +
    katakanaMatches.length * 2 +
    kanjiMatches.length * 1.5;
  const englishScore =
    latinWordMatches.length * 2 + asciiLetterMatches.length * 0.25;

  if (japaneseScore === 0 && englishScore === 0) {
    return null;
  }

  if (japaneseScore >= englishScore * 1.5 && japaneseScore >= 12) {
    return {
      language: "ja",
      confidence:
        japaneseScore >= englishScore * 3 ? "high" : "medium",
      reason:
        "ひらがな・カタカナ・漢字の比率が高いため、日本語読み上げを優先します。",
    };
  }

  if (englishScore >= japaneseScore * 1.5 && englishScore >= 12) {
    return {
      language: "en",
      confidence:
        englishScore >= japaneseScore * 3 ? "high" : "medium",
      reason:
        "英単語とアルファベットの比率が高いため、英語読み上げを優先します。",
    };
  }

  if (japaneseScore > englishScore) {
    return {
      language: "ja",
      confidence: "low",
      reason:
        "日本語要素がやや多いため、初期値を日本語へ寄せています。",
    };
  }

  if (englishScore > japaneseScore) {
    return {
      language: "en",
      confidence: "low",
      reason:
        "英語要素がやや多いため、初期値を English へ寄せています。",
    };
  }

  return null;
}

function ReportsPanel({
  items,
  selectedReportId,
  onSelectReport,
  onCycleReportStatus,
}: ReportsPanelProps) {
  const [selectedReaderLanguage, setSelectedReaderLanguage] =
    useState<ReaderLanguage>(() => readStoredReaderLanguage());
  const [selectedVoiceSelections, setSelectedVoiceSelections] =
    useState<VoiceSelectionsByLanguage>(() => readStoredVoiceSelections());
  const [selectedPlaybackRates, setSelectedPlaybackRates] =
    useState<PlaybackRatesByLanguage>(() => readStoredPlaybackRates());
  const [pronunciationDictionaries, setPronunciationDictionaries] =
    useState<PronunciationDictionaryByLanguage>(() =>
      readStoredPronunciationDictionaries()
    );
  const [availableVoices, setAvailableVoices] = useState<
    SpeechSynthesisVoice[]
  >([]);
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [readingReportId, setReadingReportId] = useState<string | null>(null);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState<number | null>(
    null
  );

  const [reportFilter, setReportFilter] = useState<ReportFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dictionarySourceInput, setDictionarySourceInput] = useState("");
  const [dictionaryTargetInput, setDictionaryTargetInput] = useState("");
  const [dictionaryError, setDictionaryError] = useState<string | null>(null);
  const [editingDictionaryKey, setEditingDictionaryKey] = useState<
    string | null
  >(null);
  const [editingDictionarySource, setEditingDictionarySource] = useState("");
  const [editingDictionaryTarget, setEditingDictionaryTarget] = useState("");

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const selectedVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const selectedReaderLanguageRef =
    useRef<ReaderLanguage>(selectedReaderLanguage);
  const playbackRateRef = useRef<ReaderPlaybackRate>(
    selectedPlaybackRates[selectedReaderLanguage]
  );
  const pronunciationDictionaryRef = useRef<PronunciationEntry[]>(
    pronunciationDictionaries[selectedReaderLanguage]
  );
  const segmentQueueRef = useRef<ReportSegment[]>([]);
  const activeReportIdRef = useRef<string | null>(null);
  const playbackSessionIdRef = useRef(0);
  const autoDetectedReportIdRef = useRef<string | null>(null);
  const manualReaderLanguageByReportRef = useRef<
    Partial<Record<string, ReaderLanguage>>
  >({});

  const speechSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  const playbackRate = selectedPlaybackRates[selectedReaderLanguage];
  const currentLanguageConfig = readerLanguageConfigs[selectedReaderLanguage];

  useEffect(() => {
    pronunciationDictionaryRef.current =
      pronunciationDictionaries[selectedReaderLanguage] ?? [];
  }, [pronunciationDictionaries, selectedReaderLanguage]);

  useEffect(() => {
    writeStorageJSON(
      PRONUNCIATION_DICTIONARY_STORAGE_KEY,
      pronunciationDictionaries,
      DASHBOARD_STORAGE_NAMESPACE
    );
  }, [pronunciationDictionaries]);

  useEffect(() => {
    writeStorageJSON(
      REPORT_READER_LANGUAGE_STORAGE_KEY,
      selectedReaderLanguage,
      DASHBOARD_STORAGE_NAMESPACE
    );
    selectedReaderLanguageRef.current = selectedReaderLanguage;
  }, [selectedReaderLanguage]);

  useEffect(() => {
    writeStorageJSON(
      REPORT_READER_VOICE_SELECTIONS_STORAGE_KEY,
      selectedVoiceSelections,
      DASHBOARD_STORAGE_NAMESPACE
    );
  }, [selectedVoiceSelections]);

  useEffect(() => {
    writeStorageJSON(
      REPORT_READER_PLAYBACK_RATES_STORAGE_KEY,
      selectedPlaybackRates,
      DASHBOARD_STORAGE_NAMESPACE
    );
  }, [selectedPlaybackRates]);

  useEffect(() => {
    playbackRateRef.current = playbackRate;
  }, [playbackRate]);

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

  const selectedReportIdValue = selectedReport?.id ?? null;

  const detectedLanguageSuggestion = useMemo(
    () => detectReaderLanguageFromReport(selectedReport),
    [selectedReport]
  );

  const filteredVoices = useMemo(
    () =>
      availableVoices.filter((voice) =>
        voiceMatchesLanguage(voice, selectedReaderLanguage)
      ),
    [availableVoices, selectedReaderLanguage]
  );

  const activePronunciationDictionary = useMemo(
    () => pronunciationDictionaries[selectedReaderLanguage] ?? [],
    [pronunciationDictionaries, selectedReaderLanguage]
  );

  const selectedVoiceURI = selectedVoiceSelections[selectedReaderLanguage];

  const selectedVoice = useMemo(
    () =>
      filteredVoices.find((voice) => voice.voiceURI === selectedVoiceURI) ?? null,
    [filteredVoices, selectedVoiceURI]
  );

  useEffect(() => {
    selectedVoiceRef.current = selectedVoice;
  }, [selectedVoice]);

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

  const updateSelectedReaderLanguage = (
    nextLanguage: ReaderLanguage,
    mode: "auto" | "manual" = "manual"
  ) => {
    if (mode === "manual" && selectedReportIdValue) {
      manualReaderLanguageByReportRef.current[selectedReportIdValue] = nextLanguage;
    }

    setSelectedReaderLanguage(nextLanguage);
  };

  const updateSelectedVoiceForLanguage = (
    language: ReaderLanguage,
    voiceURI: string
  ) => {
    setSelectedVoiceSelections((currentSelections) => ({
      ...currentSelections,
      [language]: voiceURI,
    }));
  };

  const updatePlaybackRateForLanguage = (
    language: ReaderLanguage,
    nextRate: ReaderPlaybackRate
  ) => {
    setSelectedPlaybackRates((currentRates) => ({
      ...currentRates,
      [language]: nextRate,
    }));
  };

  const updatePronunciationDictionaryForLanguage = (
    language: ReaderLanguage,
    nextEntries: PronunciationEntry[]
  ) => {
    setPronunciationDictionaries((currentDictionaries) => ({
      ...currentDictionaries,
      [language]: nextEntries,
    }));
  };

  const resetDictionaryInputs = () => {
    setDictionarySourceInput("");
    setDictionaryTargetInput("");
  };

  const cancelDictionaryEditing = () => {
    setEditingDictionaryKey(null);
    setEditingDictionarySource("");
    setEditingDictionaryTarget("");
  };

  const applyDetectedLanguageSuggestion = () => {
    if (!detectedLanguageSuggestion) {
      return;
    }

    updateSelectedReaderLanguage(detectedLanguageSuggestion.language, "manual");
  };

  useEffect(() => {
    setDictionaryError(null);
    cancelDictionaryEditing();
    resetDictionaryInputs();
  }, [selectedReaderLanguage]);

  useEffect(() => {
    if (!speechSupported) {
      return;
    }

    const synthesis = window.speechSynthesis;

    const loadVoices = () => {
      setAvailableVoices(sortVoices(synthesis.getVoices()));
    };

    loadVoices();

    if (typeof synthesis.addEventListener === "function") {
      synthesis.addEventListener("voiceschanged", loadVoices);

      return () => {
        synthesis.removeEventListener("voiceschanged", loadVoices);
      };
    }

    const previousHandler = synthesis.onvoiceschanged;
    synthesis.onvoiceschanged = loadVoices;

    return () => {
      synthesis.onvoiceschanged = previousHandler;
    };
  }, [speechSupported]);

  useEffect(() => {
    if (!selectedReportIdValue) {
      autoDetectedReportIdRef.current = null;
      return;
    }

    if (autoDetectedReportIdRef.current === selectedReportIdValue) {
      return;
    }

    autoDetectedReportIdRef.current = selectedReportIdValue;

    const manualLanguage =
      manualReaderLanguageByReportRef.current[selectedReportIdValue];

    if (manualLanguage) {
      setSelectedReaderLanguage(manualLanguage);
      return;
    }

    if (detectedLanguageSuggestion) {
      updateSelectedReaderLanguage(detectedLanguageSuggestion.language, "auto");
    }
  }, [selectedReportIdValue, detectedLanguageSuggestion]);

  const handleDictionaryEditStart = (entry: PronunciationEntry) => {
    setEditingDictionaryKey(entry.source.toLowerCase());
    setEditingDictionarySource(entry.source);
    setEditingDictionaryTarget(entry.target);
    setDictionaryError(null);
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
      ...activePronunciationDictionary.filter((entry) => {
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

    updatePronunciationDictionaryForLanguage(selectedReaderLanguage, nextEntries);
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

    updatePronunciationDictionaryForLanguage(
      selectedReaderLanguage,
      activePronunciationDictionary.filter(
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
      applyPronunciationDictionary(segment.text, pronunciationDictionaryRef.current)
    );

    utterance.rate = playbackRateRef.current;
    utterance.lang = currentLanguageConfig.fallbackUtteranceLang;

    if (selectedVoiceRef.current) {
      utterance.voice = selectedVoiceRef.current;
      utterance.lang = selectedVoiceRef.current.lang;
    }

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

    if (segmentIndex < 0 || segmentIndex >= selectedSegments.length) {
      return;
    }

    playbackSessionIdRef.current += 1;
    const sessionId = playbackSessionIdRef.current;

    window.speechSynthesis.cancel();
    activeReportIdRef.current = selectedReport.id;
    segmentQueueRef.current = selectedSegments;
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

    if (selectedReportIdValue !== readingReportId) {
      stopReading();
    }
  }, [selectedReportIdValue, readingReportId, isReading]);

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

  const currentLanguageLabel = getLanguageLabel(selectedReaderLanguage);

  const voiceStatusLabel = !speechSupported
    ? "speech unavailable"
    : filteredVoices.length === 0
      ? `${currentLanguageLabel} の voice が見つかりません`
      : selectedVoice
        ? formatVoiceLabel(selectedVoice)
        : selectedVoiceURI
          ? "stored voice unavailable"
          : `default ${currentLanguageLabel} voice`;

  const detectedLanguageLabel = detectedLanguageSuggestion
    ? getLanguageLabel(detectedLanguageSuggestion.language)
    : null;

  const detectedConfidenceLabel = detectedLanguageSuggestion
    ? getDetectionConfidenceLabel(detectedLanguageSuggestion.confidence)
    : null;

  const selectedReportStatusLabel = !speechSupported
    ? "speech unavailable"
    : selectedReport
      ? `selected report: ${selectedReport.title}`
      : "selected report ready";

  const readerSummaryItems: ReaderSummaryItem[] = [
    {
      label: "language",
      value: currentLanguageLabel,
    },
    {
      label: "voice",
      value: voiceStatusLabel,
      wide: true,
    },
    {
      label: "speed",
      value: `${playbackRate.toFixed(1)}x`,
    },
    {
      label: "dictionary",
      value: `${activePronunciationDictionary.length} entries`,
    },
  ];

  const isDetectedLanguageDifferent =
    Boolean(detectedLanguageSuggestion) &&
    detectedLanguageSuggestion?.language !== selectedReaderLanguage;

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
                wordBreak: "break-word",
              }}
            >
              {selectedReportStatusLabel}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "stretch",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            {readerSummaryItems.map((item) => {
              const isWide = item.wide === true;

              return (
                <div
                  key={item.label}
                  style={{
                    display: "grid",
                    gap: "2px",
                    minWidth: isWide ? "220px" : "120px",
                    maxWidth: isWide ? "min(360px, 100%)" : "180px",
                    padding: "8px 10px",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    background: "rgba(255, 255, 255, 0.88)",
                  }}
                >
                  <span
                    style={{
                      fontSize: "10px",
                      lineHeight: 1.4,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "#64748b",
                    }}
                  >
                    {item.label}
                  </span>
                  <span
                    title={item.value}
                    style={{
                      fontSize: "12px",
                      lineHeight: 1.5,
                      color: "#0f172a",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.value}
                  </span>
                </div>
              );
            })}
          </div>

          {detectedLanguageSuggestion ? (
            <div
              style={{
                display: "grid",
                gap: "8px",
                marginTop: "4px",
                padding: "10px 12px",
                borderRadius: "12px",
                border: "1px solid #dbeafe",
                background: "#f8fbff",
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
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "4px 8px",
                    borderRadius: "999px",
                    border: "1px solid #bfdbfe",
                    background: "#eff6ff",
                    color: "#1d4ed8",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  auto-detect
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    lineHeight: 1.6,
                    color: "#1e3a8a",
                    fontWeight: 700,
                  }}
                >
                  {detectedLanguageLabel} / {detectedConfidenceLabel}
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
                {detectedLanguageSuggestion.reason}
              </p>

              {isDetectedLanguageDifferent ? (
                <div>
                  <button
                    type="button"
                    onClick={applyDetectedLanguageSuggestion}
                    style={{
                      height: "34px",
                      padding: "0 12px",
                      borderRadius: "10px",
                      border: "1px solid #93c5fd",
                      background: "#eff6ff",
                      color: "#1d4ed8",
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    switch to detected language ({detectedLanguageLabel})
                  </button>
                </div>
              ) : (
                <p
                  style={{
                    margin: 0,
                    fontSize: "12px",
                    lineHeight: 1.6,
                    color: "#1d4ed8",
                    fontWeight: 600,
                  }}
                >
                  current language already matches the detected suggestion.
                </p>
              )}
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gap: "6px",
                marginTop: "4px",
                padding: "10px 12px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                background: "rgba(255, 255, 255, 0.72)",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  lineHeight: 1.4,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: "#64748b",
                }}
              >
                auto-detect
              </span>
              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  lineHeight: 1.6,
                  color: "#94a3b8",
                }}
              >
                current report から言語を明確に判定できませんでした。
              </p>
            </div>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gap: "8px",
            marginLeft: "auto",
            minWidth: "300px",
            maxWidth: "100%",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto minmax(180px, 1fr)",
              alignItems: "center",
              gap: "8px",
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
                updatePlaybackRateForLanguage(
                  selectedReaderLanguage,
                  Number(event.target.value) as ReaderPlaybackRate
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

            <label
              style={{
                fontSize: "12px",
                color: "#475569",
                fontWeight: 600,
              }}
            >
              language
            </label>

            <select
              value={selectedReaderLanguage}
              onChange={(event) =>
                updateSelectedReaderLanguage(
                  event.target.value as ReaderLanguage,
                  "manual"
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
              {readerLanguages.map((language) => (
                <option key={language} value={language}>
                  {readerLanguageConfigs[language].label}
                </option>
              ))}
            </select>

            <label
              style={{
                fontSize: "12px",
                color: "#475569",
                fontWeight: 600,
              }}
            >
              voice
            </label>

            <select
              value={selectedVoiceURI}
              onChange={(event) =>
                updateSelectedVoiceForLanguage(
                  selectedReaderLanguage,
                  event.target.value
                )
              }
              disabled={!speechSupported}
              style={{
                padding: "8px 10px",
                borderRadius: "10px",
                border: "1px solid #d1d5db",
                background: speechSupported ? "#ffffff" : "#f8fafc",
                color: "#111827",
                fontSize: "13px",
              }}
            >
              <option value="">default system voice</option>
              {filteredVoices.map((voice) => (
                <option key={voice.voiceURI} value={voice.voiceURI}>
                  {formatVoiceLabel(voice)}
                </option>
              ))}
            </select>
          </div>

          <p
            style={{
              margin: 0,
              fontSize: "12px",
              lineHeight: 1.6,
              color: "#64748b",
            }}
          >
            voice options: {filteredVoices.length} available for{" "}
            {currentLanguageLabel}
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexWrap: "wrap",
              justifyContent: "flex-end",
            }}
          >
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
                              letterSpacing: "0.04em",
                              textTransform: "uppercase",
                            }}
                          >
                            <span
                              aria-hidden="true"
                              style={{
                                width: "8px",
                                height: "8px",
                                borderRadius: "999px",
                                background: isPaused ? "#f97316" : "#22c55e",
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
                        color: "#475569",
                      }}
                    >
                      {item.summary}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "12px",
                        flexWrap: "wrap",
                        marginTop: "auto",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "12px",
                          color: "#64748b",
                        }}
                      >
                        {splitBodyParagraphs(item.body).length} paragraphs
                      </span>

                      <span
                        style={{
                          fontSize: "12px",
                          color: isSelected ? "#0891b2" : "#94a3b8",
                          fontWeight: 600,
                        }}
                      >
                        {isSelected ? "selected" : "open"}
                      </span>
                    </div>
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
              }}
            >
              <div
                style={{
                  display: "grid",
                  gap: "10px",
                  padding: "16px",
                  borderRadius: "14px",
                  border: "1px solid #e5e7eb",
                  background: "#f8fafc",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    gap: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gap: "6px",
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "18px",
                        lineHeight: 1.5,
                        color: "#0f172a",
                      }}
                    >
                      {selectedReport.title}
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "12px",
                        color: "#64748b",
                      }}
                    >
                      {selectedReport.source} ・ {selectedReport.createdAt}
                    </p>
                  </div>

                  <DashboardBadge
                    label={statusStyles[selectedReport.status].label}
                    color={statusStyles[selectedReport.status].color}
                    background={statusStyles[selectedReport.status].background}
                  />
                </div>

                <p
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    lineHeight: 1.8,
                    color: "#475569",
                  }}
                >
                  {selectedReport.summary}
                </p>
              </div>

              <div
                style={{
                  display: "grid",
                  gap: "10px",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: "12px",
                    lineHeight: 1.6,
                    color: "#64748b",
                  }}
                >
                  title / summary / body の順で読み上げます。body paragraph を押すと、その段落から再生します。
                </p>

                <div
                  style={{
                    display: "grid",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: "#64748b",
                      }}
                    >
                      title
                    </div>
                    <button
                      type="button"
                      onClick={() => startReadingFromSegment(0)}
                      style={{
                        textAlign: "left",
                        borderRadius: "12px",
                        border:
                          currentSegment?.kind === "title" &&
                          isSelectedReportBeingRead
                            ? "2px solid #22c55e"
                            : "1px solid #e5e7eb",
                        background:
                          currentSegment?.kind === "title" &&
                          isSelectedReportBeingRead
                            ? "#f0fdf4"
                            : "#ffffff",
                        padding: "14px",
                        cursor: "pointer",
                        color: "#0f172a",
                        fontSize: "15px",
                        lineHeight: 1.7,
                      }}
                    >
                      {selectedReport.title}
                    </button>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: "#64748b",
                      }}
                    >
                      summary
                    </div>
                    <button
                      type="button"
                      onClick={() => startReadingFromSegment(1)}
                      style={{
                        textAlign: "left",
                        borderRadius: "12px",
                        border:
                          currentSegment?.kind === "summary" &&
                          isSelectedReportBeingRead
                            ? "2px solid #22c55e"
                            : "1px solid #e5e7eb",
                        background:
                          currentSegment?.kind === "summary" &&
                          isSelectedReportBeingRead
                            ? "#f0fdf4"
                            : "#ffffff",
                        padding: "14px",
                        cursor: "pointer",
                        color: "#334155",
                        fontSize: "14px",
                        lineHeight: 1.8,
                      }}
                    >
                      {selectedReport.summary}
                    </button>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "10px",
                        flexWrap: "wrap",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "12px",
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          color: "#64748b",
                        }}
                      >
                        body paragraphs
                      </div>

                      <span
                        style={{
                          fontSize: "12px",
                          color: "#64748b",
                        }}
                      >
                        {selectedBodyParagraphs.length} paragraphs
                      </span>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gap: "10px",
                      }}
                    >
                      {selectedBodyParagraphs.map((paragraph, index) => {
                        const segmentIndex = index + 2;
                        const isCurrentParagraph =
                          isSelectedReportBeingRead &&
                          currentSegment?.kind === "body" &&
                          currentSegmentIndex === segmentIndex;

                        return (
                          <button
                            key={`${selectedReport.id}-paragraph-${index}`}
                            type="button"
                            onClick={() => startReadingFromSegment(segmentIndex)}
                            style={{
                              textAlign: "left",
                              borderRadius: "12px",
                              border: isCurrentParagraph
                                ? "2px solid #22c55e"
                                : "1px solid #e5e7eb",
                              background: isCurrentParagraph
                                ? "#f0fdf4"
                                : "#ffffff",
                              padding: "14px",
                              cursor: "pointer",
                              display: "grid",
                              gap: "8px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: "10px",
                                flexWrap: "wrap",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "11px",
                                  fontWeight: 700,
                                  letterSpacing: "0.06em",
                                  textTransform: "uppercase",
                                  color: "#64748b",
                                }}
                              >
                                paragraph {index + 1}
                              </span>

                              {isCurrentParagraph && (
                                <span
                                  style={{
                                    fontSize: "11px",
                                    fontWeight: 700,
                                    color: "#16a34a",
                                  }}
                                >
                                  now reading
                                </span>
                              )}
                            </div>

                            <span
                              style={{
                                fontSize: "14px",
                                lineHeight: 1.85,
                                color: "#334155",
                                whiteSpace: "pre-wrap",
                              }}
                            >
                              {paragraph}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
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
              読み上げ対象のレポートを選択してください。
            </div>
          )}
        </DashboardPanel>
      </div>

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
            読み上げ直前に source を target へ置換します。現在は {currentLanguageLabel}
            用の辞書を編集中です。
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
                  placeholder={currentLanguageConfig.dictionarySourcePlaceholder}
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
                  placeholder={currentLanguageConfig.dictionaryTargetPlaceholder}
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
            {activePronunciationDictionary.length > 0 ? (
              activePronunciationDictionary.map((entry) => {
                const entryKey = entry.source.toLowerCase();
                const isEditing = editingDictionaryKey === entryKey;

                return (
                  <div
                    key={`${selectedReaderLanguage}-${entryKey}`}
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
              })
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
                {currentLanguageLabel} 用の辞書エントリはまだありません。
              </div>
            )}
          </div>
        </div>
      </DashboardPanel>
    </div>
  );
}

export default ReportsPanel;