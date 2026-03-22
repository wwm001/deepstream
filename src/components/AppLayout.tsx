import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

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
  const [viewportWidth, setViewportWidth] = useState<number>(() =>
    typeof window === "undefined" ? 1280 : window.innerWidth
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isMobileLayout = viewportWidth < 980;
  const isPhoneLayout = viewportWidth < 640;

  const mainPadding = isPhoneLayout
    ? "16px 12px 28px"
    : isMobileLayout
      ? "24px 16px 36px"
      : "32px 20px 40px";

  const outerGap = isPhoneLayout ? "16px" : isMobileLayout ? "20px" : "24px";
  const shellGap = isPhoneLayout ? "16px" : isMobileLayout ? "20px" : "24px";

  const sidebarWrapperStyle: CSSProperties = {
    display: "grid",
    gap: "16px",
    position: isMobileLayout ? "static" : "sticky",
    top: isMobileLayout ? undefined : "24px",
    alignSelf: "start",
    minWidth: 0,
  };

  const contentWrapperStyle: CSSProperties = {
    display: "grid",
    gap: isPhoneLayout ? "16px" : "20px",
    minWidth: 0,
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: mainPadding,
        background:
          "radial-gradient(circle at top, #eef6ff 0%, #f8fafc 38%, #f8fafc 100%)",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "1360px",
          margin: "0 auto",
          display: "grid",
          gap: outerGap,
        }}
      >
        {header}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobileLayout
              ? "minmax(0, 1fr)"
              : "minmax(280px, 320px) minmax(0, 1fr)",
            gap: shellGap,
            alignItems: "start",
          }}
        >
          {isMobileLayout ? (
            <>
              <div style={contentWrapperStyle}>{content}</div>
              <div style={sidebarWrapperStyle}>{sidebar}</div>
            </>
          ) : (
            <>
              <div style={sidebarWrapperStyle}>{sidebar}</div>
              <div style={contentWrapperStyle}>{content}</div>
            </>
          )}
        </div>

        {footer}
      </div>
    </main>
  );
}

export default AppLayout;