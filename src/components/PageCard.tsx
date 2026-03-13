import type { ReactNode } from "react";

type PageCardProps = {
  children: ReactNode;
};

function PageCard({ children }: PageCardProps) {
  return (
    <section
      style={{
        background: "#ffffff",
        padding: "24px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
      }}
    >
      {children}
    </section>
  );
}

export default PageCard;