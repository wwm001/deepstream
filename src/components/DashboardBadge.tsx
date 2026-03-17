import { useState } from "react";

type DashboardBadgeProps = {
  label: string;
  color: string;
  background: string;
  borderColor?: string;
  onClick?: () => void;
};

function DashboardBadge({
  label,
  color,
  background,
  borderColor,
  onClick,
}: DashboardBadgeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const commonStyle = {
    display: "inline-block",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    color,
    background,
    padding: "4px 8px",
    borderRadius: "999px",
    border: borderColor ? `1px solid ${borderColor}` : "none",
  };

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          ...commonStyle,
          cursor: "pointer",
          transform: isHovered ? "translateY(-1px)" : "translateY(0)",
          boxShadow:
            isHovered || isFocused
              ? "0 4px 10px rgba(0, 0, 0, 0.08)"
              : "none",
          outline: isFocused ? "2px solid #93c5fd" : "none",
          outlineOffset: isFocused ? "2px" : undefined,
          transition:
            "transform 140ms ease, box-shadow 140ms ease, outline 140ms ease",
        }}
      >
        {label}
      </button>
    );
  }

  return <span style={commonStyle}>{label}</span>;
}

export default DashboardBadge;