import { navigationItems } from "../navigationItems";

function Sidebar() {
  return (
    <aside
      style={{
        position: "sticky",
        top: "24px",
      }}
    >
      <h2 style={{ marginTop: 0 }}>Navigation</h2>

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