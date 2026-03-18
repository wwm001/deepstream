import type { ReactNode } from "react";
import type { NavigationSection } from "../navigationItems";
import type {
  SettingCheck,
  LibraryAsset,
  StreamEvent,
} from "../dashboardData/types";
import {
  createHomeSignals,
  createHomeSectionSnapshots,
} from "../dashboardData/homeData";
import SettingsStatusList from "./SettingsStatusList";
import LibraryAssetList from "./LibraryAssetList";
import StreamEventTimeline from "./StreamEventTimeline";
import HomeOverviewPanel from "./HomeOverviewPanel";
import HomeSectionSnapshotList from "./HomeSectionSnapshotList";

type DashboardExtraContentProps = {
  currentSection: NavigationSection;
  onSelectSection: (section: NavigationSection) => void;
  settingsItems: SettingCheck[];
  libraryItems: LibraryAsset[];
  streamItems: StreamEvent[];
  onCycleSettingState: (label: string) => void;
  onRemoveLibraryAsset: (assetId: string) => void;
  onRemoveStreamEvent: (eventId: string) => void;
};

function DashboardExtraContent({
  currentSection,
  onSelectSection,
  settingsItems,
  libraryItems,
  streamItems,
  onCycleSettingState,
  onRemoveLibraryAsset,
  onRemoveStreamEvent,
}: DashboardExtraContentProps) {
  const watchSettingCount = settingsItems.filter(
    (item) => item.state === "watch"
  ).length;

  const homeSignals = createHomeSignals({
    streamEventCount: streamItems.length,
    libraryAssetCount: libraryItems.length,
    watchSettingCount,
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
      <StreamEventTimeline
        items={streamItems}
        onRemoveEvent={onRemoveStreamEvent}
      />
    ),
    ライブラリ: (
      <LibraryAssetList
        items={libraryItems}
        onRemoveAsset={onRemoveLibraryAsset}
      />
    ),
    設定: (
      <SettingsStatusList
        items={settingsItems}
        onCycleState={onCycleSettingState}
      />
    ),
  };

  return <>{dashboardExtraContentMap[currentSection]}</>;
}

export default DashboardExtraContent;