import { appMeta } from "../appMeta";

function Footer() {
  return (
    <footer
      style={{
        marginTop: "32px",
        color: "#666",
        textAlign: "center",
      }}
    >
      <small style={{ display: "block" }}>{appMeta.footerText}</small>
      <small style={{ display: "block", marginTop: "6px", color: "#9ca3af" }}>
        {appMeta.statusText}
      </small>
    </footer>
  );
}

export default Footer;