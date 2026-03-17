import type { LibraryAsset } from "../dashboardData/types";
import DashboardPanel from "./DashboardPanel";
import DashboardTile from "./DashboardTile";
import DashboardBadge from "./DashboardBadge";

type LibraryAssetItem = LibraryAsset & {
  id?: string;
};

type LibraryAssetListProps = {
  items: LibraryAssetItem[];
  onRemoveAsset?: (assetId: string) => void;
};

const stateStyles: Record<
  LibraryAsset["state"],
  { color: string; background: string }
> = {
  stable: {
    color: "#1d4ed8",
    background: "#dbeafe",
  },
  active: {
    color: "#047857",
    background: "#d1fae5",
  },
  next: {
    color: "#b45309",
    background: "#fef3c7",
  },
};

function LibraryAssetList({
  items,
  onRemoveAsset,
}: LibraryAssetListProps) {
  return (
    <DashboardPanel title="Component Assets">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "12px",
        }}
      >
        {items.map((item) => {
          const stateStyle = stateStyles[item.state];

          return (
            <DashboardTile
              key={item.id ?? item.name}
              title={item.name}
              right={
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  <DashboardBadge
                    label={item.state}
                    color={stateStyle.color}
                    background={stateStyle.background}
                  />

                  {onRemoveAsset && item.id && (
                    <button
                      type="button"
                      onClick={() => onRemoveAsset(item.id!)}
                      style={{
                        border: "1px solid #e5e7eb",
                        background: "#ffffff",
                        color: "#6b7280",
                        borderRadius: "999px",
                        padding: "4px 8px",
                        fontSize: "11px",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      remove
                    </button>
                  )}
                </div>
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
                {item.role}
              </p>

              <p
                style={{
                  margin: "8px 0 0 0",
                  color: "#4b5563",
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

export default LibraryAssetList;