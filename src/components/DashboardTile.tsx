import { useState, type KeyboardEvent, type ReactNode } from "react";

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
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isInteractive = Boolean(onClick);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!onClick) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <article
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={{
        padding: "14px 16px",
        borderRadius: "10px",
        background,
        border: `1px solid ${borderColor}`,
        cursor: isInteractive ? "pointer" : "default",
        transform:
          isInteractive && isHovered ? "translateY(-1px)" : "translateY(0)",
        boxShadow:
          isInteractive && (isHovered || isFocused)
            ? "0 6px 14px rgba(0, 0, 0, 0.08)"
            : "none",
        outline:
          isInteractive && isFocused ? "2px solid #93c5fd" : "none",
        outlineOffset: isInteractive && isFocused ? "2px" : undefined,
        transition:
          "transform 140ms ease, box-shadow 140ms ease, outline 140ms ease",
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