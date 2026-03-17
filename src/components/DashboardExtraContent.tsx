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
};

const dashboardExtraContentMap: Record<NavigationSection, ReactNode> = {
  ホーム: (
    <>
      <HomeOverviewPanel items={homeSignals} />
      <HomeSectionSnapshotList items={homeSectionSnapshots} />
    </>
  ),
  ストリーム: <StreamEventTimeline items={streamEvents} />,
  ライブラリ: <LibraryAssetList items={libraryAssets} />,
  設定: <SettingsStatusList items={settingsChecks} />,
};

function DashboardExtraContent({
  currentSection,
}: DashboardExtraContentProps) {
  return <>{dashboardExtraContentMap[currentSection]}</>;
}

export default DashboardExtraContent;