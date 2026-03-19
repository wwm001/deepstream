import type { ReactNode } from "react";

type PageCardProps = {
  children: ReactNode;
};

function PageCard({ children }: PageCardProps) {
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "20px",
        border: "1px solid #dbe4f0",
        background:
          "linear-gradient(135deg, #ffffff 0%, #fbfdff 52%, #f3f8ff 100%)",
        boxShadow:
          "0 18px 36px rgba(15, 23, 42, 0.05), 0 4px 10px rgba(15, 23, 42, 0.03)",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "0 auto auto 0",
          width: "100%",
          height: "1px",
          background:
            "linear-gradient(90deg, rgba(59,130,246,0.0) 0%, rgba(59,130,246,0.28) 35%, rgba(59,130,246,0.0) 100%)",
        }}
      />

      <div
        style={{
          position: "relative",
          padding: "20px",
        }}
      >
        {children}
      </div>
    </section>
  );
}

export default PageCard;