import { useMemo, useState } from "react";
import StreamCard from "./StreamCard";
import SettingsStatusList from "./SettingsStatusList";
import SettingsControlPanel, {
  type SettingsFilter,
} from "./SettingsControlPanel";
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
    <>
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
    </>
  );
}

export default SettingsSectionContent;