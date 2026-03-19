import type { ReactNode } from "react";

type AppLayoutProps = {
  header: ReactNode;
  sidebar: ReactNode;
  content: ReactNode;
  footer: ReactNode;
};

function AppLayout({
  header,
  sidebar,
  content,
  footer,
}: AppLayoutProps) {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "32px 20px 40px",
        background:
          "radial-gradient(circle at top, #eef6ff 0%, #f8fafc 38%, #f8fafc 100%)",
      }}
    >
      <div
        style={{
          maxWidth: "1360px",
          margin: "0 auto",
          display: "grid",
          gap: "24px",
        }}
      >
        {header}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(280px, 320px) minmax(0, 1fr)",
            gap: "24px",
            alignItems: "start",
          }}
        >
          <div
            style={{
              display: "grid",
              gap: "16px",
              position: "sticky",
              top: "24px",
              alignSelf: "start",
            }}
          >
            {sidebar}
          </div>

          <div
            style={{
              display: "grid",
              gap: "20px",
              minWidth: 0,
            }}
          >
            {content}
          </div>
        </div>

        {footer}
      </div>
    </main>
  );
}

export default AppLayout;