import type { ReactNode } from "react";

type DashboardTileProps = {
  title?: string;
  right?: ReactNode;
  children: ReactNode;
  background?: string;
  borderColor?: string;
  titleColor?: string;
};

function DashboardTile({
  title,
  right,
  children,
  background = "#f8fafc",
  borderColor = "#e2e8f0",
  titleColor = "#64748b",
}: DashboardTileProps) {
  return (
    <article
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "16px 16px 16px 18px",
        borderRadius: "14px",
        background,
        border: `1px solid ${borderColor}`,
        boxShadow: "0 4px 10px rgba(15, 23, 42, 0.03)",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "0 auto 0 0",
          width: "5px",
          background: borderColor,
        }}
      />

      {(title || right) && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          {title && (
            <p
              style={{
                margin: 0,
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: titleColor,
              }}
            >
              {title}
            </p>
          )}

          {right}
        </div>
      )}

      <div
        style={{
          marginTop: title || right ? "12px" : 0,
        }}
      >
        {children}
      </div>
    </article>
  );
}

export default DashboardTile;