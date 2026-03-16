import { useMemo } from "react";
import SectionHeader from "./SectionHeader";
import StatusPill from "./StatusPill";
import DashboardSummary from "./DashboardSummary";
import DashboardDetailPanel from "./DashboardDetailPanel";
import HomeSectionContent from "./HomeSectionContent";
import StreamSectionContent from "./StreamSectionContent";
import LibrarySectionContent from "./LibrarySectionContent";
import SettingsSectionContent from "./SettingsSectionContent";
import { dashboardSections, totalDashboardCards, totalSections } from "../data/dashboard";
import type { NavigationSection } from "../navigationItems";
import { useStreamState } from "../hooks/useStreamState";
import { useSettingsState } from "../hooks/useSettingsState";
import { useLibraryState } from "../hooks/useLibraryState";
import { buildHomeSnapshotItems } from "../utils/buildHomeSnapshotItems";

type DashboardProps = {
  currentSection: NavigationSection;
};

function Dashboard({ currentSection }: DashboardProps) {
  const section = dashboardSections[currentSection];

  const {
    streamFilter,
    setStreamFilter,
    streamSort,
    setStreamSort,
    events,
    filteredStreamEvents,
    phaseCounts,
    userCreatedEventCount,
    addStreamEvent,
    removeStreamEvent,
  } = useStreamState();

  const {
    settingsItems,
    settingsFilter,
    setSettingsFilter,
    showSettingsNotes,
    toggleSettingsNotes,
    filteredSettingsChecks,
    summaryCounts: settingsStateCounts,
    cycleSettingState,
  } = useSettingsState();

  const {
    libraryItems,
    libraryFilter,
    setLibraryFilter,
    librarySort,
    setLibrarySort,
    librarySearchTerm,
    setLibrarySearchTerm,
    filteredLibraryAssets,
    summaryCounts: libraryStateCounts,
    userCreatedAssetCount,
    addLibraryAsset,
    removeLibraryAsset,
  } = useLibraryState();

  const homeSystemSnapshotItems = useMemo(
    () =>
      buildHomeSnapshotItems({
        currentSection,
        totalSections,
        totalDashboardCards,
        filteredLibraryAssetsCount: filteredLibraryAssets.length,
        filteredStreamEventsCount: filteredStreamEvents.length,
        filteredSettingsChecksCount: filteredSettingsChecks.length,
        libraryFilter,
        librarySort,
        librarySearchTerm,
        libraryItemsCount: libraryItems.length,
        libraryStateCounts,
        streamFilter,
        streamSort,
        streamEventsCount: events.length,
        streamPhaseCounts: phaseCounts,
        settingsFilter,
        showSettingsNotes,
        settingsItemsCount: settingsItems.length,
        settingsStateCounts,
        userCreatedEventCount,
        userCreatedAssetCount,
      }),
    [
      currentSection,
      filteredLibraryAssets.length,
      filteredStreamEvents.length,
      filteredSettingsChecks.length,
      libraryFilter,
      libraryItems.length,
      librarySearchTerm,
      librarySort,
      libraryStateCounts,
      events.length,
      phaseCounts,
      settingsFilter,
      showSettingsNotes,
      settingsItems.length,
      settingsStateCounts,
      userCreatedEventCount,
      userCreatedAssetCount,
    ]
  );

  const renderSectionContent = () => {
    switch (currentSection) {
      case "ホーム":
        return <HomeSectionContent snapshotItems={homeSystemSnapshotItems} />;
      case "ストリーム":
        return (
          <StreamSectionContent
            streamFilter={streamFilter}
            onStreamFilterChange={setStreamFilter}
            streamSort={streamSort}
            onStreamSortChange={setStreamSort}
            filteredStreamEvents={filteredStreamEvents}
            totalStreamEvents={events.length}
            phaseCounts={phaseCounts}
            onAddStreamEvent={addStreamEvent}
            onRemoveStreamEvent={removeStreamEvent}
          />
        );
      case "ライブラリ":
        return (
          <LibrarySectionContent
            libraryFilter={libraryFilter}
            onLibraryFilterChange={setLibraryFilter}
            librarySort={librarySort}
            onLibrarySortChange={setLibrarySort}
            librarySearchTerm={librarySearchTerm}
            onLibrarySearchTermChange={setLibrarySearchTerm}
            filteredLibraryAssets={filteredLibraryAssets}
            totalLibraryAssets={libraryItems.length}
            summaryCounts={libraryStateCounts}
            onAddLibraryAsset={addLibraryAsset}
            onRemoveLibraryAsset={removeLibraryAsset}
          />
        );
      case "設定":
        return (
          <SettingsSectionContent
            settingsFilter={settingsFilter}
            onSettingsFilterChange={setSettingsFilter}
            showSettingsNotes={showSettingsNotes}
            onToggleSettingsNotes={toggleSettingsNotes}
            filteredSettingsChecks={filteredSettingsChecks}
            totalSettingsChecks={settingsItems.length}
            summaryCounts={settingsStateCounts}
            onCycleSettingState={cycleSettingState}
          />
        );
      default:
        return null;
    }
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

      {renderSectionContent()}
    </section>
  );
}

export default Dashboard;