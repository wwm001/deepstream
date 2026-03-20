import { useMemo, useState } from "react";
import DashboardPanel from "./DashboardPanel";

export type HomeActivityCategory =
  | "system"
  | "settings"
  | "library"
  | "stream";

export type HomeActivityItem = {
  id: string;
  title: string;
  detail: string;
  timeLabel: string;
  tone: "neutral" | "success" | "warning";
  category: HomeActivityCategory;
};

type HomeActivityFeedProps = {
  items: HomeActivityItem[];
  onClearActivity: () => void;
};

type ActivityFilter = "all" | HomeActivityCategory;

const toneStyles: Record<
  HomeActivityItem["tone"],
  {
    color: string;
    background: string;
    border: string;
    accent: string;
  }
> = {
  neutral: {
    color: "#475569",
    background: "#f8fafc",
    border: "#e2e8f0",
    accent: "#94a3b8",
  },
  success: {
    color: "#047857",
    background: "#ecfdf5",
    border: "#a7f3d0",
    accent: "#10b981",
  },
  warning: {
    color: "#b45309",
    background: "#fffbeb",
    border: "#fde68a",
    accent: "#f59e0b",
  },
};

const categoryLabels: Record<ActivityFilter, string> = {
  all: "all",
  system: "system",
  settings: "settings",
  library: "library",
  stream: "stream",
};

function HomeActivityFeed({
  items,
  onClearActivity,
}: HomeActivityFeedProps) {
  const [selectedFilter, setSelectedFilter] = useState<ActivityFilter>("all");

  const counts = useMemo(
    () => ({
      all: items.length,
      system: items.filter((item) => item.category === "system").length,
      settings: items.filter((item) => item.category === "settings").length,
      library: items.filter((item) => item.category === "library").length,
      stream: items.filter((item) => item.category === "stream").length,
    }),
    [items]
  );

  const filteredItems = useMemo(() => {
    if (selectedFilter === "all") {
      return items;
    }

    return items.filter((item) => item.category === selectedFilter);
  }, [items, selectedFilter]);

  const handleConfirmClear = () => {
    if (items.length === 0) {
      return;
    }

    const accepted = window.confirm(
      "Recent Activity をすべてクリアします。続行しますか？"
    );

    if (!accepted) {
      return;
    }

    onClearActivity();
    setSelectedFilter("all");
  };

  return (
    <DashboardPanel title="Recent Activity">
      <section
        style={{
          padding: "16px 18px",
          borderRadius: "14px",
          border: "1px solid #dbe4f0",
          background:
            "linear-gradient(135deg, #ffffff 0%, #f8fafc 48%, #eef6ff 100%)",
          boxShadow: "0 8px 18px rgba(15, 23, 42, 0.04)",
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
                margin: "0 0 8px 0",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#475569",
              }}
            >
              Activity Console
            </p>

            <p
              style={{
                margin: 0,
                fontSize: "15px",
                lineHeight: 1.7,
                color: "#0f172a",
                fontWeight: 600,
              }}
            >
              直近の操作ログをカテゴリ別に確認できます。
            </p>
          </div>

          <button
            type="button"
            onClick={handleConfirmClear}
            disabled={items.length === 0}
            style={{
              border: "1px solid #e5e7eb",
              background: items.length === 0 ? "#f8fafc" : "#ffffff",
              color: items.length === 0 ? "#9ca3af" : "#6b7280",
              borderRadius: "999px",
              padding: "8px 12px",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              cursor: items.length === 0 ? "not-allowed" : "pointer",
              boxShadow:
                items.length === 0
                  ? "none"
                  : "0 4px 10px rgba(15, 23, 42, 0.04)",
            }}
          >
            clear log
          </button>
        </div>
      </section>

      <div
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
        }}
      >
        {(Object.keys(categoryLabels) as ActivityFilter[]).map((filter) => {
          const isActive = selectedFilter === filter;

          return (
            <button
              key={filter}
              type="button"
              onClick={() => setSelectedFilter(filter)}
              style={{
                border: `1px solid ${isActive ? "#bfdbfe" : "#e5e7eb"}`,
                background: isActive ? "#eff6ff" : "#ffffff",
                color: isActive ? "#1d4ed8" : "#6b7280",
                borderRadius: "999px",
                padding: "8px 12px",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                cursor: "pointer",
                boxShadow: isActive
                  ? "0 4px 10px rgba(37, 99, 235, 0.08)"
                  : "0 2px 6px rgba(15, 23, 42, 0.03)",
              }}
            >
              {categoryLabels[filter]} ({counts[filter]})
            </button>
          );
        })}
      </div>

      {filteredItems.length === 0 ? (
        <article
          style={{
            padding: "16px 18px",
            borderRadius: "14px",
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 10px rgba(15, 23, 42, 0.03)",
          }}
        >
          <p
            style={{
              margin: "0 0 6px 0",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#64748b",
            }}
          >
            Empty Result
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              lineHeight: 1.7,
              color: "#334155",
              fontWeight: 500,
            }}
          >
            現在のカテゴリ条件に一致する操作履歴はありません。
          </p>
        </article>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "12px",
          }}
        >
          {filteredItems.map((item) => {
            const toneStyle = toneStyles[item.tone];

            return (
              <article
                key={item.id}
                style={{
                  position: "relative",
                  overflow: "hidden",
                  padding: "16px 16px 16px 18px",
                  borderRadius: "14px",
                  background: toneStyle.background,
                  border: `1px solid ${toneStyle.border}`,
                  boxShadow: "0 4px 10px rgba(15, 23, 42, 0.03)",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: "0 auto 0 0",
                    width: "6px",
                    background: toneStyle.accent,
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      flexWrap: "wrap",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: "11px",
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: toneStyle.color,
                      }}
                    >
                      {item.title}
                    </p>

                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "3px 8px",
                        borderRadius: "999px",
                        background: "#ffffff",
                        border: `1px solid ${toneStyle.border}`,
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                        color: toneStyle.color,
                      }}
                    >
                      {item.category}
                    </span>
                  </div>

                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: "62px",
                      padding: "4px 8px",
                      borderRadius: "999px",
                      background: "#ffffff",
                      border: `1px solid ${toneStyle.border}`,
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                      color: toneStyle.color,
                    }}
                  >
                    {item.timeLabel}
                  </span>
                </div>

                <p
                  style={{
                    margin: "10px 0 0 0",
                    fontSize: "14px",
                    lineHeight: 1.7,
                    color: "#334155",
                    fontWeight: 500,
                  }}
                >
                  {item.detail}
                </p>
              </article>
            );
          })}
        </div>
      )}
    </DashboardPanel>
  );
}

export default HomeActivityFeed;