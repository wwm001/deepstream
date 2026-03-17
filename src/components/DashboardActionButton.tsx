type DashboardActionButtonProps = {
  label: string;
  onClick: () => void;
};

function DashboardActionButton({
  label,
  onClick,
}: DashboardActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        border: "1px solid #e5e7eb",
        background: "#ffffff",
        color: "#6b7280",
        borderRadius: "999px",
        padding: "4px 8px",
        fontSize: "11px",
        fontWeight: 700,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

export default DashboardActionButton;