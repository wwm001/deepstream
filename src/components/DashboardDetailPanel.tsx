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
  const itemCount = items.length;

  return (
    <section
      style={{
        display: "grid",
        gap: "14px",
        marginBottom: "24px",
      }}
    >
      <div
        style={{
          padding: "16px 18px",
          borderRadius: "14px",
          border: "1px solid #e2e8f0",
          background:
            "linear-gradient(135deg, #ffffff 0%, #f8fafc 52%, #eef6ff 100%)",
          boxShadow: "0 8px 18px rgba(15, 23, 42, 0.04)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <div>
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
              Detail Briefing
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
              {title} に関する補足情報を {itemCount} 項目で整理しています。
            </p>
          </div>

          <div
            style={{
              minWidth: "96px",
              padding: "10px 12px",
              borderRadius: "12px",
              background: "#ffffff",
              border: "1px solid #dbe4f0",
            }}
          >
            <p
              style={{
                margin: "0 0 4px 0",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "#64748b",
              }}
            >
              Items
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "22px",
                fontWeight: 800,
                lineHeight: 1,
                color: "#111827",
              }}
            >
              {itemCount}
            </p>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gap: "12px",
        }}
      >
        {items.map((item) => (
          <article
            key={item.label}
            style={{
              position: "relative",
              overflow: "hidden",
              padding: "16px 16px 16px 18px",
              borderRadius: "12px",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: "0 auto 0 0",
                width: "6px",
                background: "#94a3b8",
              }}
            />

            <p
              style={{
                margin: 0,
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "#475569",
              }}
            >
              {item.label}
            </p>

            <p
              style={{
                margin: "10px 0 0 0",
                fontSize: "15px",
                lineHeight: 1.75,
                color: "#0f172a",
                fontWeight: 600,
              }}
            >
              {item.value}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default DashboardDetailPanel;