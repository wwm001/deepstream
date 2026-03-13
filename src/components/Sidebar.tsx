import {
  navigationItems,
  type NavigationSection,
} from "../navigationItems";
import SidebarNavItem from "./SidebarNavItem";

type SidebarProps = {
  currentSection: NavigationSection;
  onSelectSection: (section: NavigationSection) => void;
};

function Sidebar({ currentSection, onSelectSection }: SidebarProps) {
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
          {navigationItems.map((label) => (
            <SidebarNavItem
              key={label}
              label={label}
              active={label === currentSection}
              onClick={() => onSelectSection(label)}
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;