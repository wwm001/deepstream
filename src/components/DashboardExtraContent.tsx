import type { ReactNode } from "react";
import type {
  LibraryAsset,
  SettingCheck,
  StreamEvent,
} from "../dashboardData/types";
import {
  createHomeSectionSnapshots,
  createHomeSignals,
} from "../dashboardData/homeData";
import type { NavigationSection } from "../navigationItems";
import HomeOverviewPanel from "./HomeOverviewPanel";
import HomeSectionSnapshotList from "./HomeSectionSnapshotList";
import SettingsControlPanel from "./SettingsControlPanel";
import SettingsStatusList from "./SettingsStatusList";
import LibraryControlPanel from "./LibraryControlPanel";
import LibraryAssetList from "./LibraryAssetList";
import StreamControlPanel from "./StreamControlPanel";
import StreamEventTimeline from "./StreamEventTimeline";

type DashboardExtraContentProps = {
  currentSection: NavigationSection;
  onSelectSection: (section: NavigationSection) => void;

  filteredSettingsChecks: SettingCheck[];
  settingsFilter: "all" | SettingCheck["state"];
  showSettingsNotes: boolean;
  settingsItemsCount: number;
  filteredSettingsCount: number;
  settingsStateCounts: {
    okCount: number;
    watchCount: number;
    nextCount: number;
  };
  onSetSettingsFilter: (filter: "all" | SettingCheck["state"]) => void;
  onToggleSettingsNotes: () => void;
  onCycleSettingState: (label: string) => void;
  onResetSettings: () => void;

  filteredLibraryAssets: LibraryAsset[];
  libraryFilter: "all" | LibraryAsset["state"];
  librarySort: "name" | "state";
  librarySearchTerm: string;
  libraryItemsCount: number;
  filteredLibraryAssetsCount: number;
  libraryStateCounts: {
    stableCount: number;
    activeCount: number;
    nextCount: number;
  };
  userCreatedAssetCount: number;
  onSetLibraryFilter: (filter: "all" | LibraryAsset["state"]) => void;
  onSetLibrarySort: (sort: "name" | "state") => void;
  onSetLibrarySearchTerm: (searchTerm: string) => void;
  onAddLibraryAsset: (asset: Omit<LibraryAsset, "id">) => void;
  onRemoveLibraryAsset: (assetId: string) => void;
  onResetLibrary: () => void;

  filteredStreamEvents: StreamEvent[];
  streamFilter: "all" | StreamEvent["phase"];
  streamSort: "timeline" | "newest" | "planned";
  streamEventsCount: number;
  filteredStreamEventsCount: number;
  streamPhaseCounts: {
    doneCount: number;
    currentCount: number;
    nextCount: number;
  };
  userCreatedEventCount: number;
  onSetStreamFilter: (filter: "all" | StreamEvent["phase"]) => void;
  onSetStreamSort: (sort: "timeline" | "newest" | "planned") => void;
  onAddStreamEvent: (event: Omit<StreamEvent, "id">) => void;
  onRemoveStreamEvent: (eventId: string) => void;
  onResetStream: () => void;
};

function DashboardExtraContent({
  currentSection,
  onSelectSection,
  filteredSettingsChecks,
  settingsFilter,
  showSettingsNotes,
  settingsItemsCount,
  filteredSettingsCount,
  settingsStateCounts,
  onSetSettingsFilter,
  onToggleSettingsNotes,
  onCycleSettingState,
  onResetSettings,
  filteredLibraryAssets,
  libraryFilter,
  librarySort,
  librarySearchTerm,
  libraryItemsCount,
  filteredLibraryAssetsCount,
  libraryStateCounts,
  userCreatedAssetCount,
  onSetLibraryFilter,
  onSetLibrarySort,
  onSetLibrarySearchTerm,
  onAddLibraryAsset,
  onRemoveLibraryAsset,
  onResetLibrary,
  filteredStreamEvents,
  streamFilter,
  streamSort,
  streamEventsCount,
  filteredStreamEventsCount,
  streamPhaseCounts,
  userCreatedEventCount,
  onSetStreamFilter,
  onSetStreamSort,
  onAddStreamEvent,
  onRemoveStreamEvent,
  onResetStream,
}: DashboardExtraContentProps) {
  const homeSignals = createHomeSignals({
    currentSection,
    filteredStreamEventsCount,
    streamFilter,
    streamSort,
    streamEventsCount,
    streamPhaseCounts,
    userCreatedEventCount,
    filteredLibraryAssetsCount,
    libraryFilter,
    librarySort,
    librarySearchTerm,
    libraryItemsCount,
    libraryStateCounts,
    userCreatedAssetCount,
    filteredSettingsCount,
    settingsFilter,
    showSettingsNotes,
    settingsItemsCount,
    settingsStateCounts,
  });

  const homeSectionSnapshots = createHomeSectionSnapshots();

  const dashboardExtraContentMap: Record<NavigationSection, ReactNode> = {
    ホーム: (
      <>
        <HomeOverviewPanel items={homeSignals} />
        <HomeSectionSnapshotList
          items={homeSectionSnapshots}
          onSelectSection={onSelectSection}
        />
      </>
    ),

    ストリーム: (
      <>
        <StreamControlPanel
          selectedFilter={streamFilter}
          onSelectFilter={onSetStreamFilter}
          selectedSort={streamSort}
          onSelectSort={onSetStreamSort}
          totalCount={streamEventsCount}
          filteredCount={filteredStreamEventsCount}
        />
        <StreamEventTimeline
          items={filteredStreamEvents}
          onAddEvent={onAddStreamEvent}
          onRemoveEvent={onRemoveStreamEvent}
          onResetEvents={onResetStream}
        />
      </>
    ),

    ライブラリ: (
      <>
        <LibraryControlPanel
          selectedFilter={libraryFilter}
          onSelectFilter={onSetLibraryFilter}
          selectedSort={librarySort}
          onSelectSort={onSetLibrarySort}
          searchTerm={librarySearchTerm}
          onSearchTermChange={onSetLibrarySearchTerm}
          totalCount={libraryItemsCount}
          filteredCount={filteredLibraryAssetsCount}
        />
        <LibraryAssetList
          items={filteredLibraryAssets}
          onAddAsset={onAddLibraryAsset}
          onRemoveAsset={onRemoveLibraryAsset}
          onResetAssets={onResetLibrary}
        />
      </>
    ),

    設定: (
      <>
        <SettingsControlPanel
          selectedFilter={settingsFilter}
          onSelectFilter={onSetSettingsFilter}
          showNotes={showSettingsNotes}
          onToggleNotes={onToggleSettingsNotes}
          totalCount={settingsItemsCount}
          filteredCount={filteredSettingsCount}
        />
        <SettingsStatusList
          items={filteredSettingsChecks}
          showNotes={showSettingsNotes}
          onCycleState={onCycleSettingState}
          onResetAll={onResetSettings}
        />
      </>
    ),
  };

  return <>{dashboardExtraContentMap[currentSection]}</>;
}

export default DashboardExtraContent;