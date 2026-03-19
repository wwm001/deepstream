import type { SettingCheck } from "../dashboardData/types";
import DashboardPanel from "./DashboardPanel";
import DashboardTile from "./DashboardTile";
import DashboardBadge from "./DashboardBadge";
import DashboardActionButton from "./DashboardActionButton";

type SettingsStatusListProps = {
  items: SettingCheck[];
  showNotes?: boolean;
  onCycleState?: (label: string) => void;
  onResetAll?: () => void;
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
  onResetAll,
}: SettingsStatusListProps) {
  const handleConfirmReset = () => {
    if (!onResetAll) {
      return;
    }

    const accepted = window.confirm(
      "設定チェックの状態と表示設定を初期状態へ戻します。続行しますか？"
    );

    if (!accepted) {
      return;
    }

    onResetAll();
  };

  return (
    <DashboardPanel title="Environment Checks">
      {onResetAll && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <DashboardActionButton
            label="reset settings"
            onClick={handleConfirmReset}
          />
        </div>
      )}

      {items.length === 0 ? (
        <article
          style={{
            padding: "16px 18px",
            borderRadius: "14px",
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 10px rgba(15, 23, 42, 0.03)",
          }}
        >
          <p
            style={{
              margin: "0 0 6px 0",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#64748b",
            }}
          >
            Empty Result
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              lineHeight: 1.7,
              color: "#334155",
              fontWeight: 500,
            }}
          >
            現在の filter 条件に一致する設定項目はありません。
          </p>
        </article>
      ) : (
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
                      onCycleState ? () => onCycleState(item.label) : undefined
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
      )}
    </DashboardPanel>
  );
}

export default SettingsStatusList;