import { useRef, useState, type ChangeEvent } from "react";
import type { DashboardSnapshot } from "../utils/dashboardSnapshot";
import {
  createDashboardSnapshotFilename,
  isDashboardSnapshot,
} from "../utils/dashboardSnapshot";
import DashboardPanel from "./DashboardPanel";

type HomeCommandPanelProps = {
  snapshot: DashboardSnapshot;
  onImportSnapshot: (snapshot: DashboardSnapshot) => void;
  onResetWorkspace: () => void;
};

function HomeCommandPanel({
  snapshot,
  onImportSnapshot,
  onResetWorkspace,
}: HomeCommandPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"neutral" | "success" | "warning">(
    "neutral"
  );

  const handleExport = () => {
    try {
      const blob = new Blob([JSON.stringify(snapshot, null, 2)], {
        type: "application/json",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = createDashboardSnapshotFilename();
      link.click();
      window.URL.revokeObjectURL(url);

      setMessage("現在の状態を JSON として書き出しました。");
      setMessageTone("success");
    } catch (error) {
      console.error(error);
      setMessage("書き出しに失敗しました。");
      setMessageTone("warning");
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as unknown;

      if (!isDashboardSnapshot(parsed)) {
        setMessage("この JSON は DeepStream の有効なスナップショットではありません。");
        setMessageTone("warning");
        event.target.value = "";
        return;
      }

      onImportSnapshot(parsed);
      setMessage("スナップショットを復元しました。");
      setMessageTone("success");
    } catch (error) {
      console.error(error);
      setMessage("JSON の読み込みに失敗しました。");
      setMessageTone("warning");
    }

    event.target.value = "";
  };

  const handleReset = () => {
    const accepted = window.confirm(
      "ストリーム、ライブラリ、設定、表示状態を初期状態へ戻します。続行しますか？"
    );

    if (!accepted) {
      return;
    }

    onResetWorkspace();
    setMessage("ワークスペースを初期状態へ戻しました。");
    setMessageTone("success");
  };

  const messageColor =
    messageTone === "success"
      ? "#047857"
      : messageTone === "warning"
      ? "#b45309"
      : "#475569";

  return (
    <DashboardPanel title="Command Actions">
      <section
        style={{
          padding: "16px 18px",
          borderRadius: "14px",
          border: "1px solid #dbe4f0",
          background:
            "linear-gradient(135deg, #ffffff 0%, #f8fafc 48%, #eef6ff 100%)",
          boxShadow: "0 8px 18px rgba(15, 23, 42, 0.04)",
        }}
      >
        <p
          style={{
            margin: "0 0 8px 0",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#475569",
          }}
        >
          Command Actions
        </p>

        <p
          style={{
            margin: 0,
            fontSize: "15px",
            lineHeight: 1.7,
            color: "#0f172a",
            fontWeight: 600,
          }}
        >
          現在の DeepStream 状態を保存・復元し、必要に応じて全体をリセットできます。
        </p>
      </section>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "12px",
        }}
      >
        <article
          style={{
            padding: "16px 16px 18px 18px",
            borderRadius: "14px",
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            boxShadow: "0 4px 10px rgba(15, 23, 42, 0.03)",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#1d4ed8",
            }}
          >
            Export
          </p>

          <p
            style={{
              margin: "10px 0 0 0",
              fontSize: "14px",
              lineHeight: 1.7,
              color: "#334155",
              fontWeight: 500,
            }}
          >
            現在の状態を JSON として保存し、別タイミングで復元できます。
          </p>

          <button
            type="button"
            onClick={handleExport}
            style={{
              marginTop: "14px",
              border: "none",
              background: "#2563eb",
              color: "#ffffff",
              borderRadius: "10px",
              padding: "10px 14px",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 8px 16px rgba(37, 99, 235, 0.18)",
            }}
          >
            export snapshot
          </button>
        </article>

        <article
          style={{
            padding: "16px 16px 18px 18px",
            borderRadius: "14px",
            background: "#ecfdf5",
            border: "1px solid #a7f3d0",
            boxShadow: "0 4px 10px rgba(15, 23, 42, 0.03)",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#047857",
            }}
          >
            Import
          </p>

          <p
            style={{
              margin: "10px 0 0 0",
              fontSize: "14px",
              lineHeight: 1.7,
              color: "#334155",
              fontWeight: 500,
            }}
          >
            保存済みの JSON を読み込み、作業状態をそのまま復元します。
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            onChange={handleImportFile}
            style={{ display: "none" }}
          />

          <button
            type="button"
            onClick={handleImportClick}
            style={{
              marginTop: "14px",
              border: "none",
              background: "#10b981",
              color: "#ffffff",
              borderRadius: "10px",
              padding: "10px 14px",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 8px 16px rgba(16, 185, 129, 0.18)",
            }}
          >
            import snapshot
          </button>
        </article>

        <article
          style={{
            padding: "16px 16px 18px 18px",
            borderRadius: "14px",
            background: "#fffbeb",
            border: "1px solid #fde68a",
            boxShadow: "0 4px 10px rgba(15, 23, 42, 0.03)",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#b45309",
            }}
          >
            Reset
          </p>

          <p
            style={{
              margin: "10px 0 0 0",
              fontSize: "14px",
              lineHeight: 1.7,
              color: "#334155",
              fontWeight: 500,
            }}
          >
            ストリーム・ライブラリ・設定・表示状態を初期状態へ戻します。
          </p>

          <button
            type="button"
            onClick={handleReset}
            style={{
              marginTop: "14px",
              border: "none",
              background: "#f59e0b",
              color: "#ffffff",
              borderRadius: "10px",
              padding: "10px 14px",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 8px 16px rgba(245, 158, 11, 0.18)",
            }}
          >
            reset workspace
          </button>
        </article>
      </div>

      {message && (
        <p
          style={{
            margin: 0,
            fontSize: "13px",
            lineHeight: 1.7,
            color: messageColor,
            fontWeight: 600,
          }}
        >
          {message}
        </p>
      )}
    </DashboardPanel>
  );
}

export default HomeCommandPanel;