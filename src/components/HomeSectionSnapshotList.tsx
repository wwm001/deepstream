import type { HomeSectionSnapshot } from "../dashboardData/types";

type HomeSectionSnapshotListProps = {
  items: HomeSectionSnapshot[];
};

function HomeSectionSnapshotList({ items }: HomeSectionSnapshotListProps) {
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
        Section Map
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "12px",
        }}
      >
        {items.map((item) => (
          <article
            key={item.section}
            style={{
              padding: "14px 16px",
              borderRadius: "10px",
              background: "#f9fafb",
              border: "1px solid #f3f4f6",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "18px",
                  color: "#111827",
                }}
              >
                {item.section}
              </h3>

              <span
                style={{
                  display: "inline-block",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "#1d4ed8",
                  background: "#dbeafe",
                  padding: "4px 8px",
                  borderRadius: "999px",
                }}
              >
                cards {item.cardCount}
              </span>
            </div>

            <p
              style={{
                margin: "10px 0 0 0",
                fontSize: "14px",
                fontWeight: 600,
                color: "#111827",
              }}
            >
              {item.status}
            </p>

            <p
              style={{
                margin: "8px 0 0 0",
                fontSize: "14px",
                color: "#4b5563",
                lineHeight: 1.6,
              }}
            >
              Focus: {item.focus}
            </p>

            <p
              style={{
                margin: "8px 0 0 0",
                fontSize: "14px",
                color: "#374151",
                lineHeight: 1.6,
              }}
            >
              {item.note}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default HomeSectionSnapshotList;