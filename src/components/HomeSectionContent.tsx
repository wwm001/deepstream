import HomeMissionPanel from "./HomeMissionPanel";
import SystemSnapshotPanel from "./SystemSnapshotPanel";
import DashboardCardGrid from "./DashboardCardGrid";
import DashboardSectionStack from "./DashboardSectionStack";
import {
  dashboardSections,
  homeFocusItems,
  homeSystemSnapshotItems,
} from "../dashboardCards";

function HomeSectionContent() {
  const section = dashboardSections["ホーム"];

  return (
    <DashboardSectionStack>
      <HomeMissionPanel items={homeFocusItems} />
      <SystemSnapshotPanel items={homeSystemSnapshotItems} />
      <DashboardCardGrid cards={section.cards} />
    </DashboardSectionStack>
  );
}

export default HomeSectionContent;