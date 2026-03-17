import { useState } from "react";

type DashboardActionButtonProps = {
  label: string;
  onClick: () => void;
};

function DashboardActionButton({
  label,
  onClick,
}: DashboardActionButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={{
        border: "1px solid #e5e7eb",
        background: "#ffffff",
        color: "#6b7280",
        borderRadius: "999px",
        padding: "4px 8px",
        fontSize: "11px",
        fontWeight: 700,
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

export default DashboardActionButton;