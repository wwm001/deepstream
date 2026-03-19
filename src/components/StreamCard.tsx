import type { DashboardCardType } from "../types";

type StreamCardProps = {
  title: string;
  description: string;
  type: DashboardCardType;
};

const badgeStyles: Record<
  DashboardCardType,
  {
    color: string;
    background: string;
    border: string;
    accent: string;
  }
> = {
  ステータス: {
    color: "#1d4ed8",
    background: "#eff6ff",
    border: "#bfdbfe",
    accent: "#2563eb",
  },
  進行中: {
    color: "#047857",
    background: "#ecfdf5",
    border: "#a7f3d0",
    accent: "#10b981",
  },
  次の一手: {
    color: "#b45309",
    background: "#fffbeb",
    border: "#fde68a",
    accent: "#f59e0b",
  },
  試作段階: {
    color: "#7c3aed",
    background: "#f5f3ff",
    border: "#ddd6fe",
    accent: "#8b5cf6",
  },
};

function StreamCard({ title, description, type }: StreamCardProps) {
  const badgeStyle = badgeStyles[type];

  return (
    <article
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "18px 18px 18px 20px",
        borderRadius: "16px",
        background: "#ffffff",
        border: `1px solid ${badgeStyle.border}`,
        boxShadow: "0 10px 20px rgba(15, 23, 42, 0.04)",
        minHeight: "164px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "0 auto 0 0",
          width: "6px",
          background: badgeStyle.accent,
        }}
      />

      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <p
            style={{
              margin: 0,
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: badgeStyle.color,
              background: badgeStyle.background,
              border: `1px solid ${badgeStyle.border}`,
              padding: "5px 9px",
              borderRadius: "999px",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "999px",
                background: badgeStyle.accent,
                flex: "0 0 auto",
              }}
            />
            {type}
          </p>
        </div>

        <h3
          style={{
            margin: "14px 0 0 0",
            fontSize: "18px",
            lineHeight: 1.35,
            color: "#111827",
            fontWeight: 800,
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </h3>
      </div>

      <p
        style={{
          margin: "14px 0 0 0",
          color: "#475569",
          lineHeight: 1.75,
          fontSize: "14px",
          fontWeight: 500,
        }}
      >
        {description}
      </p>
    </article>
  );
}

export default StreamCard;