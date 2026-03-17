import StreamCard from "./StreamCard";
import StatusPill from "./StatusPill";
import SectionHeader from "./SectionHeader";
import DashboardSummary from "./DashboardSummary";
import DashboardDetailPanel from "./DashboardDetailPanel";
import SettingsStatusList from "./SettingsStatusList";
import LibraryAssetList from "./LibraryAssetList";
import StreamEventTimeline from "./StreamEventTimeline";
import HomeOverviewPanel from "./HomeOverviewPanel";
import HomeSectionSnapshotList from "./HomeSectionSnapshotList";
import {
  dashboardSections,
  settingsChecks,
  libraryAssets,
  streamEvents,
  homeSignals,
  homeSectionSnapshots,
} from "../dashboardCards";
import type { NavigationSection } from "../navigationItems";

type DashboardProps = {
  currentSection: NavigationSection;
};

function Dashboard({ currentSection }: DashboardProps) {
  const section = dashboardSections[currentSection];

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
          <HomeOverviewPanel items={homeSignals} />
          <HomeSectionSnapshotList items={homeSectionSnapshots} />
        </>
      )}

      {currentSection === "ストリーム" && (
        <StreamEventTimeline items={streamEvents} />
      )}

      {currentSection === "ライブラリ" && (
        <LibraryAssetList items={libraryAssets} />
      )}

      {currentSection === "設定" && (
        <SettingsStatusList items={settingsChecks} />
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