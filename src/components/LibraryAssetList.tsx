import { useState } from "react";
import type { LibraryAsset } from "../dashboardData/types";
import DashboardPanel from "./DashboardPanel";
import DashboardTile from "./DashboardTile";
import DashboardBadge from "./DashboardBadge";
import DashboardActionButton from "./DashboardActionButton";

type LibraryAssetListProps = {
  items: LibraryAsset[];
  onRemoveAsset?: (assetId: string) => void;
  onAddAsset?: (asset: Omit<LibraryAsset, "id">) => void;
  onResetAssets?: () => void;
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
  onAddAsset,
  onResetAssets,
}: LibraryAssetListProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [state, setState] = useState<LibraryAsset["state"]>("next");
  const [note, setNote] = useState("");

  const handleSubmit = () => {
    const trimmedName = name.trim();
    const trimmedRole = role.trim();
    const trimmedNote = note.trim();

    if (!onAddAsset || !trimmedName || !trimmedRole) return;

    onAddAsset({
      name: trimmedName,
      role: trimmedRole,
      state,
      note:
        trimmedNote || "追加されたライブラリアセットです。",
    });

    setName("");
    setRole("");
    setState("next");
    setNote("");
  };

  return (
    <DashboardPanel
      title="Component Assets"
      right={
        onResetAssets ? (
          <DashboardActionButton
            label="reset"
            onClick={onResetAssets}
          />
        ) : undefined
      }
    >
      {onAddAsset && (
        <div
          style={{
            display: "grid",
            gap: "10px",
            marginBottom: "16px",
            padding: "14px 16px",
            borderRadius: "10px",
            background: "#f9fafb",
            border: "1px solid #f3f4f6",
          }}
        >
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="asset name"
            style={{
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              fontSize: "14px",
            }}
          />
          <input
            value={role}
            onChange={(event) => setRole(event.target.value)}
            placeholder="role"
            style={{
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              fontSize: "14px",
            }}
          />
          <select
            value={state}
            onChange={(event) =>
              setState(event.target.value as LibraryAsset["state"])
            }
            style={{
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              fontSize: "14px",
              background: "#ffffff",
            }}
          >
            <option value="stable">stable</option>
            <option value="active">active</option>
            <option value="next">next</option>
          </select>
          <input
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="note (optional)"
            style={{
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              fontSize: "14px",
            }}
          />
          <div>
            <DashboardActionButton
              label="add asset"
              onClick={handleSubmit}
            />
          </div>
        </div>
      )}

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
              key={item.id}
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

                  {onRemoveAsset && (
                    <DashboardActionButton
                      label="remove"
                      onClick={() => onRemoveAsset(item.id)}
                    />
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