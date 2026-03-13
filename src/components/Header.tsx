import { appMeta } from "../appMeta";
import StatusPill from "./StatusPill";

function Header() {
  return (
    <header
      style={{
        background: "#ffffff",
        padding: "24px 28px",
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "24px",
        flexWrap: "wrap",
      }}
    >
      <div>
        <StatusPill label={appMeta.badge} tone="indigo" />

        <h1
          style={{
            margin: "12px 0 0 0",
            fontSize: "32px",
          }}
        >
          {appMeta.title}
        </h1>

        <p
          style={{
            margin: "8px 0 0 0",
            color: "#4b5563",
            lineHeight: 1.6,
          }}
        >
          {appMeta.subtitle}
        </p>
      </div>

      <StatusPill label={appMeta.statusText} tone="gray" />
    </header>
  );
}

export default Header;