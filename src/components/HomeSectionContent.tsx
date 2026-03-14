import HomeMissionPanel from "./HomeMissionPanel";
import SystemSnapshotPanel from "./SystemSnapshotPanel";
import DashboardCardGrid from "./DashboardCardGrid";
import DashboardSectionStack from "./DashboardSectionStack";
import {
  dashboardSections,
  homeFocusItems,
  type DashboardSnapshotItem,
} from "../data/dashboard";

type HomeSectionContentProps = {
  snapshotItems: DashboardSnapshotItem[];
};

function HomeSectionContent({ snapshotItems }: HomeSectionContentProps) {
  const section = dashboardSections["ホーム"];

  return (
    <DashboardSectionStack>
      <HomeMissionPanel items={homeFocusItems} />
      <SystemSnapshotPanel items={snapshotItems} />
      <DashboardCardGrid cards={section.cards} />
    </DashboardSectionStack>
  );
}

export default HomeSectionContent;