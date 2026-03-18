import { useState } from "react";
import StreamCard from "./StreamCard";
import StatusPill from "./StatusPill";
import SectionHeader from "./SectionHeader";
import DashboardSummary from "./DashboardSummary";
import DashboardDetailPanel from "./DashboardDetailPanel";
import DashboardExtraContent from "./DashboardExtraContent";
import { dashboardSections } from "../dashboardData/sections";
import { settingsChecks as initialSettingsChecks } from "../dashboardData/settingsData";
import { libraryAssets as initialLibraryAssets } from "../dashboardData/libraryData";
import { streamEvents as initialStreamEvents } from "../dashboardData/streamData";
import type {
  SettingCheck,
  LibraryAsset,
  StreamEvent,
} from "../dashboardData/types";
import type { NavigationSection } from "../navigationItems";

type DashboardProps = {
  currentSection: NavigationSection;
  onSelectSection: (section: NavigationSection) => void;
};

type NewLibraryAssetInput = Omit<LibraryAsset, "id">;
type NewStreamEventInput = Omit<StreamEvent, "id">;

const nextSettingStateMap: Record<
  SettingCheck["state"],
  SettingCheck["state"]
> = {
  ok: "watch",
  watch: "next",
  next: "ok",
};

function createItemId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function Dashboard({
  currentSection,
  onSelectSection,
}: DashboardProps) {
  const [settingsItems, setSettingsItems] =
    useState<SettingCheck[]>(initialSettingsChecks);
  const [libraryItems, setLibraryItems] =
    useState<LibraryAsset[]>(initialLibraryAssets);
  const [streamItems, setStreamItems] =
    useState<StreamEvent[]>(initialStreamEvents);

  const section = dashboardSections[currentSection];

  const handleCycleSettingState = (label: string) => {
    setSettingsItems((currentItems) =>
      currentItems.map((item) =>
        item.label === label
          ? {
              ...item,
              state: nextSettingStateMap[item.state],
            }
          : item
      )
    );
  };

  const handleRemoveLibraryAsset = (assetId: string) => {
    setLibraryItems((currentItems) =>
      currentItems.filter((item) => item.id !== assetId)
    );
  };

  const handleRemoveStreamEvent = (eventId: string) => {
    setStreamItems((currentItems) =>
      currentItems.filter((item) => item.id !== eventId)
    );
  };

  const handleAddLibraryAsset = (asset: NewLibraryAssetInput) => {
    setLibraryItems((currentItems) => [
      {
        id: createItemId("library"),
        ...asset,
      },
      ...currentItems,
    ]);
  };

  const handleAddStreamEvent = (event: NewStreamEventInput) => {
    setStreamItems((currentItems) => [
      {
        id: createItemId("stream"),
        ...event,
      },
      ...currentItems,
    ]);
  };

  const handleResetSettings = () => {
    setSettingsItems(initialSettingsChecks);
  };

  const handleResetLibrary = () => {
    setLibraryItems(initialLibraryAssets);
  };

  const handleResetStream = () => {
    setStreamItems(initialStreamEvents);
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

      <DashboardExtraContent
        currentSection={currentSection}
        onSelectSection={onSelectSection}
        settingsItems={settingsItems}
        libraryItems={libraryItems}
        streamItems={streamItems}
        onCycleSettingState={handleCycleSettingState}
        onRemoveLibraryAsset={handleRemoveLibraryAsset}
        onRemoveStreamEvent={handleRemoveStreamEvent}
        onAddLibraryAsset={handleAddLibraryAsset}
        onAddStreamEvent={handleAddStreamEvent}
        onResetSettings={handleResetSettings}
        onResetLibrary={handleResetLibrary}
        onResetStream={handleResetStream}
      />

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