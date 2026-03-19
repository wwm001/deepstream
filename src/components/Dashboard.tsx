import { useEffect, useState } from "react";
import StreamCard from "./StreamCard";
import StatusPill from "./StatusPill";
import SectionHeader from "./SectionHeader";
import DashboardSummary from "./DashboardSummary";
import DashboardDetailPanel from "./DashboardDetailPanel";
import DashboardExtraContent from "./DashboardExtraContent";
import { dashboardSections } from "../dashboardData/sections";
import { settingsChecks as initialSettingsChecks } from "../dashboardData/settingsData";
import { libraryAssets as initialLibraryAssets } from "../dashboardData/libraryData";
import { streamEvents as initialStreamEvents } from "../dashboardData/streamData";
import type {
  LibraryAsset,
  SettingCheck,
  StreamEvent,
} from "../dashboardData/types";
import type { NavigationSection } from "../navigationItems";
import { STORAGE_KEYS } from "../utils/storageKeys";
import {
  removeStorageItem,
  writeStorageJSON,
} from "../utils/safeLocalStorage";
import {
  cloneLibraryItems,
  cloneSettingsItems,
  cloneStreamItems,
  createClientId,
  DASHBOARD_STORAGE_NAMESPACE,
  type LibraryFilter,
  type LibrarySort,
  nextSettingStateMap,
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

type DashboardProps = {
  currentSection: NavigationSection;
  onSelectSection: (section: NavigationSection) => void;
};

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

  const section = dashboardSections[currentSection];

  useEffect(() => {
    writeStorageJSON(
      STORAGE_KEYS.settingsState,
      {
        settingsItems,
        settingsFilter,
        showSettingsNotes,
      },
      DASHBOARD_STORAGE_NAMESPACE
    );
  }, [settingsItems, settingsFilter, showSettingsNotes]);

  useEffect(() => {
    writeStorageJSON(
      STORAGE_KEYS.libraryState,
      {
        libraryItems,
        libraryFilter,
        librarySort,
        librarySearchTerm,
      },
      DASHBOARD_STORAGE_NAMESPACE
    );
  }, [libraryItems, libraryFilter, librarySort, librarySearchTerm]);

  useEffect(() => {
    writeStorageJSON(
      STORAGE_KEYS.streamState,
      {
        streamItems,
        streamFilter,
        streamSort,
      },
      DASHBOARD_STORAGE_NAMESPACE
    );
  }, [streamItems, streamFilter, streamSort]);

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

  const handleCycleSettingState = (label: string) => {
    setSettingsItems((currentItems) =>
      currentItems.map((item) =>
        item.label === label
          ? {
              ...item,
              state: nextSettingStateMap[item.state],
            }
          : item
      )
    );
  };

  const handleToggleSettingsNotes = () => {
    setShowSettingsNotes((current) => !current);
  };

  const handleRemoveLibraryAsset = (assetId: string) => {
    setLibraryItems((currentItems) =>
      currentItems.filter((item) => item.id !== assetId)
    );
  };

  const handleRemoveStreamEvent = (eventId: string) => {
    setStreamItems((currentItems) =>
      currentItems.filter((item) => item.id !== eventId)
    );
  };

  const handleAddLibraryAsset = (asset: Omit<LibraryAsset, "id">) => {
    const trimmedName = asset.name.trim();
    const trimmedRole = asset.role.trim();
    const trimmedNote = asset.note.trim();

    if (!trimmedName || !trimmedRole || !trimmedNote) {
      return;
    }

    const newAsset: LibraryAsset = {
      id: createClientId("library-user-"),
      name: trimmedName,
      role: trimmedRole,
      note: trimmedNote,
      state: asset.state,
    };

    setLibraryItems((currentItems) => [...currentItems, newAsset]);
  };

  const handleAddStreamEvent = (event: Omit<StreamEvent, "id">) => {
    const trimmedTitle = event.title.trim();
    const trimmedDetail = event.detail.trim();

    if (!trimmedTitle || !trimmedDetail) {
      return;
    }

    const newEvent: StreamEvent = {
      id: createClientId("stream-user-"),
      title: trimmedTitle,
      detail: trimmedDetail,
      phase: event.phase,
    };

    setStreamItems((currentItems) => [...currentItems, newEvent]);
  };

  const handleResetSettings = () => {
    removeStorageItem(STORAGE_KEYS.settingsState, DASHBOARD_STORAGE_NAMESPACE);
    setSettingsItems(cloneSettingsItems(initialSettingsChecks));
    setSettingsFilter("all");
    setShowSettingsNotes(true);
  };

  const handleResetLibrary = () => {
    removeStorageItem(STORAGE_KEYS.libraryState, DASHBOARD_STORAGE_NAMESPACE);
    setLibraryItems(cloneLibraryItems(initialLibraryAssets));
    setLibraryFilter("all");
    setLibrarySort("name");
    setLibrarySearchTerm("");
  };

  const handleResetStream = () => {
    removeStorageItem(STORAGE_KEYS.streamState, DASHBOARD_STORAGE_NAMESPACE);
    setStreamItems(cloneStreamItems(initialStreamEvents));
    setStreamFilter("all");
    setStreamSort("timeline");
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
        filteredSettingsChecks={filteredSettingsChecks}
        settingsFilter={settingsFilter}
        showSettingsNotes={showSettingsNotes}
        settingsItemsCount={settingsItems.length}
        filteredSettingsCount={filteredSettingsChecks.length}
        settingsStateCounts={settingsStateCounts}
        onSetSettingsFilter={setSettingsFilter}
        onToggleSettingsNotes={handleToggleSettingsNotes}
        onCycleSettingState={handleCycleSettingState}
        onResetSettings={handleResetSettings}
        filteredLibraryAssets={filteredLibraryAssets}
        libraryFilter={libraryFilter}
        librarySort={librarySort}
        librarySearchTerm={librarySearchTerm}
        libraryItemsCount={libraryItems.length}
        filteredLibraryAssetsCount={filteredLibraryAssets.length}
        libraryStateCounts={libraryStateCounts}
        userCreatedAssetCount={userCreatedAssetCount}
        onSetLibraryFilter={setLibraryFilter}
        onSetLibrarySort={setLibrarySort}
        onSetLibrarySearchTerm={setLibrarySearchTerm}
        onAddLibraryAsset={handleAddLibraryAsset}
        onRemoveLibraryAsset={handleRemoveLibraryAsset}
        onResetLibrary={handleResetLibrary}
        filteredStreamEvents={filteredStreamEvents}
        streamFilter={streamFilter}
        streamSort={streamSort}
        streamEventsCount={streamItems.length}
        filteredStreamEventsCount={filteredStreamEvents.length}
        streamPhaseCounts={streamPhaseCounts}
        userCreatedEventCount={userCreatedEventCount}
        onSetStreamFilter={setStreamFilter}
        onSetStreamSort={setStreamSort}
        onAddStreamEvent={handleAddStreamEvent}
        onRemoveStreamEvent={handleRemoveStreamEvent}
        onResetStream={handleResetStream}
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