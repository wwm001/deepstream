import { navigationItems } from "../navigationItems";

function Sidebar() {
  return (
    <aside
      style={{
        position: "sticky",
        top: "24px",
      }}
    >
      <p
        style={{
          margin: "0 0 8px 0",
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "0.08em",
          color: "#6b7280",
          textTransform: "uppercase",
        }}
      >
        Navigation
      </p>

      <nav>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "grid",
            gap: "12px",
          }}
        >
          {navigationItems.map((item) => (
            <li
              key={item.label}
              style={{
                padding: "12px 14px",
                borderRadius: "10px",
                background: item.active ? "#111827" : "#f3f4f6",
                color: item.active ? "#ffffff" : "#111827",
                fontWeight: item.active ? 700 : 500,
              }}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;