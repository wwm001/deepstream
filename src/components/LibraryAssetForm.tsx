import { useState } from "react";
import type { LibraryAsset } from "../data/dashboard";

type LibraryAssetFormProps = {
  onAddAsset: (input: {
    name: string;
    role: string;
    state: LibraryAsset["state"];
    note: string;
  }) => void;
};

function LibraryAssetForm({ onAddAsset }: LibraryAssetFormProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [state, setState] = useState<LibraryAsset["state"]>("active");
  const [note, setNote] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !role.trim() || !note.trim()) {
      setErrorMessage("name / role / note はすべて入力してください。");
      return;
    }

    onAddAsset({
      name,
      role,
      state,
      note,
    });

    setName("");
    setRole("");
    setState("active");
    setNote("");
    setErrorMessage("");
  };

  return (
    <section
      style={{
        padding: "18px",
        borderRadius: "12px",
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
      }}
    >
      <p
        style={{
          margin: "0 0 14px 0",
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#6b7280",
        }}
      >
        Add Library Asset
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gap: "14px",
        }}
      >
        <div>
          <label
            htmlFor="library-asset-name"
            style={{
              display: "block",
              margin: "0 0 8px 0",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#6b7280",
            }}
          >
            Name
          </label>

          <input
            id="library-asset-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="部品名を入力"
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "10px",
              border: "1px solid #d1d5db",
              background: "#f9fafb",
              color: "#111827",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div>
          <label
            htmlFor="library-asset-role"
            style={{
              display: "block",
              margin: "0 0 8px 0",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#6b7280",
            }}
          >
            Role
          </label>

          <input
            id="library-asset-role"
            type="text"
            value={role}
            onChange={(event) => setRole(event.target.value)}
            placeholder="役割を入力"
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "10px",
              border: "1px solid #d1d5db",
              background: "#f9fafb",
              color: "#111827",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div>
          <label
            htmlFor="library-asset-state"
            style={{
              display: "block",
              margin: "0 0 8px 0",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#6b7280",
            }}
          >
            State
          </label>

          <select
            id="library-asset-state"
            value={state}
            onChange={(event) =>
              setState(event.target.value as LibraryAsset["state"])
            }
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "10px",
              border: "1px solid #d1d5db",
              background: "#f9fafb",
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
          <label
            htmlFor="library-asset-note"
            style={{
              display: "block",
              margin: "0 0 8px 0",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#6b7280",
            }}
          >
            Note
          </label>

          <textarea
            id="library-asset-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="メモを入力"
            rows={4}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "10px",
              border: "1px solid #d1d5db",
              background: "#f9fafb",
              color: "#111827",
              fontSize: "14px",
              boxSizing: "border-box",
              resize: "vertical",
              fontFamily: "inherit",
            }}
          />
        </div>

        {errorMessage && (
          <p
            style={{
              margin: 0,
              color: "#b91c1c",
              fontSize: "13px",
              lineHeight: 1.6,
            }}
          >
            {errorMessage}
          </p>
        )}

        <div>
          <button
            type="submit"
            style={{
              border: "none",
              background: "#111827",
              color: "#ffffff",
              borderRadius: "10px",
              padding: "10px 14px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Add Asset
          </button>
        </div>
      </form>
    </section>
  );
}

export default LibraryAssetForm;