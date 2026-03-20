import { useEffect, useMemo, useState } from "react";
import StreamCard from "./StreamCard";
import StatusPill from "./StatusPill";
import SectionHeader from "./SectionHeader";
import DashboardSummary from "./DashboardSummary";
import DashboardDetailPanel from "./DashboardDetailPanel";
import DashboardExtraContent from "./DashboardExtraContent";
import type { HomeActivityItem } from "./HomeActivityFeed";
import { dashboardSections } from "../dashboardData/sections";
import { settingsChecks as initialSettingsChecks } from "../dashboardData/settingsData";
import { libraryAssets as initialLibraryAssets } from "../dashboardData/libraryData";
import { streamEvents as initialStreamEvents } from "../dashboardData/streamData";
import { reportItems as initialReportItems } from "../dashboardData/reportData";
import type {
  LibraryAsset,
  ReportRecord,
  ReportStatus,
  SettingCheck,
  StreamEvent,
} from "../dashboardData/types";
import type { NavigationSection } from "../navigationItems";
import type { DashboardSnapshot } from "../utils/dashboardSnapshot";
import { STORAGE_KEYS } from "../utils/storageKeys";
import { readStorageJSON, writeStorageJSON } from "../utils/safeLocalStorage";
import {
  DASHBOARD_STORAGE_NAMESPACE,
  type LibraryFilter,
  type LibrarySort,
  type PersistedLibraryState,
  type PersistedSettingsState,
  type PersistedStreamState,
  readStoredLibraryState,
  readStoredSettingsState,
  readStoredStreamState,
  type SettingsFilter,
  type StreamFilter,
  type StreamSort,
} from "../utils/dashboardState";
import useDashboardDerivedState from "../hooks/useDashboardDerivedState";
import useDashboardActions from "../hooks/useDashboardActions";
import useDashboardPersistence from "../hooks/useDashboardPersistence";

type DashboardProps = {
  currentSection: NavigationSection;
  onSelectSection: (section: NavigationSection) => void;
};

const REPORT_SELECTION_STORAGE_KEY = "deepstream:selected-report-id";

