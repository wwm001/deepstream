import SectionHeader from "./SectionHeader";
import StatusPill from "./StatusPill";
import DashboardSummary from "./DashboardSummary";
import DashboardDetailPanel from "./DashboardDetailPanel";
import HomeSectionContent from "./HomeSectionContent";
import StreamSectionContent from "./StreamSectionContent";
import LibrarySectionContent from "./LibrarySectionContent";
import SettingsSectionContent from "./SettingsSectionContent";
import { dashboardSections } from "../dashboardCards";
import type { NavigationSection } from "../navigationItems";

type DashboardProps = {
  currentSection: NavigationSection;
};

function Dashboard({ currentSection }: DashboardProps) {
  const section = dashboardSections[currentSection];

  const renderSectionContent = () => {
    switch (currentSection) {
      case "ホーム":
        return <HomeSectionContent />;
      case "ストリーム":
        return <StreamSectionContent />;
      case "ライブラリ":
        return <LibrarySectionContent />;
      case "設定":
        return <SettingsSectionContent />;
      default:
        return null;
    }
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

      {renderSectionContent()}
    </section>
  );
}

export default Dashboard;