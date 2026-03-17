import DashboardPanel from "./DashboardPanel";
import DashboardTile from "./DashboardTile";

type DashboardDetailItem = {
  label: string;
  value: string;
};

type DashboardDetailPanelProps = {
  title: string;
  items: DashboardDetailItem[];
};

function DashboardDetailPanel({
  title,
  items,
}: DashboardDetailPanelProps) {
  return (
    <DashboardPanel title={title}>
      <div
        style={{
          display: "grid",
          gap: "12px",
        }}
      >
        {items.map((item) => (
          <DashboardTile key={item.label} title={item.label}>
            <p
              style={{
                margin: 0,
                fontSize: "15px",
                lineHeight: 1.6,
                color: "#111827",
                fontWeight: 600,
              }}
            >
              {item.value}
            </p>
          </DashboardTile>
        ))}
      </div>
    </DashboardPanel>
  );
}

export default DashboardDetailPanel;