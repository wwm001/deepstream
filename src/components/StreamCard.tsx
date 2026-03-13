import type { DashboardCardType } from "../types";

type StreamCardProps = {
  title: string;
  description: string;
  type: DashboardCardType;
};

const badgeStyles: Record<DashboardCardType, { color: string; background: string }> = {
  ステータス: {
    color: "#1d4ed8",
    background: "#dbeafe",
  },
  進行中: {
    color: "#047857",
    background: "#d1fae5",
  },
  次の一手: {
    color: "#b45309",
    background: "#fef3c7",
  },
  試作段階: {
    color: "#7c3aed",
    background: "#ede9fe",
  },
};

function StreamCard({ title, description, type }: StreamCardProps) {
  const badgeStyle = badgeStyles[type];

  return (
    <article
      style={{
        padding: "18px",
        borderRadius: "12px",
        background: "#f3f4f6",
        border: "1px solid #e5e7eb",
        minHeight: "140px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <p
          style={{
            margin: "0 0 10px 0",
            display: "inline-block",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: badgeStyle.color,
            background: badgeStyle.background,
            padding: "4px 8px",
            borderRadius: "999px",
          }}
        >
          {type}
        </p>

        <h3
          style={{
            marginTop: 0,
            marginBottom: "12px",
            fontSize: "16px",
          }}
        >
          {title}
        </h3>
      </div>

      <p
        style={{
          marginBottom: 0,
          color: "#4b5563",
          lineHeight: 1.6,
        }}
      >
        {description}
      </p>
    </article>
  );
}

export default StreamCard;