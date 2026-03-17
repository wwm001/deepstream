import type { SettingCheck } from "../dashboardData/types";
import DashboardPanel from "./DashboardPanel";

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
            <article
              key={item.label}
              style={{
                padding: "14px 16px",
                borderRadius: "10px",
                background: "#f9fafb",
                border: "1px solid #f3f4f6",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <p
                    style={{
                      margin: "0 0 6px 0",
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "#6b7280",
                    }}
                  >
                    {item.label}
                  </p>

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
                </div>

                {onCycleState ? (
                  <button
                    type="button"
                    onClick={() => onCycleState(item.label)}
                    style={{
                      display: "inline-block",
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: stateStyle.color,
                      background: stateStyle.background,
                      padding: "4px 8px",
                      borderRadius: "999px",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {item.state}
                  </button>
                ) : (
                  <span
                    style={{
                      display: "inline-block",
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: stateStyle.color,
                      background: stateStyle.background,
                      padding: "4px 8px",
                      borderRadius: "999px",
                    }}
                  >
                    {item.state}
                  </span>
                )}
              </div>

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
            </article>
          );
        })}
      </div>
    </DashboardPanel>
  );
}

export default SettingsStatusList;