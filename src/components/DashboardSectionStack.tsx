import type { ReactNode } from "react";

type DashboardSectionStackProps = {
  children: ReactNode;
};

function DashboardSectionStack({ children }: DashboardSectionStackProps) {
  return (
    <div
      style={{
        display: "grid",
        gap: "20px",
        marginTop: "20px",
      }}
    >
      {children}
    </div>
  );
}

export default DashboardSectionStack;