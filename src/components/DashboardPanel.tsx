import type { ReactNode } from "react";

type DashboardPanelProps = {
  title: string;
  children: ReactNode;
};

function DashboardPanel({ title, children }: DashboardPanelProps) {
  return (
    <section
      style={{
        marginTop: "20px",
        padding: "18px",
        borderRadius: "12px",
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
      }}
    >
      <p
        style={{
          margin: "0 0 14px 0",
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#6b7280",
        }}
      >
        {title}
      </p>

      {children}
    </section>
  );
}

export default DashboardPanel;