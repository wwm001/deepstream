import type { LibraryAsset } from "../dashboardCards";

export type LibraryFilter = "all" | LibraryAsset["state"];

type LibraryControlPanelProps = {
  selectedFilter: LibraryFilter;
  onSelectFilter: (filter: LibraryFilter) => void;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  totalCount: number;
  filteredCount: number;
};

const filterOptions: Array<{ value: LibraryFilter; label: string }> = [
  { value: "all", label: "all" },
  { value: "stable", label: "stable" },
  { value: "active", label: "active" },
  { value: "next", label: "next" },
];

function LibraryControlPanel({
  selectedFilter,
  onSelectFilter,
  searchTerm,
  onSearchTermChange,
  totalCount,
  filteredCount,
}: LibraryControlPanelProps) {
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
            Library Controls
          </p>

          <p
            style={{
              margin: 0,
              color: "#4b5563",
              lineHeight: 1.6,
              fontSize: "14px",
            }}
          >
            表示中 {filteredCount} / {totalCount} 資産
          </p>
        </div>
      </div>

      <div style={{ marginTop: "16px" }}>
        <label
          htmlFor="library-search"
          style={{
            display: "block",
            margin: "0 0 10px 0",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "#6b7280",
          }}
        >
          Search
        </label>

        <input
          id="library-search"
          type="text"
          value={searchTerm}
          onChange={(event) => onSearchTermChange(event.target.value)}
          placeholder="部品名・役割・メモで検索"
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
            background: "#f9fafb",
            color: "#111827",
            fontSize: "14px",
            boxSizing: "border-box",
          }}
        />
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
    </section>
  );
}

export default LibraryControlPanel;