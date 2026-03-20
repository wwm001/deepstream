import {
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
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
  onUpdateAsset?: (assetId: string, asset: Omit<LibraryAsset, "id">) => void;
  onResetAssets?: () => void;
};

type AssetFormErrors = Partial<Record<"name" | "role" | "note", string>>;

const NAME_MAX_LENGTH = 80;
const ROLE_MAX_LENGTH = 80;
const NOTE_MAX_LENGTH = 300;

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

function validateAssetInput(input: {
  name: string;
  role: string;
  note: string;
}): AssetFormErrors {
  const errors: AssetFormErrors = {};

  if (!input.name) {
    errors.name = "name を入力してください。";
  } else if (input.name.length > NAME_MAX_LENGTH) {
    errors.name = `name は ${NAME_MAX_LENGTH} 文字以内で入力してください。`;
  }

  if (!input.role) {
    errors.role = "role を入力してください。";
  } else if (input.role.length > ROLE_MAX_LENGTH) {
    errors.role = `role は ${ROLE_MAX_LENGTH} 文字以内で入力してください。`;
  }

  if (!input.note) {
    errors.note = "note を入力してください。";
  } else if (input.note.length > NOTE_MAX_LENGTH) {
    errors.note = `note は ${NOTE_MAX_LENGTH} 文字以内で入力してください。`;
  }

  return errors;
}

