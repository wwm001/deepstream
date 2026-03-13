import { appMeta } from "../appMeta";

function Header() {
  return (
    <header
      style={{
        background: "#ffffff",
        padding: "24px 28px",
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "0.08em",
          color: "#6b7280",
          textTransform: "uppercase",
        }}
      >
        Prototype
      </p>

      <h1
        style={{
          margin: "8px 0 0 0",
          fontSize: "32px",
        }}
      >
        {appMeta.title}
      </h1>

      <p
        style={{
          margin: "8px 0 0 0",
          color: "#4b5563",
        }}
      >
        {appMeta.subtitle}
      </p>
    </header>
  );
}

export default Header;