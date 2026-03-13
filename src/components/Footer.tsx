import { appMeta } from "../appMeta";

function Footer() {
  return (
    <footer style={{ marginTop: "32px", color: "#666" }}>
      <small>{appMeta.footerText}</small>
    </footer>
  );
}

export default Footer;