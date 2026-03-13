import { appMeta } from "../appMeta";

function Header() {
  return (
    <header>
      <h1>{appMeta.title}</h1>
      <p>{appMeta.subtitle}</p>
    </header>
  );
}

export default Header;