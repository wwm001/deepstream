import { useMemo, useState } from "react";
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
  libraryAssets,
  settingsChecks,
  totalDashboardCards,
  totalSections,
  type DashboardSnapshotItem,
} from "../data/dashboard";
import type { NavigationSection } from "../navigationItems";
import type { LibraryFilter, LibrarySort } from "./LibraryControlPanel";
import type { SettingsFilter } from "./SettingsControlPanel";
import { useStreamState } from "../hooks/useStreamState";

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
    addStreamEvent,
    removeStreamEvent,
  } = useStreamState();

  const [libraryFilter, setLibraryFilter] = useState<LibraryFilter>("all");
  const [librarySort, setLibrarySort] = useState<LibrarySort>("name");
  const [librarySearchTerm, setLibrarySearchTerm] = useState("");

  const [settingsFilter, setSettingsFilter] = useState<SettingsFilter>("all");
  const [showSettingsNotes, setShowSettingsNotes] = useState(true);

  const filteredLibraryAssets = useMemo(() => {
    const normalizedSearchTerm = librarySearchTerm.trim().toLowerCase();

    const baseAssets = libraryAssets.filter((item) => {
      const matchesFilter =
        libraryFilter === "all" ? true : item.state === libraryFilter;

      const matchesSearch =
        normalizedSearchTerm.length === 0
          ? true
          : `${item.name} ${item.role} ${item.note}`
              .toLowerCase()
              .includes(normalizedSearchTerm);

      return matchesFilter && matchesSearch;
    });

    if (librarySort === "name") {
      return [...baseAssets].sort((a, b) => a.name.localeCompare(b.name));
    }

    const stateOrder = {
      stable: 0,
      active: 1,
      next: 2,
    } as const;

    return [...baseAssets].sort((a, b) => {
      const stateDiff = stateOrder[a.state] - stateOrder[b.state];

      if (stateDiff !== 0) {
        return stateDiff;
      }

      return a.name.localeCompare(b.name);
    });
  }, [libraryFilter, librarySearchTerm, librarySort]);

  const filteredSettingsChecks = useMemo(() => {
    if (settingsFilter === "all") {
      return settingsChecks;
    }

    return settingsChecks.filter((item) => item.state === settingsFilter);
  }, [settingsFilter]);

  const settingsStateCounts = useMemo(
    () => ({
      ok: settingsChecks.filter((item) => item.state === "ok").length,
      watch: settingsChecks.filter((item) => item.state === "watch").length,
      next: settingsChecks.filter((item) => item.state === "next").length,
    }),
    []
  );

  const libraryStateCounts = useMemo(
    () => ({
      stable: libraryAssets.filter((item) => item.state === "stable").length,
      active: libraryAssets.filter((item) => item.state === "active").length,
      next: libraryAssets.filter((item) => item.state === "next").length,
    }),
    []
  );

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
        label: "Library View",
        value: String(filteredLibraryAssets.length),
        note:
          librarySearchTerm.trim().length > 0
            ? `検索語「${librarySearchTerm}」・フィルター ${libraryFilter}・並び順 ${librarySort} の結果件数です。全体は stable ${libraryStateCounts.stable} / active ${libraryStateCounts.active} / next ${libraryStateCounts.next}。`
            : `ライブラリの現在フィルター ${libraryFilter}、並び順 ${librarySort} による表示件数です。全体は stable ${libraryStateCounts.stable} / active ${libraryStateCounts.active} / next ${libraryStateCounts.next}。`,
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
        note: `設定の現在フィルター ${settingsFilter}、ノート表示 ${showSettingsNotes ? "on" : "off"} の結果件数です。全体は ok ${settingsStateCounts.ok} / watch ${settingsStateCounts.watch} / next ${settingsStateCounts.next}。`,
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
      librarySearchTerm,
      librarySort,
      showSettingsNotes,
      settingsFilter,
      streamFilter,
      streamSort,
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
          />
        );
      case "設定":
        return (
          <SettingsSectionContent
            settingsFilter={settingsFilter}
            onSettingsFilterChange={setSettingsFilter}
            showSettingsNotes={showSettingsNotes}
            onToggleSettingsNotes={() =>
              setShowSettingsNotes((current) => !current)
            }
            filteredSettingsChecks={filteredSettingsChecks}
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