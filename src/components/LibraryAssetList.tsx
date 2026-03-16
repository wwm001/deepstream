import type { LibraryAsset } from "../data/dashboard";

type LibraryAssetListProps = {
  items: LibraryAsset[];
  onRemoveAsset: (assetId: string) => void;
};

const stateStyles: Record<
  LibraryAsset["state"],
  { color: string; background: string }
> = {
  stable: {
    color: "#1d4ed8",
    background: "#dbeafe",
  },
  active: {
    color: "#047857",
    background: "#d1fae5",
  },
  next: {
    color: "#b45309",
    background: "#fef3c7",
  },
};

function LibraryAssetList({
  items,
  onRemoveAsset,
}: LibraryAssetListProps) {
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
        Component Assets
      </p>

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
            該当する資産はありません。
          </p>
        </article>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "12px",
        }}
      >
        {items.map((item) => {
          const stateStyle = stateStyles[item.state];

          return (
            <article
              key={item.id}
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
                <h3
                  style={{
                    margin: 0,
                    fontSize: "16px",
                    color: "#111827",
                  }}
                >
                  {item.name}
                </h3>

                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
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

                  <button
                    type="button"
                    onClick={() => onRemoveAsset(item.id)}
                    style={{
                      border: "1px solid #d1d5db",
                      background: "#ffffff",
                      color: "#111827",
                      borderRadius: "999px",
                      padding: "4px 8px",
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                    }}
                  >
                    delete
                  </button>
                </div>
              </div>

              <p
                style={{
                  margin: "10px 0 0 0",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#111827",
                }}
              >
                {item.role}
              </p>

              <p
                style={{
                  margin: "8px 0 0 0",
                  color: "#4b5563",
                  lineHeight: 1.6,
                  fontSize: "14px",
                }}
              >
                {item.note}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default LibraryAssetList;