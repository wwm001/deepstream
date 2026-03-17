import type { HomeSignal } from "../dashboardData/types";
import DashboardPanel from "./DashboardPanel";
import DashboardTile from "./DashboardTile";

type HomeOverviewPanelProps = {
  items: HomeSignal[];
};

const toneStyles: Record<
  HomeSignal["tone"],
  { color: string; background: string; border: string }
> = {
  primary: {
    color: "#1d4ed8",
    background: "#eff6ff",
    border: "#bfdbfe",
  },
  success: {
    color: "#047857",
    background: "#ecfdf5",
    border: "#a7f3d0",
  },
  warning: {
    color: "#b45309",
    background: "#fffbeb",
    border: "#fde68a",
  },
  neutral: {
    color: "#4b5563",
    background: "#f9fafb",
    border: "#e5e7eb",
  },
};

function HomeOverviewPanel({ items }: HomeOverviewPanelProps) {
  return (
    <DashboardPanel title="Home Signals">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "12px",
        }}
      >
        {items.map((item) => {
          const toneStyle = toneStyles[item.tone];

          return (
            <DashboardTile
              key={item.label}
              title={item.label}
              background={toneStyle.background}
              borderColor={toneStyle.border}
              titleColor={toneStyle.color}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#111827",
                }}
              >
                {item.value}
              </p>

              <p
                style={{
                  margin: "10px 0 0 0",
                  color: "#374151",
                  lineHeight: 1.6,
                  fontSize: "14px",
                }}
              >
                {item.note}
              </p>
            </DashboardTile>
          );
        })}
      </div>
    </DashboardPanel>
  );
}

export default HomeOverviewPanel;