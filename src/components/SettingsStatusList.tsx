import type { SettingCheck } from "../data/dashboard";

type SettingsStatusListProps = {
  items: SettingCheck[];
  showNotes: boolean;
};

const stateStyles: Record<
  SettingCheck["state"],
  { color: string; background: string }
> = {
  ok: {
    color: "#047857",
    background: "#d1fae5",
  },
  watch: {
    color: "#b45309",
    background: "#fef3c7",
  },
  next: {
    color: "#1d4ed8",
    background: "#dbeafe",
  },
};

function SettingsStatusList({ items, showNotes }: SettingsStatusListProps) {
  return (
    <section
      style={{
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
        Environment Checks
      </p>

      <div
        style={{
          display: "grid",
          gap: "12px",
        }}
      >
        {items.length === 0 && (
          <article
            style={{
              padding: "14px 16px",
              borderRadius: "10px",
              background: "#f9fafb",
              border: "1px solid #f3f4f6",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                lineHeight: 1.6,
                color: "#4b5563",
              }}
            >
              該当するチェック項目はありません。
            </p>
          </article>
        )}

        {items.map((item) => {
          const stateStyle = stateStyles[item.state];

          return (
            <article
              key={item.label}
              style={{
                padding: "14px 16px",
                borderRadius: "10px",
                background: "#f9fafb",
                border: "1px solid #f3f4f6",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <p
                    style={{
                      margin: "0 0 6px 0",
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "#6b7280",
                    }}
                  >
                    {item.label}
                  </p>

                  <p
                    style={{
                      margin: 0,
                      fontSize: "15px",
                      fontWeight: 600,
                      color: "#111827",
                    }}
                  >
                    {item.value}
                  </p>
                </div>

                <span
                  style={{
                    display: "inline-block",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: stateStyle.color,
                    background: stateStyle.background,
                    padding: "4px 8px",
                    borderRadius: "999px",
                  }}
                >
                  {item.state}
                </span>
              </div>

              {showNotes && (
                <p
                  style={{
                    margin: "10px 0 0 0",
                    color: "#4b5563",
                    lineHeight: 1.6,
                    fontSize: "14px",
                  }}
                >
                  {item.note}
                </p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default SettingsStatusList;