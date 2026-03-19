import { appMeta } from "../appMeta";
import StatusPill from "./StatusPill";

function Header() {
  return (
    <header
      style={{
        display: "grid",
        gap: "14px",
        marginBottom: "4px",
      }}
    >
      <div
        style={{
          padding: "20px 22px",
          borderRadius: "18px",
          border: "1px solid #dbe4f0",
          background:
            "linear-gradient(135deg, #ffffff 0%, #f8fafc 46%, #eef6ff 100%)",
          boxShadow: "0 12px 24px rgba(15, 23, 42, 0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "18px",
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
              Command Deck
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                flexWrap: "wrap",
                marginBottom: "12px",
              }}
            >
              <StatusPill label={appMeta.badge} tone="indigo" />
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "34px",
                lineHeight: 1.1,
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: "#0f172a",
              }}
            >
              {appMeta.title}
            </h1>

            <p
              style={{
                margin: "12px 0 0 0",
                color: "#334155",
                lineHeight: 1.75,
                fontSize: "15px",
                fontWeight: 500,
                maxWidth: "760px",
              }}
            >
              {appMeta.subtitle}
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gap: "10px",
              minWidth: "220px",
              flex: "0 1 260px",
            }}
          >
            <div
              style={{
                padding: "12px 14px",
                borderRadius: "14px",
                background: "#ffffff",
                border: "1px solid #dbe4f0",
                boxShadow: "0 4px 10px rgba(15, 23, 42, 0.04)",
              }}
            >
              <p
                style={{
                  margin: "0 0 8px 0",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "#64748b",
                }}
              >
                Live Status
              </p>

              <StatusPill
                label={appMeta.statusText}
                tone="gray"
                uppercase={false}
              />
            </div>

            <div
              style={{
                padding: "12px 14px",
                borderRadius: "14px",
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
                Mission Note
              </p>

              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  lineHeight: 1.65,
                  color: "#334155",
                  fontWeight: 600,
                }}
              >
                DeepStream の現在地を俯瞰しながら、各セクションを安全に更新していくためのトップパネルです。
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;