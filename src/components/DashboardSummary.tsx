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
        marginTop: "20px",
        padding: "18px",
        borderRadius: "12px",
        background: "#f9fafb",
        border: "1px solid #e5e7eb",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "12px",
        }}
      >
        <div>
          <p
            style={{
              margin: "0 0 6px 0",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#6b7280",
            }}
          >
            Current Section
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "18px",
              fontWeight: 700,
              color: "#111827",
            }}
          >
            {sectionLabel}
          </p>
        </div>

        <div>
          <p
            style={{
              margin: "0 0 6px 0",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#6b7280",
            }}
          >
            Status
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "16px",
              fontWeight: 600,
              color: "#111827",
            }}
          >
            {statusLabel}
          </p>
        </div>

        <div>
          <p
            style={{
              margin: "0 0 6px 0",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#6b7280",
            }}
          >
            Focus
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "16px",
              fontWeight: 600,
              color: "#111827",
            }}
          >
            {focusLabel}
          </p>
        </div>
      </div>
    </section>
  );
}

export default DashboardSummary;