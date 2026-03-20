import {
  useEffect,
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
  onResetAssets,
}: LibraryAssetListProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [note, setNote] = useState("");
  const [state, setState] = useState<LibraryAsset["state"]>("active");
  const [errors, setErrors] = useState<AssetFormErrors>({});
  const [submitMessage, setSubmitMessage] = useState("");

  const nameInputRef = useRef<HTMLInputElement>(null);
  const roleInputRef = useRef<HTMLInputElement>(null);
  const noteTextareaRef = useRef<HTMLTextAreaElement>(null);

  const trimmedName = name.trim();
  const trimmedRole = role.trim();
  const trimmedNote = note.trim();

  const isDirty = useMemo(() => {
    return (
      name.length > 0 ||
      role.length > 0 ||
      note.length > 0 ||
      state !== "active"
    );
  }, [name, role, note, state]);

  const canSubmit = useMemo(() => {
    return (
      trimmedName.length > 0 &&
      trimmedRole.length > 0 &&
      trimmedNote.length > 0 &&
      typeof onAddAsset === "function"
    );
  }, [trimmedName, trimmedRole, trimmedNote, onAddAsset]);

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  const clearForm = (shouldFocus = false) => {
    setName("");
    setRole("");
    setNote("");
    setState("active");
    setErrors({});
    setSubmitMessage("");

    if (shouldFocus) {
      requestAnimationFrame(() => {
        nameInputRef.current?.focus();
      });
    }
  };

  const focusFirstError = (nextErrors: AssetFormErrors) => {
    if (nextErrors.name) {
      nameInputRef.current?.focus();
      return;
    }

    if (nextErrors.role) {
      roleInputRef.current?.focus();
      return;
    }

    if (nextErrors.note) {
      noteTextareaRef.current?.focus();
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateAssetInput({
      name: trimmedName,
      role: trimmedRole,
      note: trimmedNote,
    });

    if (Object.keys(nextErrors).length > 0 || !onAddAsset) {
      setErrors(nextErrors);
      setSubmitMessage("");
      focusFirstError(nextErrors);
      return;
    }

    onAddAsset({
      name: trimmedName,
      role: trimmedRole,
      note: trimmedNote,
      state,
    });

    clearForm(false);
    setSubmitMessage("asset を追加しました。");
    requestAnimationFrame(() => {
      nameInputRef.current?.focus();
    });
  };

  const handleNoteKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();

      const form = event.currentTarget.form;
      if (form) {
        form.requestSubmit();
      }
    }
  };

  const handleRemoveAsset = (item: LibraryAssetItem) => {
    if (!onRemoveAsset || !item.id) {
      return;
    }

    const shouldRemove = window.confirm(
      `Remove asset "${item.name}"?`,
    );

    if (!shouldRemove) {
      return;
    }

    onRemoveAsset(item.id);
  };

  const handleResetAssets = () => {
    if (!onResetAssets) {
      return;
    }

    const shouldReset = window.confirm(
      "Reset all component assets?",
    );

    if (!shouldReset) {
      return;
    }

    onResetAssets();
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
              <DashboardActionButton label="reset" onClick={handleResetAssets} />
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
                      onClick={() => handleRemoveAsset(item)}
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