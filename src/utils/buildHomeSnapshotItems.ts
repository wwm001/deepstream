import type { DashboardSnapshotItem } from "../data/dashboard";
import type { NavigationSection } from "../navigationItems";
import type { LibraryFilter, LibrarySort } from "../components/LibraryControlPanel";
import type { SettingsFilter } from "../components/SettingsControlPanel";
import type { StreamFilter, StreamSort } from "../components/StreamControlPanel";

type BuildHomeSnapshotItemsParams = {
  currentSection: NavigationSection;
  totalSections: number;
  totalDashboardCards: number;
  filteredLibraryAssetsCount: number;
  filteredStreamEventsCount: number;
  filteredSettingsChecksCount: number;
  libraryFilter: LibraryFilter;
  librarySort: LibrarySort;
  librarySearchTerm: string;
  libraryItemsCount: number;
  libraryStateCounts: {
    stableCount: number;
    activeCount: number;
    nextCount: number;
  };
  streamFilter: StreamFilter;
  streamSort: StreamSort;
  streamEventsCount: number;
  streamPhaseCounts: {
    doneCount: number;
    currentCount: number;
    nextCount: number;
  };
  settingsFilter: SettingsFilter;
  showSettingsNotes: boolean;
  settingsItemsCount: number;
  settingsStateCounts: {
    okCount: number;
    watchCount: number;
    nextCount: number;
  };
  userCreatedEventCount: number;
  userCreatedAssetCount: number;
};

export function buildHomeSnapshotItems({
  currentSection,
  totalSections,
  totalDashboardCards,
  filteredLibraryAssetsCount,
  filteredStreamEventsCount,
  filteredSettingsChecksCount,
  libraryFilter,
  librarySort,
  librarySearchTerm,
  libraryItemsCount,
  libraryStateCounts,
  streamFilter,
  streamSort,
  streamEventsCount,
  streamPhaseCounts,
  settingsFilter,
  showSettingsNotes,
  settingsItemsCount,
  settingsStateCounts,
  userCreatedEventCount,
  userCreatedAssetCount,
}: BuildHomeSnapshotItemsParams): DashboardSnapshotItem[] {
  return [
    {
      label: "Active Section",
      value: currentSection,
      note: `現在表示中のセクションは「${currentSection}」です。ホームは司令室、他3画面は操作盤として機能します。`,
      tone: "indigo",
    },
    {
      label: "Sections",
      value: String(totalSections),
      note: "ホーム / ストリーム / ライブラリ / 設定 の4画面を搭載しています。",
      tone: "indigo",
    },
    {
      label: "Cards",
      value: String(totalDashboardCards),
      note: "全セクションを合計した表示カード数です。",
      tone: "green",
    },
    {
      label: "User Events",
      value: String(userCreatedEventCount),
      note: `ユーザーが追加したストリームイベント数です。全イベント総数は ${streamEventsCount} 件です。`,
      tone: "amber",
    },
    {
      label: "User Assets",
      value: String(userCreatedAssetCount),
      note: `ユーザーが追加したライブラリアセット数です。全アセット総数は ${libraryItemsCount} 件です。`,
      tone: "gray",
    },
    {
      label: "Library View",
      value: String(filteredLibraryAssetsCount),
      note:
        librarySearchTerm.trim().length > 0
          ? `検索語「${librarySearchTerm}」・フィルター ${libraryFilter}・並び順 ${librarySort} の結果件数です。全体は stable ${libraryStateCounts.stableCount} / active ${libraryStateCounts.activeCount} / next ${libraryStateCounts.nextCount} / total ${libraryItemsCount}。`
          : `ライブラリの現在フィルター ${libraryFilter}、並び順 ${librarySort} による表示件数です。全体は stable ${libraryStateCounts.stableCount} / active ${libraryStateCounts.activeCount} / next ${libraryStateCounts.nextCount} / total ${libraryItemsCount}。`,
      tone: "gray",
    },
    {
      label: "Stream View",
      value: String(filteredStreamEventsCount),
      note: `ストリームの現在フィルター ${streamFilter} / 並び順 ${streamSort} の結果件数です。全体は done ${streamPhaseCounts.doneCount} / current ${streamPhaseCounts.currentCount} / next ${streamPhaseCounts.nextCount} / total ${streamEventsCount}。`,
      tone: "amber",
    },
    {
      label: "Settings View",
      value: String(filteredSettingsChecksCount),
      note: `設定の現在フィルター ${settingsFilter}、ノート表示 ${showSettingsNotes ? "on" : "off"} の結果件数です。全体は ok ${settingsStateCounts.okCount} / watch ${settingsStateCounts.watchCount} / next ${settingsStateCounts.nextCount} / total ${settingsItemsCount}。`,
      tone: "gray",
    },
  ];
}