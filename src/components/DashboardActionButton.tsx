import { useState } from "react";

type DashboardActionButtonProps = {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
};

function DashboardActionButton({
  label,
  onClick,
  type = "button",
  disabled = false,
}: DashboardActionButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isInteractive = !disabled;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
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
        cursor: isInteractive ? "pointer" : "not-allowed",
        opacity: isInteractive ? 1 : 0.5,
        transform:
          isInteractive && isHovered ? "translateY(-1px)" : "translateY(0)",
        boxShadow:
          isInteractive && (isHovered || isFocused)
            ? "0 4px 10px rgba(0, 0, 0, 0.08)"
            : "none",
        outline: isInteractive && isFocused ? "2px solid #93c5fd" : "none",
        outlineOffset: isInteractive && isFocused ? "2px" : undefined,
        transition:
          "transform 140ms ease, box-shadow 140ms ease, outline 140ms ease, opacity 140ms ease",
      }}
    >
      {label}
    </button>
  );
}

export default DashboardActionButton;