function createActivityId() {
  return `activity-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createTimeLabel() {
  return new Date().toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isValidActivityItem(value: unknown): value is HomeActivityItem {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.detail === "string" &&
    typeof value.timeLabel === "string" &&
    (value.tone === "neutral" ||
      value.tone === "success" ||
      value.tone === "warning") &&
    (value.category === "system" ||
      value.category === "settings" ||
      value.category === "library" ||
      value.category === "stream")
  );
}

function createInitialActivityItems(): HomeActivityItem[] {
  return [
    {
      id: createActivityId(),
      title: "Session Ready",
      detail: "DeepStream の現在セッションを開始しました。",
      timeLabel: createTimeLabel(),
      tone: "neutral",
      category: "system",
    },
  ];
}

function readStoredActivityItems(): HomeActivityItem[] {
  const fallback = createInitialActivityItems();

  const parsed = readStorageJSON<unknown>(
    STORAGE_KEYS.activityFeed,
    DASHBOARD_STORAGE_NAMESPACE,
    fallback
  );

  if (!Array.isArray(parsed)) {
    return fallback;
  }

  const validItems = parsed.filter(isValidActivityItem);

  if (parsed.length > 0 && validItems.length === 0) {
    return fallback;
  }

  return validItems;
}

function readStoredSelectedReportId() {
  const fallback = initialReportItems[0]?.id ?? null;

  const parsed = readStorageJSON<string | null>(
    REPORT_SELECTION_STORAGE_KEY,
    DASHBOARD_STORAGE_NAMESPACE,
    fallback
  );

  if (typeof parsed !== "string" && parsed !== null) {
    return fallback;
  }

  if (parsed === null) {
    return fallback;
  }

  const exists = initialReportItems.some((item) => item.id === parsed);
  return exists ? parsed : fallback;
}

function Dashboard({
  currentSection,
  onSelectSection,
}: DashboardProps) {
  const [settingsPersistedState] = useState<PersistedSettingsState>(() =>
    readStoredSettingsState(initialSettingsChecks)
  );
  const [libraryPersistedState] = useState<PersistedLibraryState>(() =>
    readStoredLibraryState(initialLibraryAssets)
  );
  const [streamPersistedState] = useState<PersistedStreamState>(() =>
    readStoredStreamState(initialStreamEvents)
  );

  const [settingsItems, setSettingsItems] = useState<SettingCheck[]>(
    settingsPersistedState.settingsItems
  );
  const [settingsFilter, setSettingsFilter] = useState<SettingsFilter>(
    settingsPersistedState.settingsFilter
  );
  const [showSettingsNotes, setShowSettingsNotes] = useState<boolean>(
    settingsPersistedState.showSettingsNotes
  );

  const [libraryItems, setLibraryItems] = useState<LibraryAsset[]>(
    libraryPersistedState.libraryItems
  );
  const [libraryFilter, setLibraryFilter] = useState<LibraryFilter>(
    libraryPersistedState.libraryFilter
  );
  const [librarySort, setLibrarySort] = useState<LibrarySort>(
    libraryPersistedState.librarySort
  );
  const [librarySearchTerm, setLibrarySearchTerm] = useState<string>(
    libraryPersistedState.librarySearchTerm
  );

  const [streamItems, setStreamItems] = useState<StreamEvent[]>(
    streamPersistedState.streamItems
  );
  const [streamFilter, setStreamFilter] = useState<StreamFilter>(
    streamPersistedState.streamFilter
  );
  const [streamSort, setStreamSort] = useState<StreamSort>(
    streamPersistedState.streamSort
  );

  const [activityItems, setActivityItems] = useState<HomeActivityItem[]>(() =>
    readStoredActivityItems()
  );

  const [reportItems, setReportItems] = useState<ReportRecord[]>(initialReportItems);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(() =>
    readStoredSelectedReportId()
  );

  const section = dashboardSections[currentSection];

  useDashboardPersistence({
    settingsItems,
    settingsFilter,
    showSettingsNotes,
    libraryItems,
    libraryFilter,
    librarySort,
    librarySearchTerm,
    streamItems,
    streamFilter,
    streamSort,
  });

  useEffect(() => {
    writeStorageJSON(
      STORAGE_KEYS.activityFeed,
      activityItems,
      DASHBOARD_STORAGE_NAMESPACE
    );
  }, [activityItems]);

  useEffect(() => {
    writeStorageJSON(
      REPORT_SELECTION_STORAGE_KEY,
      selectedReportId,
      DASHBOARD_STORAGE_NAMESPACE
    );
  }, [selectedReportId]);

  useEffect(() => {
    if (reportItems.length === 0) {
      if (selectedReportId !== null) {
        setSelectedReportId(null);
      }
      return;
    }

    if (!selectedReportId) {
      setSelectedReportId(reportItems[0].id);
      return;
    }

    const exists = reportItems.some((item) => item.id === selectedReportId);
    if (!exists) {
      setSelectedReportId(reportItems[0].id);
    }
  }, [reportItems, selectedReportId]);

  const {
    filteredSettingsChecks,
    filteredLibraryAssets,
    filteredStreamEvents,
    settingsStateCounts,
    libraryStateCounts,
    streamPhaseCounts,
    userCreatedEventCount,
    userCreatedAssetCount,
  } = useDashboardDerivedState({
    settingsItems,
    settingsFilter,
    libraryItems,
    libraryFilter,
    librarySort,
    librarySearchTerm,
    streamItems,
    streamFilter,
    streamSort,
  });

  const {
    handleCycleSettingState,
    handleToggleSettingsNotes,
    handleRemoveLibraryAsset,
    handleRemoveStreamEvent,
    handleAddLibraryAsset,
    handleAddStreamEvent,
    handleResetSettings,
    handleResetLibrary,
    handleResetStream,
  } = useDashboardActions({
    initialSettingsChecks,
    initialLibraryAssets,
    initialStreamEvents,
    setSettingsItems,
    setSettingsFilter,
    setShowSettingsNotes,
    setLibraryItems,
    setLibraryFilter,
    setLibrarySort,
    setLibrarySearchTerm,
    setStreamItems,
    setStreamFilter,
    setStreamSort,
  });

  const pushActivity = (
    title: string,
    detail: string,
    tone: HomeActivityItem["tone"],
    category: HomeActivityItem["category"]
  ) => {
    setActivityItems((current) =>
      [
        {
          id: createActivityId(),
          title,
          detail,
          timeLabel: createTimeLabel(),
          tone,
          category,
        },
        ...current,
      ].slice(0, 12)
    );
  };

  const snapshot = useMemo<DashboardSnapshot>(
    () => ({
      version: 1,
      exportedAt: new Date().toISOString(),
      currentSection,
      settings: {
        items: settingsItems,
        filter: settingsFilter,
        showNotes: showSettingsNotes,
      },
      library: {
        items: libraryItems,
        filter: libraryFilter,
        sort: librarySort,
        searchTerm: librarySearchTerm,
      },
      stream: {
        items: streamItems,
        filter: streamFilter,
        sort: streamSort,
      },
    }),
    [
      currentSection,
      settingsItems,
      settingsFilter,
      showSettingsNotes,
      libraryItems,
      libraryFilter,
      librarySort,
      librarySearchTerm,
      streamItems,
      streamFilter,
      streamSort,
    ]
  );

  const handleClearActivity = () => {
    setActivityItems([]);
  };

  const handleExportSnapshot = () => {
    pushActivity(
      "Snapshot Exported",
      "現在のワークスペース状態を JSON として書き出しました。",
      "neutral",
      "system"
    );
  };

  const handleImportSnapshot = (nextSnapshot: DashboardSnapshot) => {
    setSettingsItems(nextSnapshot.settings.items);
    setSettingsFilter(nextSnapshot.settings.filter);
    setShowSettingsNotes(nextSnapshot.settings.showNotes);

    setLibraryItems(nextSnapshot.library.items);
    setLibraryFilter(nextSnapshot.library.filter);
    setLibrarySort(nextSnapshot.library.sort);
    setLibrarySearchTerm(nextSnapshot.library.searchTerm);

    setStreamItems(nextSnapshot.stream.items);
    setStreamFilter(nextSnapshot.stream.filter);
    setStreamSort(nextSnapshot.stream.sort);

    onSelectSection(nextSnapshot.currentSection);

    pushActivity(
      "Snapshot Imported",
      `スナップショットを読み込み、「${nextSnapshot.currentSection}」を復元しました。`,
      "success",
      "system"
    );
  };

  const handleResetWorkspace = () => {
    handleResetSettings();
    handleResetLibrary();
    handleResetStream();
    onSelectSection("ホーム");

    pushActivity(
      "Workspace Reset",
      "ワークスペース全体を初期状態へ戻しました。",
      "warning",
      "system"
    );
  };

  const handleSetSettingsFilterWithActivity = (
    filter: "all" | SettingCheck["state"]
  ) => {
    setSettingsFilter(filter);
    pushActivity(
      "Settings Filter Changed",
      `設定フィルタを「${filter}」へ切り替えました。`,
      "neutral",
      "settings"
    );
  };

  const handleToggleSettingsNotesWithActivity = () => {
    const nextValue = !showSettingsNotes;
    handleToggleSettingsNotes();
    pushActivity(
      "Notes Visibility Changed",
      `設定ノート表示を ${nextValue ? "on" : "off"} に切り替えました。`,
      "neutral",
      "settings"
    );
  };

  const handleCycleSettingStateWithActivity = (label: string) => {
    handleCycleSettingState(label);
    pushActivity(
      "Setting Updated",
      `設定項目「${label}」の状態を切り替えました。`,
      "neutral",
      "settings"
    );
  };

  const handleResetSettingsWithActivity = () => {
    handleResetSettings();
    pushActivity(
      "Settings Reset",
      "設定チェックと表示状態を初期状態へ戻しました。",
      "warning",
      "settings"
    );
  };

  const handleSetLibraryFilterWithActivity = (
    filter: "all" | LibraryAsset["state"]
  ) => {
    setLibraryFilter(filter);
    pushActivity(
      "Library Filter Changed",
      `ライブラリフィルタを「${filter}」へ切り替えました。`,
      "neutral",
      "library"
    );
  };

  const handleSetLibrarySortWithActivity = (sort: "name" | "state") => {
    setLibrarySort(sort);
    pushActivity(
      "Library Sort Changed",
      `ライブラリ並び順を「${sort}」へ切り替えました。`,
      "neutral",
      "library"
    );
  };

  const handleSetLibrarySearchTermWithActivity = (searchTerm: string) => {
    setLibrarySearchTerm(searchTerm);
    pushActivity(
      "Library Search Changed",
      searchTerm.trim().length > 0
        ? `ライブラリ検索語を「${searchTerm}」へ更新しました。`
        : "ライブラリ検索語をクリアしました。",
      "neutral",
      "library"
    );
  };

  const handleAddLibraryAssetWithActivity = (asset: Omit<LibraryAsset, "id">) => {
    const trimmedName = asset.name.trim();
    const trimmedRole = asset.role.trim();
    const trimmedNote = asset.note.trim();

    if (!trimmedName || !trimmedRole || !trimmedNote) {
      return;
    }

    handleAddLibraryAsset(asset);
    pushActivity(
      "Library Asset Added",
      `ライブラリアセット「${trimmedName}」を追加しました。`,
      "success",
      "library"
    );
  };

  const handleUpdateLibraryAssetWithActivity = (
    assetId: string,
    asset: Omit<LibraryAsset, "id">
  ) => {
    const targetAsset = libraryItems.find((item) => item.id === assetId);
    const trimmedName = asset.name.trim();
    const trimmedRole = asset.role.trim();
    const trimmedNote = asset.note.trim();

    if (!trimmedName || !trimmedRole || !trimmedNote) {
      return;
    }

    setLibraryItems((currentItems) =>
      currentItems.map((item) =>
        item.id === assetId
          ? {
              ...item,
              name: trimmedName,
              role: trimmedRole,
              note: trimmedNote,
              state: asset.state,
            }
          : item
      )
    );

    pushActivity(
      "Library Asset Edited",
      targetAsset
        ? `ライブラリアセット「${targetAsset.name}」を更新しました。`
        : "ライブラリアセットを更新しました。",
      "success",
      "library"
    );
  };

  const handleRemoveLibraryAssetWithActivity = (assetId: string) => {
    const targetAsset = libraryItems.find((item) => item.id === assetId);

    handleRemoveLibraryAsset(assetId);
    pushActivity(
      "Library Asset Removed",
      targetAsset
        ? `ライブラリアセット「${targetAsset.name}」を削除しました。`
        : "ライブラリアセットを削除しました。",
      "warning",
      "library"
    );
  };

  const handleResetLibraryWithActivity = () => {
    handleResetLibrary();
    pushActivity(
      "Library Reset",
      "ライブラリの一覧と表示状態を初期状態へ戻しました。",
      "warning",
      "library"
    );
  };

  const handleSetStreamFilterWithActivity = (
    filter: "all" | StreamEvent["phase"]
  ) => {
    setStreamFilter(filter);
    pushActivity(
      "Stream Filter Changed",
      `ストリームフィルタを「${filter}」へ切り替えました。`,
      "neutral",
      "stream"
    );
  };

  const handleSetStreamSortWithActivity = (
    sort: "timeline" | "newest" | "planned"
  ) => {
    setStreamSort(sort);
    pushActivity(
      "Stream Sort Changed",
      `ストリーム並び順を「${sort}」へ切り替えました。`,
      "neutral",
      "stream"
    );
  };

  const handleAddStreamEventWithActivity = (event: Omit<StreamEvent, "id">) => {
    const trimmedTitle = event.title.trim();
    const trimmedDetail = event.detail.trim();

    if (!trimmedTitle || !trimmedDetail) {
      return;
    }

    handleAddStreamEvent(event);
    pushActivity(
      "Stream Event Added",
      `ストリームイベント「${trimmedTitle}」を追加しました。`,
      "success",
      "stream"
    );
  };

  const handleUpdateStreamEventWithActivity = (
    eventId: string,
    event: Omit<StreamEvent, "id">
  ) => {
    const targetEvent = streamItems.find((item) => item.id === eventId);
    const trimmedTitle = event.title.trim();
    const trimmedDetail = event.detail.trim();

    if (!trimmedTitle || !trimmedDetail) {
      return;
    }

    setStreamItems((currentItems) =>
      currentItems.map((item) =>
        item.id === eventId
          ? {
              ...item,
              title: trimmedTitle,
              detail: trimmedDetail,
              phase: event.phase,
            }
          : item
      )
    );

    pushActivity(
      "Stream Event Edited",
      targetEvent
        ? `ストリームイベント「${targetEvent.title}」を更新しました。`
        : "ストリームイベントを更新しました。",
      "success",
      "stream"
    );
  };

  const handleRemoveStreamEventWithActivity = (eventId: string) => {
    const targetEvent = streamItems.find((item) => item.id === eventId);

    handleRemoveStreamEvent(eventId);
    pushActivity(
      "Stream Event Removed",
      targetEvent
        ? `ストリームイベント「${targetEvent.title}」を削除しました。`
        : "ストリームイベントを削除しました。",
      "warning",
      "stream"
    );
  };

  const handleResetStreamWithActivity = () => {
    handleResetStream();
    pushActivity(
      "Stream Reset",
      "ストリームの一覧と表示状態を初期状態へ戻しました。",
      "warning",
      "stream"
    );
  };

  const handleSelectReport = (reportId: string) => {
    setSelectedReportId(reportId);
  };

  const handleCycleReportStatus = (reportId: string) => {
    setReportItems((currentItems) =>
      currentItems.map((item) => {
        if (item.id !== reportId) {
          return item;
        }

        const nextStatusMap: Record<ReportStatus, ReportStatus> = {
          new: "reading",
          reading: "archived",
          archived: "new",
        };

        const nextStatus = nextStatusMap[item.status];

        pushActivity(
          "Report Status Changed",
          `レポート「${item.title}」の状態を ${nextStatus} に切り替えました。`,
          "neutral",
          "system"
        );

        return {
          ...item,
          status: nextStatus,
        };
      })
    );
  };

  return (
    <section>
      <SectionHeader
        title={`${currentSection} Dashboard`}
        description={section.description}
        right={
          <StatusPill
            label={`表示カード数: ${section.cards.length}`}
            tone="gray"
            uppercase={false}
          />
        }
      />

      <DashboardSummary
        sectionLabel={currentSection}
        statusLabel={section.statusLabel}
        focusLabel={section.focusLabel}
      />

      <DashboardDetailPanel
        title="Section Details"
        items={section.detailItems}
      />

      <DashboardExtraContent
        currentSection={currentSection}
        onSelectSection={onSelectSection}
        snapshot={snapshot}
        activityItems={activityItems}
        onClearActivity={handleClearActivity}
        onExportSnapshot={handleExportSnapshot}
        onImportSnapshot={handleImportSnapshot}
        onResetWorkspace={handleResetWorkspace}
        filteredSettingsChecks={filteredSettingsChecks}
        settingsFilter={settingsFilter}
        showSettingsNotes={showSettingsNotes}
        settingsItemsCount={settingsItems.length}
        filteredSettingsCount={filteredSettingsChecks.length}
        settingsStateCounts={settingsStateCounts}
        onSetSettingsFilter={handleSetSettingsFilterWithActivity}
        onToggleSettingsNotes={handleToggleSettingsNotesWithActivity}
        onCycleSettingState={handleCycleSettingStateWithActivity}
        onResetSettings={handleResetSettingsWithActivity}
        filteredLibraryAssets={filteredLibraryAssets}
        libraryFilter={libraryFilter}
        librarySort={librarySort}
        librarySearchTerm={librarySearchTerm}
        libraryItemsCount={libraryItems.length}
        filteredLibraryAssetsCount={filteredLibraryAssets.length}
        libraryStateCounts={libraryStateCounts}
        userCreatedAssetCount={userCreatedAssetCount}
        onSetLibraryFilter={handleSetLibraryFilterWithActivity}
        onSetLibrarySort={handleSetLibrarySortWithActivity}
        onSetLibrarySearchTerm={handleSetLibrarySearchTermWithActivity}
        onAddLibraryAsset={handleAddLibraryAssetWithActivity}
        onUpdateLibraryAsset={handleUpdateLibraryAssetWithActivity}
        onRemoveLibraryAsset={handleRemoveLibraryAssetWithActivity}
        onResetLibrary={handleResetLibraryWithActivity}
        filteredStreamEvents={filteredStreamEvents}
        streamFilter={streamFilter}
        streamSort={streamSort}
        streamEventsCount={streamItems.length}
        filteredStreamEventsCount={filteredStreamEvents.length}
        streamPhaseCounts={streamPhaseCounts}
        userCreatedEventCount={userCreatedEventCount}
        onSetStreamFilter={handleSetStreamFilterWithActivity}
        onSetStreamSort={handleSetStreamSortWithActivity}
        onAddStreamEvent={handleAddStreamEventWithActivity}
        onUpdateStreamEvent={handleUpdateStreamEventWithActivity}
        onRemoveStreamEvent={handleRemoveStreamEventWithActivity}
        onResetStream={handleResetStreamWithActivity}
        reportItems={reportItems}
        selectedReportId={selectedReportId}
        onSelectReport={handleSelectReport}
        onCycleReportStatus={handleCycleReportStatus}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginTop: "24px",
        }}
      >
        {section.cards.map((card) => (
          <StreamCard
            key={card.title}
            title={card.title}
            description={card.description}
            type={card.type}
          />
        ))}
      </div>
    </section>
  );
}

export default Dashboard;