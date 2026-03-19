type DashboardSummaryProps = {
  sectionLabel: string;
  statusLabel: string;
  focusLabel: string;
};

function DashboardSummary({
  sectionLabel,
  statusLabel,
  focusLabel,
}: DashboardSummaryProps) {
  return (
    <section
      style={{
        display: "grid",
        gap: "14px",
        marginBottom: "20px",
      }}
    >
      <div
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
          Section Briefing
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
          現在の表示対象は「{sectionLabel}」です。いまの主状態は「{statusLabel}」、
          直近の注力ポイントは「{focusLabel}」です。
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "12px",
        }}
      >
        <article
          style={{
            position: "relative",
            overflow: "hidden",
            padding: "16px 16px 16px 18px",
            borderRadius: "12px",
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
          }}
        >
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: "0 auto 0 0",
              width: "6px",
              background: "#2563eb",
            }}
          />

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
            Active Section
          </p>

          <p
            style={{
              margin: "12px 0 0 0",
              fontSize: "24px",
              fontWeight: 800,
              lineHeight: 1.1,
              color: "#111827",
            }}
          >
            {sectionLabel}
          </p>

          <p
            style={{
              margin: "10px 0 0 0",
              fontSize: "13px",
              lineHeight: 1.65,
              color: "#334155",
            }}
          >
            現在操作しているセクションです。
          </p>
        </article>

        <article
          style={{
            position: "relative",
            overflow: "hidden",
            padding: "16px 16px 16px 18px",
            borderRadius: "12px",
            background: "#ecfdf5",
            border: "1px solid #a7f3d0",
            boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
          }}
        >
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: "0 auto 0 0",
              width: "6px",
              background: "#10b981",
            }}
          />

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
            Status
          </p>

          <p
            style={{
              margin: "12px 0 0 0",
              fontSize: "24px",
              fontWeight: 800,
              lineHeight: 1.1,
              color: "#111827",
            }}
          >
            {statusLabel}
          </p>

          <p
            style={{
              margin: "10px 0 0 0",
              fontSize: "13px",
              lineHeight: 1.65,
              color: "#334155",
            }}
          >
            現在の進行モードや状況を示します。
          </p>
        </article>

        <article
          style={{
            position: "relative",
            overflow: "hidden",
            padding: "16px 16px 16px 18px",
            borderRadius: "12px",
            background: "#fffbeb",
            border: "1px solid #fde68a",
            boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
          }}
        >
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: "0 auto 0 0",
              width: "6px",
              background: "#f59e0b",
            }}
          />

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
            Focus
          </p>

          <p
            style={{
              margin: "12px 0 0 0",
              fontSize: "24px",
              fontWeight: 800,
              lineHeight: 1.1,
              color: "#111827",
            }}
          >
            {focusLabel}
          </p>

          <p
            style={{
              margin: "10px 0 0 0",
              fontSize: "13px",
              lineHeight: 1.65,
              color: "#334155",
            }}
          >
            次の判断や作業で意識すべきポイントです。
          </p>
        </article>
      </div>
    </section>
  );
}

export default DashboardSummary;