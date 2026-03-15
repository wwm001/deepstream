import { useMemo } from "react";
import SettingsStatusList from "./SettingsStatusList";
import SettingsControlPanel, {
  type SettingsFilter,
} from "./SettingsControlPanel";
import SettingsStateSummary from "./SettingsStateSummary";
import DashboardCardGrid from "./DashboardCardGrid";
import DashboardSectionStack from "./DashboardSectionStack";
import {
  dashboardSections,
  settingsChecks,
  type SettingCheck,
} from "../data/dashboard";

type SettingsSectionContentProps = {
  settingsFilter: SettingsFilter;
  onSettingsFilterChange: (filter: SettingsFilter) => void;
  showSettingsNotes: boolean;
  onToggleSettingsNotes: () => void;
  filteredSettingsChecks: SettingCheck[];
};

function SettingsSectionContent({
  settingsFilter,
  onSettingsFilterChange,
  showSettingsNotes,
  onToggleSettingsNotes,
  filteredSettingsChecks,
}: SettingsSectionContentProps) {
  const section = dashboardSections["設定"];

  const summaryCounts = useMemo(
    () => ({
      okCount: settingsChecks.filter((item) => item.state === "ok").length,
      watchCount: settingsChecks.filter((item) => item.state === "watch").length,
      nextCount: settingsChecks.filter((item) => item.state === "next").length,
    }),
    []
  );

  return (
    <DashboardSectionStack>
      <SettingsStateSummary
        okCount={summaryCounts.okCount}
        watchCount={summaryCounts.watchCount}
        nextCount={summaryCounts.nextCount}
      />

      <SettingsControlPanel
        selectedFilter={settingsFilter}
        onSelectFilter={onSettingsFilterChange}
        showNotes={showSettingsNotes}
        onToggleNotes={onToggleSettingsNotes}
        totalCount={settingsChecks.length}
        filteredCount={filteredSettingsChecks.length}
      />

      <SettingsStatusList
        items={filteredSettingsChecks}
        showNotes={showSettingsNotes}
      />

      <DashboardCardGrid cards={section.cards} />
    </DashboardSectionStack>
  );
}

export default SettingsSectionContent;