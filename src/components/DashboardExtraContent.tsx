import type { ReactNode } from "react";
import type {
  HomeSectionSnapshot,
  HomeSignal,
  LibraryAsset,
  SettingCheck,
  StreamEvent,
} from "../dashboardData/types";
import { dashboardSections } from "../dashboardData/sections";
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

  settingsItems: SettingCheck[];
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

  libraryItems: LibraryAsset[];
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

  streamItems: StreamEvent[];
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

const sectionOrder: NavigationSection[] = [
  "ホーム",
  "ストリーム",
  "ライブラリ",
  "設定",
];

function DashboardExtraContent({
  currentSection,
  onSelectSection,
  settingsItems,
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
  libraryItems,
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
  streamItems,
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
  const homeSignals: HomeSignal[] = [
    {
      label: "Active Section",
      value: currentSection,
      note: `現在表示中のセクションは「${currentSection}」です。リロード後もここへ戻ります。`,
      tone: "primary",
    },
    {
      label: "Stream View",
      value: String(filteredStreamEventsCount),
      note: `filter ${streamFilter} / sort ${streamSort}。全体は done ${streamPhaseCounts.doneCount} / current ${streamPhaseCounts.currentCount} / next ${streamPhaseCounts.nextCount} / total ${streamEventsCount}。`,
      tone: "success",
    },
    {
      label: "Library View",
      value: String(filteredLibraryAssetsCount),
      note:
        librarySearchTerm.trim().length > 0
          ? `検索語「${librarySearchTerm}」・filter ${libraryFilter}・sort ${librarySort} の結果件数です。全体は stable ${libraryStateCounts.stableCount} / active ${libraryStateCounts.activeCount} / next ${libraryStateCounts.nextCount} / total ${libraryItemsCount}。`
          : `filter ${libraryFilter} / sort ${librarySort} の表示件数です。全体は stable ${libraryStateCounts.stableCount} / active ${libraryStateCounts.activeCount} / next ${libraryStateCounts.nextCount} / total ${libraryItemsCount}。`,
      tone: "warning",
    },
    {
      label: "Settings View",
      value: String(filteredSettingsCount),
      note: `filter ${settingsFilter} / notes ${showSettingsNotes ? "on" : "off"}。全体は ok ${settingsStateCounts.okCount} / watch ${settingsStateCounts.watchCount} / next ${settingsStateCounts.nextCount} / total ${settingsItemsCount}。`,
      tone: "neutral",
    },
    {
      label: "User Events",
      value: String(userCreatedEventCount),
      note: `追加済みのユーザーイベント数です。全イベント総数は ${streamItems.length} 件です。`,
      tone: "success",
    },
    {
      label: "User Assets",
      value: String(userCreatedAssetCount),
      note: `追加済みのユーザーアセット数です。全アセット総数は ${libraryItems.length} 件です。`,
      tone: "warning",
    },
  ];

  const homeSectionSnapshots: HomeSectionSnapshot[] = sectionOrder.map(
    (sectionName) => {
      const section = dashboardSections[sectionName];

      return {
        section: sectionName,
        status: section.statusLabel,
        focus: section.focusLabel,
        cardCount: section.cards.length,
        note:
          sectionName === "ホーム"
            ? "全体俯瞰と主要信号の司令室です。"
            : sectionName === "ストリーム"
            ? "進行イベントの流れと追加操作を扱う時系列画面です。"
            : sectionName === "ライブラリ"
            ? "再利用資産の検索・整理・追加を行う棚卸し画面です。"
            : "環境状態の監視と状態切替を扱う監視画面です。",
      };
    }
  );

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