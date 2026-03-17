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
        style={{
          ...commonStyle,
          cursor: "pointer",
        }}
      >
        {label}
      </button>
    );
  }

  return <span style={commonStyle}>{label}</span>;
}

export default DashboardBadge;