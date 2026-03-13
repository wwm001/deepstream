import type { ReactNode } from "react";

type AppLayoutProps = {
  header: ReactNode;
  sidebar: ReactNode;
  content: ReactNode;
  footer: ReactNode;
};

function AppLayout({ header, sidebar, content, footer }: AppLayoutProps) {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px 24px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      {header}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "240px 1fr",
          gap: "24px",
          marginTop: "32px",
        }}
      >
        {sidebar}
        {content}
      </div>

      {footer}
    </main>
  );
}

export default AppLayout;