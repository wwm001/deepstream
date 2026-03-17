import type { NavigationSection } from "../navigationItems";
import {
  settingsChecks,
  libraryAssets,
  streamEvents,
  homeSignals,
  homeSectionSnapshots,
} from "../dashboardCards";
import SettingsStatusList from "./SettingsStatusList";
import LibraryAssetList from "./LibraryAssetList";
import StreamEventTimeline from "./StreamEventTimeline";
import HomeOverviewPanel from "./HomeOverviewPanel";
import HomeSectionSnapshotList from "./HomeSectionSnapshotList";

type DashboardExtraContentProps = {
  currentSection: NavigationSection;
};

const dashboardExtraContentMap: Record<NavigationSection, JSX.Element> = {
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
  return dashboardExtraContentMap[currentSection];
}

export default DashboardExtraContent;