import { useMemo, useState } from "react";
import StreamCard from "./StreamCard";
import StatusPill from "./StatusPill";
import SectionHeader from "./SectionHeader";
import DashboardSummary from "./DashboardSummary";
import DashboardDetailPanel from "./DashboardDetailPanel";
import SettingsStatusList from "./SettingsStatusList";
import SettingsControlPanel, {
  type SettingsFilter,
} from "./SettingsControlPanel";
import LibraryAssetList from "./LibraryAssetList";
import StreamEventTimeline from "./StreamEventTimeline";
import StreamControlPanel, {
  type StreamFilter,
  type StreamSort,
} from "./StreamControlPanel";
import HomeMissionPanel from "./HomeMissionPanel";
import SystemSnapshotPanel from "./SystemSnapshotPanel";
import {
  dashboardSections,
  settingsChecks,
  libraryAssets,
  streamEvents,
  homeFocusItems,
  homeSystemSnapshotItems,
} from "../dashboardCards";
import type { NavigationSection } from "../navigationItems";

type DashboardProps = {
  currentSection: NavigationSection;
};

function Dashboard({ currentSection }: DashboardProps) {
  const section = dashboardSections[currentSection];
  const [settingsFilter, setSettingsFilter] = useState<SettingsFilter>("all");
  const [showSettingsNotes, setShowSettingsNotes] = useState(true);
  const [streamFilter, setStreamFilter] = useState<StreamFilter>("all");
  const [streamSort, setStreamSort] = useState<StreamSort>("timeline");

  const filteredSettingsChecks = useMemo(() => {
    if (settingsFilter === "all") {
      return settingsChecks;
    }

    return settingsChecks.filter((item) => item.state === settingsFilter);
  }, [settingsFilter]);

  const filteredStreamEvents = useMemo(() => {
    const baseEvents =
      streamFilter === "all"
        ? streamEvents
        : streamEvents.filter((item) => item.phase === streamFilter);

    if (streamSort === "timeline") {
      return baseEvents;
    }

    if (streamSort === "newest") {
      return [...baseEvents].reverse();
    }

    const phaseOrder = {
      next: 0,
      current: 1,
      done: 2,
    } as const;

    return [...baseEvents].sort(
      (a, b) => phaseOrder[a.phase] - phaseOrder[b.phase]
    );
  }, [streamFilter, streamSort]);

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

      {currentSection === "ホーム" && (
        <>
          <HomeMissionPanel items={homeFocusItems} />
          <SystemSnapshotPanel items={homeSystemSnapshotItems} />
        </>
      )}

      {currentSection === "ストリーム" && (
        <>
          <StreamControlPanel
            selectedFilter={streamFilter}
            onSelectFilter={setStreamFilter}
            selectedSort={streamSort}
            onSelectSort={setStreamSort}
            totalCount={streamEvents.length}
            filteredCount={filteredStreamEvents.length}
          />

          <StreamEventTimeline items={filteredStreamEvents} />
        </>
      )}

      {currentSection === "ライブラリ" && (
        <LibraryAssetList items={libraryAssets} />
      )}

      {currentSection === "設定" && (
        <>
          <SettingsControlPanel
            selectedFilter={settingsFilter}
            onSelectFilter={setSettingsFilter}
            showNotes={showSettingsNotes}
            onToggleNotes={() => setShowSettingsNotes((current) => !current)}
            totalCount={settingsChecks.length}
            filteredCount={filteredSettingsChecks.length}
          />

          <SettingsStatusList
            items={filteredSettingsChecks}
            showNotes={showSettingsNotes}
          />
        </>
      )}

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