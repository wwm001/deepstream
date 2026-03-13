type SidebarNavItemProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

function SidebarNavItem({ label, active, onClick }: SidebarNavItemProps) {
  return (
    <li>
      <button
        type="button"
        aria-pressed={active}
        onClick={onClick}
        style={{
          width: "100%",
          textAlign: "left",
          padding: "12px 14px",
          borderRadius: "10px",
          border: active ? "none" : "1px solid #e5e7eb",
          background: active ? "#111827" : "#f9fafb",
          color: active ? "#ffffff" : "#111827",
          fontWeight: active ? 700 : 500,
          cursor: "pointer",
        }}
      >
        {label}
      </button>
    </li>
  );
}

export default SidebarNavItem;