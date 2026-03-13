import { appMeta } from "../appMeta";

function Footer() {
  return (
    <footer
      style={{
        marginTop: "32px",
        textAlign: "center",
      }}
    >
      <small
        style={{
          display: "block",
          color: "#4b5563",
          fontWeight: 600,
        }}
      >
        {appMeta.footerText}
      </small>

      <small
        style={{
          display: "block",
          marginTop: "6px",
          color: "#9ca3af",
          lineHeight: 1.6,
        }}
      >
        {appMeta.statusText}
      </small>
    </footer>
  );
}

export default Footer;