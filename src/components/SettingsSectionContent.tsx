import SettingsStatusList from "./SettingsStatusList";
import SettingsControlPanel, {
  type SettingsFilter,
} from "./SettingsControlPanel";
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

  return (
    <DashboardSectionStack>
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