import type { LibraryAsset } from "../data/dashboard";

type LibraryStateSummaryProps = {
  stableCount: number;
  activeCount: number;
  nextCount: number;
};

const stateStyles: Record<
  LibraryAsset["state"],
  { color: string; background: string; border: string }
> = {
  stable: {
    color: "#1d4ed8",
    background: "#eff6ff",
    border: "#bfdbfe",
  },
  active: {
    color: "#047857",
    background: "#ecfdf5",
    border: "#a7f3d0",
  },
  next: {
    color: "#b45309",
    background: "#fffbeb",
    border: "#fde68a",
  },
};

function LibraryStateSummary({
  stableCount,
  activeCount,
  nextCount,
}: LibraryStateSummaryProps) {
  const items: Array<{
    label: LibraryAsset["state"];
    value: number;
    note: string;
  }> = [
    {
      label: "stable",
      value: stableCount,
      note: "安定運用中の資産です。",
    },
    {
      label: "active",
      value: activeCount,
      note: "現在主力として使っている資産です。",
    },
    {
      label: "next",
      value: nextCount,
      note: "次に育てる候補資産です。",
    },
  ];

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
        Library Summary
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "12px",
        }}
      >
        {items.map((item) => {
          const stateStyle = stateStyles[item.label];

          return (
            <article
              key={item.label}
              style={{
                padding: "14px 16px",
                borderRadius: "10px",
                background: stateStyle.background,
                border: `1px solid ${stateStyle.border}`,
              }}
            >
              <p
                style={{
                  margin: 0,
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
                  margin: "10px 0 0 0",
                  fontSize: "28px",
                  fontWeight: 800,
                  lineHeight: 1,
                  color: stateStyle.color,
                }}
              >
                {item.value}
              </p>

              <p
                style={{
                  margin: "10px 0 0 0",
                  color: "#4b5563",
                  lineHeight: 1.6,
                  fontSize: "13px",
                }}
              >
                {item.note}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default LibraryStateSummary;