import type { ReactNode } from "react";
import type { NavigationSection } from "../navigationItems";
import { settingsChecks } from "../dashboardData/settingsData";
import { libraryAssets } from "../dashboardData/libraryData";
import { streamEvents } from "../dashboardData/streamData";
import {
  homeSignals,
  homeSectionSnapshots,
} from "../dashboardData/homeData";
import SettingsStatusList from "./SettingsStatusList";
import LibraryAssetList from "./LibraryAssetList";
import StreamEventTimeline from "./StreamEventTimeline";
import HomeOverviewPanel from "./HomeOverviewPanel";
import HomeSectionSnapshotList from "./HomeSectionSnapshotList";

type DashboardExtraContentProps = {
  currentSection: NavigationSection;
  onSelectSection: (section: NavigationSection) => void;
};

function DashboardExtraContent({
  currentSection,
  onSelectSection,
}: DashboardExtraContentProps) {
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
    ストリーム: <StreamEventTimeline items={streamEvents} />,
    ライブラリ: <LibraryAssetList items={libraryAssets} />,
    設定: <SettingsStatusList items={settingsChecks} />,
  };

  return <>{dashboardExtraContentMap[currentSection]}</>;
}

export default DashboardExtraContent;