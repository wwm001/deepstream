import { navigationItems } from "../navigationItems";
import SidebarNavItem from "./SidebarNavItem";

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
            <SidebarNavItem
              key={item.label}
              label={item.label}
              active={item.active}
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;