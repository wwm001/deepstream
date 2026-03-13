type DashboardDetailItem = {
  label: string;
  value: string;
};

type DashboardDetailPanelProps = {
  title: string;
  items: DashboardDetailItem[];
};

function DashboardDetailPanel({
  title,
  items,
}: DashboardDetailPanelProps) {
  return (
    <section
      style={{
        marginTop: "20px",
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
        {title}
      </p>

      <div
        style={{
          display: "grid",
          gap: "12px",
        }}
      >
        {items.map((item) => (
          <div
            key={item.label}
            style={{
              padding: "12px 14px",
              borderRadius: "10px",
              background: "#f9fafb",
              border: "1px solid #f3f4f6",
            }}
          >
            <p
              style={{
                margin: "0 0 6px 0",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "#6b7280",
              }}
            >
              {item.label}
            </p>

            <p
              style={{
                margin: 0,
                fontSize: "15px",
                lineHeight: 1.6,
                color: "#111827",
                fontWeight: 600,
              }}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default DashboardDetailPanel;