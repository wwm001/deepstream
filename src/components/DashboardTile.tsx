import type { KeyboardEvent, ReactNode } from "react";

type DashboardTileProps = {
  title?: string;
  right?: ReactNode;
  children: ReactNode;
  background?: string;
  borderColor?: string;
  titleColor?: string;
  onClick?: () => void;
};

function DashboardTile({
  title,
  right,
  children,
  background = "#f9fafb",
  borderColor = "#f3f4f6",
  titleColor = "#6b7280",
  onClick,
}: DashboardTileProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!onClick) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <article
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      style={{
        padding: "14px 16px",
        borderRadius: "10px",
        background,
        border: `1px solid ${borderColor}`,
        cursor: onClick ? "pointer" : "default",
      }}
    >
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
          marginTop: title || right ? "10px" : 0,
        }}
      >
        {children}
      </div>
    </article>
  );
}

export default DashboardTile;