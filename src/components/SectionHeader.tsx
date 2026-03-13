import type { ReactNode } from "react";

type SectionHeaderProps = {
  title: string;
  description: string;
  right?: ReactNode;
};

function SectionHeader({ title, description, right }: SectionHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        gap: "16px",
        flexWrap: "wrap",
      }}
    >
      <div>
        <h2 style={{ marginTop: 0, marginBottom: "8px" }}>{title}</h2>
        <p
          style={{
            margin: 0,
            color: "#4b5563",
            lineHeight: 1.6,
          }}
        >
          {description}
        </p>
      </div>

      {right}
    </div>
  );
}

export default SectionHeader;