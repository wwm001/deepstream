import { appMeta } from "../appMeta";
import StatusPill from "./StatusPill";

function Footer() {
  return (
    <footer
      style={{
        display: "grid",
        gap: "14px",
        marginTop: "28px",
      }}
    >
      <div
        style={{
          padding: "18px 20px",
          borderRadius: "16px",
          border: "1px solid #dbe4f0",
          background:
            "linear-gradient(135deg, #ffffff 0%, #f8fafc 48%, #eef6ff 100%)",
          boxShadow: "0 10px 22px rgba(15, 23, 42, 0.04)",
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
              minWidth: "min(100%, 380px)",
              flex: "1 1 380px",
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
              Mission Footer
            </p>

            <p
              style={{
                margin: 0,
                fontSize: "15px",
                lineHeight: 1.75,
                color: "#0f172a",
                fontWeight: 600,
              }}
            >
              {appMeta.footerText}
            </p>

            <p
              style={{
                margin: "10px 0 0 0",
                fontSize: "13px",
                lineHeight: 1.7,
                color: "#64748b",
                fontWeight: 500,
              }}
            >
              現在のビルド状態と運用メモを静かに表示する終端パネルです。
            </p>
          </div>

          <div
            style={{
              minWidth: "220px",
              flex: "0 1 260px",
              display: "grid",
              gap: "10px",
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
                Footer Status
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
                Exit Note
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
                小さく安全に更新し、確認後に commit / push する現在の運用に適した終端表示です。
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;