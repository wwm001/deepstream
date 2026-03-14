import type { SettingCheck } from "../dashboardCards";

export type SettingsFilter = "all" | SettingCheck["state"];

type SettingsControlPanelProps = {
  selectedFilter: SettingsFilter;
  onSelectFilter: (filter: SettingsFilter) => void;
  showNotes: boolean;
  onToggleNotes: () => void;
  totalCount: number;
  filteredCount: number;
};

const filters: Array<{ value: SettingsFilter; label: string }> = [
  { value: "all", label: "all" },
  { value: "ok", label: "ok" },
  { value: "watch", label: "watch" },
  { value: "next", label: "next" },
];

function SettingsControlPanel({
  selectedFilter,
  onSelectFilter,
  showNotes,
  onToggleNotes,
  totalCount,
  filteredCount,
}: SettingsControlPanelProps) {
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
            Settings Controls
          </p>

          <p
            style={{
              margin: 0,
              color: "#4b5563",
              lineHeight: 1.6,
              fontSize: "14px",
            }}
          >
            表示中 {filteredCount} / {totalCount} 項目
          </p>
        </div>

        <button
          type="button"
          onClick={onToggleNotes}
          style={{
            border: "1px solid #d1d5db",
            background: showNotes ? "#111827" : "#ffffff",
            color: showNotes ? "#ffffff" : "#111827",
            borderRadius: "999px",
            padding: "8px 12px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Notes: {showNotes ? "on" : "off"}
        </button>
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginTop: "16px",
        }}
      >
        {filters.map((filter) => {
          const active = selectedFilter === filter.value;

          return (
            <button
              key={filter.value}
              type="button"
              aria-pressed={active}
              onClick={() => onSelectFilter(filter.value)}
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
              {filter.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default SettingsControlPanel;