import type { StreamEvent } from "../dashboardCards";

export type StreamFilter = "all" | StreamEvent["phase"];
export type StreamSort = "timeline" | "newest" | "planned";

type StreamControlPanelProps = {
  selectedFilter: StreamFilter;
  onSelectFilter: (filter: StreamFilter) => void;
  selectedSort: StreamSort;
  onSelectSort: (sort: StreamSort) => void;
  totalCount: number;
  filteredCount: number;
};

const filterOptions: Array<{ value: StreamFilter; label: string }> = [
  { value: "all", label: "all" },
  { value: "done", label: "done" },
  { value: "current", label: "current" },
  { value: "next", label: "next" },
];

const sortOptions: Array<{ value: StreamSort; label: string }> = [
  { value: "timeline", label: "timeline" },
  { value: "newest", label: "newest" },
  { value: "planned", label: "planned" },
];

function StreamControlPanel({
  selectedFilter,
  onSelectFilter,
  selectedSort,
  onSelectSort,
  totalCount,
  filteredCount,
}: StreamControlPanelProps) {
  return (
    <section
      style={{
        marginTop: "20px",
        padding: "18px",
        borderRadius: "12px",
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
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
        <div>
          <p
            style={{
              margin: "0 0 8px 0",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#6b7280",
            }}
          >
            Stream Controls
          </p>

          <p
            style={{
              margin: 0,
              color: "#4b5563",
              lineHeight: 1.6,
              fontSize: "14px",
            }}
          >
            表示中 {filteredCount} / {totalCount} イベント
          </p>
        </div>
      </div>

      <div style={{ marginTop: "16px" }}>
        <p
          style={{
            margin: "0 0 10px 0",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "#6b7280",
          }}
        >
          Filter
        </p>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          {filterOptions.map((option) => {
            const active = selectedFilter === option.value;

            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={active}
                onClick={() => onSelectFilter(option.value)}
                style={{
                  border: active ? "none" : "1px solid #d1d5db",
                  background: active ? "#111827" : "#f9fafb",
                  color: active ? "#ffffff" : "#111827",
                  borderRadius: "999px",
                  padding: "8px 12px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: "16px" }}>
        <p
          style={{
            margin: "0 0 10px 0",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "#6b7280",
          }}
        >
          Sort
        </p>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          {sortOptions.map((option) => {
            const active = selectedSort === option.value;

            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={active}
                onClick={() => onSelectSort(option.value)}
                style={{
                  border: active ? "none" : "1px solid #d1d5db",
                  background: active ? "#111827" : "#f9fafb",
                  color: active ? "#ffffff" : "#111827",
                  borderRadius: "999px",
                  padding: "8px 12px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default StreamControlPanel;