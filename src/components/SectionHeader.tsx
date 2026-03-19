import type { ReactNode } from "react";

type SectionHeaderProps = {
  title: string;
  description: string;
  right?: ReactNode;
};

function SectionHeader({
  title,
  description,
  right,
}: SectionHeaderProps) {
  return (
    <header
      style={{
        display: "grid",
        gap: "14px",
        marginBottom: "20px",
      }}
    >
      <div
        style={{
          padding: "18px 20px",
          borderRadius: "16px",
          border: "1px solid #dbe4f0",
          background:
            "linear-gradient(135deg, #ffffff 0%, #f8fafc 46%, #eef6ff 100%)",
          boxShadow: "0 10px 22px rgba(15, 23, 42, 0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              minWidth: "min(100%, 420px)",
              flex: "1 1 420px",
            }}
          >
            <p
              style={{
                margin: "0 0 10px 0",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#475569",
              }}
            >
              Mission Header
            </p>

            <h1
              style={{
                margin: 0,
                fontSize: "30px",
                lineHeight: 1.15,
                color: "#0f172a",
                fontWeight: 800,
                letterSpacing: "-0.02em",
              }}
            >
              {title}
            </h1>

            <p
              style={{
                margin: "12px 0 0 0",
                fontSize: "15px",
                lineHeight: 1.75,
                color: "#334155",
                fontWeight: 500,
                maxWidth: "760px",
              }}
            >
              {description}
            </p>
          </div>

          {right && (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "flex-end",
                flex: "0 1 auto",
              }}
            >
              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: "12px",
                  background: "#ffffff",
                  border: "1px solid #dbe4f0",
                  boxShadow: "0 4px 10px rgba(15, 23, 42, 0.04)",
                }}
              >
                <p
                  style={{
                    margin: "0 0 6px 0",
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "#64748b",
                  }}
                >
                  Live Status
                </p>
                <div>{right}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default SectionHeader;