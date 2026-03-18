import { useMemo, useState, type FormEvent } from "react";
import type { LibraryAsset } from "../dashboardData/types";
import DashboardPanel from "./DashboardPanel";
import DashboardTile from "./DashboardTile";
import DashboardBadge from "./DashboardBadge";
import DashboardActionButton from "./DashboardActionButton";

type LibraryAssetItem = LibraryAsset & {
  id?: string;
};

type LibraryAssetListProps = {
  items: LibraryAssetItem[];
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
  const [note, setNote] = useState("");
  const [state, setState] = useState<LibraryAsset["state"]>("active");

  const trimmedName = name.trim();
  const trimmedRole = role.trim();
  const trimmedNote = note.trim();

  const canSubmit = useMemo(() => {
    return (
      trimmedName.length > 0 &&
      trimmedRole.length > 0 &&
      trimmedNote.length > 0 &&
      typeof onAddAsset === "function"
    );
  }, [trimmedName, trimmedRole, trimmedNote, onAddAsset]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit || !onAddAsset) {
      return;
    }

    onAddAsset({
      name: trimmedName,
      role: trimmedRole,
      note: trimmedNote,
      state,
    });

    setName("");
    setRole("");
    setNote("");
    setState("active");
  };

  return (
    <DashboardPanel title="Component Assets">
      {(onAddAsset || onResetAssets) && (
        <div
          style={{
            display: "grid",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          {onAddAsset && (
            <form
              onSubmit={handleSubmit}
              style={{
                display: "grid",
                gap: "10px",
                padding: "14px",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                background: "#f9fafb",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                  gap: "10px",
                }}
              >
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="name"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "10px",
                    border: "1px solid #d1d5db",
                    background: "#ffffff",
                    color: "#111827",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />

                <input
                  type="text"
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  placeholder="role"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "10px",
                    border: "1px solid #d1d5db",
                    background: "#ffffff",
                    color: "#111827",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />

                <select
                  value={state}
                  onChange={(event) =>
                    setState(event.target.value as LibraryAsset["state"])
                  }
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "10px",
                    border: "1px solid #d1d5db",
                    background: "#ffffff",
                    color: "#111827",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="stable">stable</option>
                  <option value="active">active</option>
                  <option value="next">next</option>
                </select>
              </div>

              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="note"
                rows={3}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: "1px solid #d1d5db",
                  background: "#ffffff",
                  color: "#111827",
                  fontSize: "14px",
                  boxSizing: "border-box",
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    color: canSubmit ? "#047857" : "#6b7280",
                    lineHeight: 1.6,
                  }}
                >
                  {canSubmit
                    ? "Enter または add asset で追加できます"
                    : "name / role / note を入れると追加できます"}
                </span>

                <DashboardActionButton
                  label="add asset"
                  type="submit"
                  disabled={!canSubmit}
                />
              </div>
            </form>
          )}

          {onResetAssets && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <DashboardActionButton label="reset" onClick={onResetAssets} />
            </div>
          )}
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
                    <DashboardActionButton
                      label="remove"
                      onClick={() => onRemoveAsset(item.id!)}
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