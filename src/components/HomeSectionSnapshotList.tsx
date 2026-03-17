import type { HomeSectionSnapshot } from "../dashboardData/types";
import DashboardPanel from "./DashboardPanel";
import DashboardTile from "./DashboardTile";
import DashboardBadge from "./DashboardBadge";

type HomeSectionSnapshotListProps = {
  items: HomeSectionSnapshot[];
};

function HomeSectionSnapshotList({ items }: HomeSectionSnapshotListProps) {
  return (
    <DashboardPanel title="Section Map">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "12px",
        }}
      >
        {items.map((item) => (
          <DashboardTile
            key={item.section}
            title={item.section}
            right={
              <DashboardBadge
                label={`cards ${item.cardCount}`}
                color="#1d4ed8"
                background="#dbeafe"
              />
            }
          >
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                fontWeight: 600,
                color: "#111827",
              }}
            >
              {item.status}
            </p>

            <p
              style={{
                margin: "8px 0 0 0",
                fontSize: "14px",
                color: "#4b5563",
                lineHeight: 1.6,
              }}
            >
              Focus: {item.focus}
            </p>

            <p
              style={{
                margin: "8px 0 0 0",
                fontSize: "14px",
                color: "#374151",
                lineHeight: 1.6,
              }}
            >
              {item.note}
            </p>
          </DashboardTile>
        ))}
      </div>
    </DashboardPanel>
  );
}

export default HomeSectionSnapshotList;