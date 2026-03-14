import { useMemo, useState } from "react";
import SettingsStatusList from "./SettingsStatusList";
import SettingsControlPanel, {
  type SettingsFilter,
} from "./SettingsControlPanel";
import DashboardCardGrid from "./DashboardCardGrid";
import DashboardSectionStack from "./DashboardSectionStack";
import { dashboardSections, settingsChecks } from "../dashboardCards";

function SettingsSectionContent() {
  const section = dashboardSections["設定"];
  const [settingsFilter, setSettingsFilter] = useState<SettingsFilter>("all");
  const [showSettingsNotes, setShowSettingsNotes] = useState(true);

  const filteredSettingsChecks = useMemo(() => {
    if (settingsFilter === "all") {
      return settingsChecks;
    }

    return settingsChecks.filter((item) => item.state === settingsFilter);
  }, [settingsFilter]);

  return (
    <DashboardSectionStack>
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

      <DashboardCardGrid cards={section.cards} />
    </DashboardSectionStack>
  );
}

export default SettingsSectionContent;