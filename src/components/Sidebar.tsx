import { navigationItems } from "../navigationItems";

function Sidebar() {
  return (
    <aside>
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
            <li key={item}>{item}</li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;