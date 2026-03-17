import type { SettingCheck } from "../dashboardData/types";
import DashboardPanel from "./DashboardPanel";
import DashboardTile from "./DashboardTile";
import DashboardBadge from "./DashboardBadge";

type SettingsStatusListProps = {
  items: SettingCheck[];
  showNotes?: boolean;
  onCycleState?: (label: string) => void;
};

const stateStyles: Record<
  SettingCheck["state"],
  { color: string; background: string }
> = {
  ok: {
    color: "#047857",
    background: "#d1fae5",
  },
  watch: {
    color: "#b45309",
    background: "#fef3c7",
  },
  next: {
    color: "#1d4ed8",
    background: "#dbeafe",
  },
};

function SettingsStatusList({
  items,
  showNotes = true,
  onCycleState,
}: SettingsStatusListProps) {
  return (
    <DashboardPanel title="Environment Checks">
      <div
        style={{
          display: "grid",
          gap: "12px",
        }}
      >
        {items.map((item) => {
          const stateStyle = stateStyles[item.state];

          return (
            <DashboardTile
              key={item.label}
              title={item.label}
              right={
                <DashboardBadge
                  label={item.state}
                  color={stateStyle.color}
                  background={stateStyle.background}
                  onClick={
                    onCycleState
                      ? () => onCycleState(item.label)
                      : undefined
                  }
                />
              }
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#111827",
                }}
              >
                {item.value}
              </p>

              {showNotes && (
                <p
                  style={{
                    margin: "10px 0 0 0",
                    color: "#4b5563",
                    lineHeight: 1.6,
                    fontSize: "14px",
                  }}
                >
                  {item.note}
                </p>
              )}
            </DashboardTile>
          );
        })}
      </div>
    </DashboardPanel>
  );
}

export default SettingsStatusList;