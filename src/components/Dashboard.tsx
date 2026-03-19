import { useState } from "react";
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
import {
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