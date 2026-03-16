import SettingsStatusList from "./SettingsStatusList";
import SettingsControlPanel, {
  type SettingsFilter,
} from "./SettingsControlPanel";
import SettingsStateSummary from "./SettingsStateSummary";
import DashboardCardGrid from "./DashboardCardGrid";
import DashboardSectionStack from "./DashboardSectionStack";
import { dashboardSections, type SettingCheck } from "../data/dashboard";

type SettingsSectionContentProps = {
  settingsFilter: SettingsFilter;
  onSettingsFilterChange: (filter: SettingsFilter) => void;
  showSettingsNotes: boolean;
  onToggleSettingsNotes: () => void;
  filteredSettingsChecks: SettingCheck[];
  totalSettingsChecks: number;
  summaryCounts: {
    okCount: number;
    watchCount: number;
    nextCount: number;
  };
  onCycleSettingState: (label: string) => void;
};

function SettingsSectionContent({
  settingsFilter,
  onSettingsFilterChange,
  showSettingsNotes,
  onToggleSettingsNotes,
  filteredSettingsChecks,
  totalSettingsChecks,
  summaryCounts,
  onCycleSettingState,
}: SettingsSectionContentProps) {
  const section = dashboardSections["設定"];

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
        totalCount={totalSettingsChecks}
        filteredCount={filteredSettingsChecks.length}
      />

      <SettingsStatusList
        items={filteredSettingsChecks}
        showNotes={showSettingsNotes}
        onCycleState={onCycleSettingState}
      />

      <DashboardCardGrid cards={section.cards} />
    </DashboardSectionStack>
  );
}

export default SettingsSectionContent;