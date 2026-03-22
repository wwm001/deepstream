import { useEffect, useState, type ReactNode } from "react";

type AppLayoutProps = {
  header: ReactNode;
  content: ReactNode;
  footer: ReactNode;
  overlay?: ReactNode;
};

function AppLayout({
  header,
  content,
  footer,
  overlay,
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

  const isPhoneLayout = viewportWidth < 640;

  const mainPadding = isPhoneLayout
    ? "16px 12px 28px"
    : "28px 18px 40px";

  const outerGap = isPhoneLayout ? "16px" : "24px";

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
        {content}
        {footer}
      </div>

      {overlay}
    </main>
  );
}

export default AppLayout;