function LibraryAssetList({
  items,
  onRemoveAsset,
  onAddAsset,
  onUpdateAsset,
  onResetAssets,
}: LibraryAssetListProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [note, setNote] = useState("");
  const [state, setState] = useState<LibraryAsset["state"]>("active");
  const [errors, setErrors] = useState<AssetFormErrors>({});
  const [submitMessage, setSubmitMessage] = useState("");

  const [editingAssetId, setEditingAssetId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingRole, setEditingRole] = useState("");
  const [editingNote, setEditingNote] = useState("");
  const [editingState, setEditingState] = useState<LibraryAsset["state"]>("active");
  const [editingErrors, setEditingErrors] = useState<AssetFormErrors>({});

  const formRef = useRef<HTMLFormElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const roleInputRef = useRef<HTMLInputElement>(null);
  const noteTextareaRef = useRef<HTMLTextAreaElement>(null);

  const trimmedName = name.trim();
  const trimmedRole = role.trim();
  const trimmedNote = note.trim();

  const trimmedEditingName = editingName.trim();
  const trimmedEditingRole = editingRole.trim();
  const trimmedEditingNote = editingNote.trim();

  const canSubmit = useMemo(() => {
    return (
      trimmedName.length > 0 &&
      trimmedRole.length > 0 &&
      trimmedNote.length > 0 &&
      typeof onAddAsset === "function"
    );
  }, [trimmedName, trimmedRole, trimmedNote, onAddAsset]);

  const isDirty = useMemo(() => {
    return (
      name.length > 0 ||
      role.length > 0 ||
      note.length > 0 ||
      state !== "active" ||
      Object.keys(errors).length > 0 ||
      submitMessage.length > 0
    );
  }, [name, role, note, state, errors, submitMessage]);

  const clearForm = (withMessage = false) => {
    setName("");
    setRole("");
    setNote("");
    setState("active");
    setErrors({});
    setSubmitMessage(withMessage ? "入力をクリアしました。" : "");
    nameInputRef.current?.focus();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!onAddAsset) {
      return;
    }

    const nextErrors = validateAssetInput({
      name: trimmedName,
      role: trimmedRole,
      note: trimmedNote,
    });

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setSubmitMessage("");

      if (nextErrors.name) {
        nameInputRef.current?.focus();
      } else if (nextErrors.role) {
        roleInputRef.current?.focus();
      } else if (nextErrors.note) {
        noteTextareaRef.current?.focus();
      }

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
    setErrors({});
    setSubmitMessage("asset を追加しました。");
    nameInputRef.current?.focus();
  };

  const handleNoteKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter" && canSubmit) {
      event.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  const handleConfirmRemove = (asset: LibraryAssetItem) => {
    if (!onRemoveAsset || !asset.id) {
      return;
    }

    const accepted = window.confirm(
      `「${asset.name}」をライブラリから削除しますか？`
    );

    if (!accepted) {
      return;
    }

    onRemoveAsset(asset.id);

    if (editingAssetId === asset.id) {
      setEditingAssetId(null);
      setEditingErrors({});
    }
  };

  const handleConfirmReset = () => {
    if (!onResetAssets) {
      return;
    }

    const accepted = window.confirm(
      "ライブラリの一覧と表示状態を初期状態へ戻します。続行しますか？"
    );

    if (!accepted) {
      return;
    }

    onResetAssets();
    setEditingAssetId(null);
    setEditingErrors({});
  };

  const handleStartEdit = (asset: LibraryAssetItem) => {
    if (!asset.id) {
      return;
    }

    setEditingAssetId(asset.id);
    setEditingName(asset.name);
    setEditingRole(asset.role);
    setEditingNote(asset.note);
    setEditingState(asset.state);
    setEditingErrors({});
  };

  const handleCancelEdit = () => {
    setEditingAssetId(null);
    setEditingErrors({});
  };

  const handleSaveEdit = (asset: LibraryAssetItem) => {
    if (!asset.id || !onUpdateAsset) {
      return;
    }

    const nextErrors = validateAssetInput({
      name: trimmedEditingName,
      role: trimmedEditingRole,
      note: trimmedEditingNote,
    });

    if (Object.keys(nextErrors).length > 0) {
      setEditingErrors(nextErrors);
      return;
    }

    onUpdateAsset(asset.id, {
      name: trimmedEditingName,
      role: trimmedEditingRole,
      note: trimmedEditingNote,
      state: editingState,
    });

    setEditingAssetId(null);
    setEditingErrors({});
  };

  return (
    <DashboardPanel title="Component Assets">
      {(onAddAsset || onResetAssets) && (
        <div
          style={{
            display: "grid",
            gap: "12px",
          }}
        >
          {onAddAsset && (
            <form
              ref={formRef}
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
                <div>
                  <input
                    ref={nameInputRef}
                    type="text"
                    value={name}
                    maxLength={NAME_MAX_LENGTH}
                    onChange={(event) => {
                      setName(event.target.value);
                      setErrors((current) => ({ ...current, name: undefined }));
                      setSubmitMessage("");
                    }}
                    placeholder="name"
                    aria-invalid={Boolean(errors.name)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "10px",
                      border: errors.name
                        ? "1px solid #dc2626"
                        : "1px solid #d1d5db",
                      background: "#ffffff",
                      color: "#111827",
                      fontSize: "14px",
                      boxSizing: "border-box",
                    }}
                  />
                  {errors.name && (
                    <p
                      style={{
                        margin: "6px 0 0 0",
                        color: "#b91c1c",
                        fontSize: "12px",
                        lineHeight: 1.5,
                      }}
                    >
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    ref={roleInputRef}
                    type="text"
                    value={role}
                    maxLength={ROLE_MAX_LENGTH}
                    onChange={(event) => {
                      setRole(event.target.value);
                      setErrors((current) => ({ ...current, role: undefined }));
                      setSubmitMessage("");
                    }}
                    placeholder="role"
                    aria-invalid={Boolean(errors.role)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "10px",
                      border: errors.role
                        ? "1px solid #dc2626"
                        : "1px solid #d1d5db",
                      background: "#ffffff",
                      color: "#111827",
                      fontSize: "14px",
                      boxSizing: "border-box",
                    }}
                  />
                  {errors.role && (
                    <p
                      style={{
                        margin: "6px 0 0 0",
                        color: "#b91c1c",
                        fontSize: "12px",
                        lineHeight: 1.5,
                      }}
                    >
                      {errors.role}
                    </p>
                  )}
                </div>

                <select
                  value={state}
                  onChange={(event) => {
                    setState(event.target.value as LibraryAsset["state"]);
                    setSubmitMessage("");
                  }}
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

              <div>
                <textarea
                  ref={noteTextareaRef}
                  value={note}
                  maxLength={NOTE_MAX_LENGTH}
                  onChange={(event) => {
                    setNote(event.target.value);
                    setErrors((current) => ({ ...current, note: undefined }));
                    setSubmitMessage("");
                  }}
                  onKeyDown={handleNoteKeyDown}
                  placeholder="note"
                  rows={3}
                  aria-invalid={Boolean(errors.note)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "10px",
                    border: errors.note
                      ? "1px solid #dc2626"
                      : "1px solid #d1d5db",
                    background: "#ffffff",
                    color: "#111827",
                    fontSize: "14px",
                    boxSizing: "border-box",
                    resize: "vertical",
                    fontFamily: "inherit",
                  }}
                />
                {errors.note && (
                  <p
                    style={{
                      margin: "6px 0 0 0",
                      color: "#b91c1c",
                      fontSize: "12px",
                      lineHeight: 1.5,
                    }}
                  >
                    {errors.note}
                  </p>
                )}
              </div>

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
                    ? "add asset できます。textarea では Ctrl/Cmd+Enter で送信できます"
                    : "name / role / note を入れると追加できます"}
                </span>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  <DashboardActionButton
                    label="clear"
                    onClick={() => clearForm(true)}
                    disabled={!isDirty}
                  />
                  <DashboardActionButton
                    label="add asset"
                    type="submit"
                    disabled={!canSubmit}
                  />
                </div>
              </div>

              {submitMessage && (
                <p
                  style={{
                    margin: 0,
                    color: "#047857",
                    fontSize: "12px",
                    lineHeight: 1.6,
                  }}
                >
                  {submitMessage}
                </p>
              )}
            </form>
          )}

          {onResetAssets && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <DashboardActionButton
                label="reset library"
                onClick={handleConfirmReset}
              />
            </div>
          )}
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
            現在の filter / search 条件に一致するアセットはありません。
          </p>
        </article>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "12px",
          }}
        >
          {items.map((item) => {
            const stateStyle = stateStyles[item.state];
            const isEditing = editingAssetId === item.id;

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
                      label={isEditing ? editingState : item.state}
                      color={stateStyle.color}
                      background={stateStyle.background}
                    />

                    {isEditing ? (
                      <>
                        <DashboardActionButton
                          label="save"
                          onClick={() => handleSaveEdit(item)}
                        />
                        <DashboardActionButton
                          label="cancel"
                          onClick={handleCancelEdit}
                        />
                      </>
                    ) : (
                      <>
                        {onUpdateAsset && item.id && (
                          <DashboardActionButton
                            label="edit"
                            onClick={() => handleStartEdit(item)}
                          />
                        )}
                        {onRemoveAsset && item.id && (
                          <DashboardActionButton
                            label="remove"
                            onClick={() => handleConfirmRemove(item)}
                          />
                        )}
                      </>
                    )}
                  </div>
                }
              >
                {isEditing ? (
                  <div
                    style={{
                      display: "grid",
                      gap: "10px",
                    }}
                  >
                    <div>
                      <input
                        type="text"
                        value={editingName}
                        maxLength={NAME_MAX_LENGTH}
                        onChange={(event) => {
                          setEditingName(event.target.value);
                          setEditingErrors((current) => ({
                            ...current,
                            name: undefined,
                          }));
                        }}
                        placeholder="name"
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: "10px",
                          border: editingErrors.name
                            ? "1px solid #dc2626"
                            : "1px solid #d1d5db",
                          background: "#ffffff",
                          color: "#111827",
                          fontSize: "14px",
                          boxSizing: "border-box",
                        }}
                      />
                      {editingErrors.name && (
                        <p
                          style={{
                            margin: "6px 0 0 0",
                            color: "#b91c1c",
                            fontSize: "12px",
                            lineHeight: 1.5,
                          }}
                        >
                          {editingErrors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <input
                        type="text"
                        value={editingRole}
                        maxLength={ROLE_MAX_LENGTH}
                        onChange={(event) => {
                          setEditingRole(event.target.value);
                          setEditingErrors((current) => ({
                            ...current,
                            role: undefined,
                          }));
                        }}
                        placeholder="role"
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: "10px",
                          border: editingErrors.role
                            ? "1px solid #dc2626"
                            : "1px solid #d1d5db",
                          background: "#ffffff",
                          color: "#111827",
                          fontSize: "14px",
                          boxSizing: "border-box",
                        }}
                      />
                      {editingErrors.role && (
                        <p
                          style={{
                            margin: "6px 0 0 0",
                            color: "#b91c1c",
                            fontSize: "12px",
                            lineHeight: 1.5,
                          }}
                        >
                          {editingErrors.role}
                        </p>
                      )}
                    </div>

                    <select
                      value={editingState}
                      onChange={(event) =>
                        setEditingState(event.target.value as LibraryAsset["state"])
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

                    <div>
                      <textarea
                        value={editingNote}
                        maxLength={NOTE_MAX_LENGTH}
                        onChange={(event) => {
                          setEditingNote(event.target.value);
                          setEditingErrors((current) => ({
                            ...current,
                            note: undefined,
                          }));
                        }}
                        placeholder="note"
                        rows={4}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: "10px",
                          border: editingErrors.note
                            ? "1px solid #dc2626"
                            : "1px solid #d1d5db",
                          background: "#ffffff",
                          color: "#111827",
                          fontSize: "14px",
                          boxSizing: "border-box",
                          resize: "vertical",
                          fontFamily: "inherit",
                        }}
                      />
                      {editingErrors.note && (
                        <p
                          style={{
                            margin: "6px 0 0 0",
                            color: "#b91c1c",
                            fontSize: "12px",
                            lineHeight: 1.5,
                          }}
                        >
                          {editingErrors.note}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
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
                  </>
                )}
              </DashboardTile>
            );
          })}
        </div>
      )}
    </DashboardPanel>
  );
}

export default LibraryAssetList;