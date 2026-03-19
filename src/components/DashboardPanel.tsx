import type { ReactNode } from "react";

type DashboardPanelProps = {
  title: string;
  children: ReactNode;
};

function DashboardPanel({ title, children }: DashboardPanelProps) {
  return (
    <section
      style={{
        display: "grid",
        gap: "14px",
      }}
    >
      <div
        style={{
          padding: "16px 18px",
          borderRadius: "16px",
          border: "1px solid #dbe4f0",
          background:
            "linear-gradient(135deg, #ffffff 0%, #f8fafc 48%, #eef6ff 100%)",
          boxShadow: "0 10px 22px rgba(15, 23, 42, 0.04)",
        }}
      >
        <p
          style={{
            margin: "0 0 8px 0",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#475569",
          }}
        >
          Panel Header
        </p>

        <h2
          style={{
            margin: 0,
            fontSize: "22px",
            lineHeight: 1.2,
            fontWeight: 800,
            letterSpacing: "-0.01em",
            color: "#0f172a",
          }}
        >
          {title}
        </h2>
      </div>

      <div
        style={{
          display: "grid",
          gap: "14px",
        }}
      >
        {children}
      </div>
    </section>
  );
}

export default DashboardPanel;