import { useMemo } from "react";
import SectionHeader from "./SectionHeader";
import StatusPill from "./StatusPill";
import DashboardSummary from "./DashboardSummary";
import DashboardDetailPanel from "./DashboardDetailPanel";
import HomeSectionContent from "./HomeSectionContent";
import StreamSectionContent from "./StreamSectionContent";
import LibrarySectionContent from "./LibrarySectionContent";
import SettingsSectionContent from "./SettingsSectionContent";
import {
  dashboardSections,
  totalDashboardCards,
  totalSections,
  type DashboardSnapshotItem,
} from "../data/dashboard";
import type { NavigationSection } from "../navigationItems";
import { useStreamState } from "../hooks/useStreamState";
import { useSettingsState } from "../hooks/useSettingsState";
import { useLibraryState } from "../hooks/useLibraryState";

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

  const homeSystemSnapshotItems = useMemo<DashboardSnapshotItem[]>(
    () => [
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
        note: `ユーザーが追加したストリームイベント数です。全イベント総数は ${events.length} 件です。`,
        tone: "amber",
      },
      {
        label: "User Assets",
        value: String(userCreatedAssetCount),
        note: `ユーザーが追加したライブラリアセット数です。全アセット総数は ${libraryItems.length} 件です。`,
        tone: "gray",
      },
      {
        label: "Library View",
        value: String(filteredLibraryAssets.length),
        note:
          librarySearchTerm.trim().length > 0
            ? `検索語「${librarySearchTerm}」・フィルター ${libraryFilter}・並び順 ${librarySort} の結果件数です。全体は stable ${libraryStateCounts.stableCount} / active ${libraryStateCounts.activeCount} / next ${libraryStateCounts.nextCount} / total ${libraryItems.length}。`
            : `ライブラリの現在フィルター ${libraryFilter}、並び順 ${librarySort} による表示件数です。全体は stable ${libraryStateCounts.stableCount} / active ${libraryStateCounts.activeCount} / next ${libraryStateCounts.nextCount} / total ${libraryItems.length}。`,
        tone: "gray",
      },
      {
        label: "Stream View",
        value: String(filteredStreamEvents.length),
        note: `ストリームの現在フィルター ${streamFilter} / 並び順 ${streamSort} の結果件数です。全体は done ${phaseCounts.doneCount} / current ${phaseCounts.currentCount} / next ${phaseCounts.nextCount} / total ${events.length}。`,
        tone: "amber",
      },
      {
        label: "Settings View",
        value: String(filteredSettingsChecks.length),
        note: `設定の現在フィルター ${settingsFilter}、ノート表示 ${showSettingsNotes ? "on" : "off"} の結果件数です。全体は ok ${settingsStateCounts.okCount} / watch ${settingsStateCounts.watchCount} / next ${settingsStateCounts.nextCount} / total ${settingsItems.length}。`,
        tone: "gray",
      },
    ],
    [
      currentSection,
      events.length,
      filteredLibraryAssets.length,
      filteredStreamEvents.length,
      filteredSettingsChecks.length,
      libraryFilter,
      libraryItems.length,
      librarySearchTerm,
      librarySort,
      showSettingsNotes,
      settingsFilter,
      settingsItems.length,
      streamFilter,
      streamSort,
      userCreatedAssetCount,
      userCreatedEventCount,
      libraryStateCounts,
      phaseCounts,
      settingsStateCounts,
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