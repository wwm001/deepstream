import { useMemo } from "react";
import type { ReportRecord, ReportStatus } from "../dashboardData/types";
import DashboardPanel from "./DashboardPanel";
import DashboardBadge from "./DashboardBadge";
import DashboardActionButton from "./DashboardActionButton";

type ReportsPanelProps = {
  items: ReportRecord[];
  selectedReportId: string | null;
  onSelectReport: (reportId: string) => void;
  onCycleReportStatus: (reportId: string) => void;
};

const statusStyles: Record<
  ReportStatus,
  { color: string; background: string; label: string }
> = {
  new: {
    color: "#1d4ed8",
    background: "#dbeafe",
    label: "new",
  },
  reading: {
    color: "#047857",
    background: "#d1fae5",
    label: "reading",
  },
  archived: {
    color: "#6b7280",
    background: "#e5e7eb",
    label: "archived",
  },
};

function ReportsPanel({
  items,
  selectedReportId,
  onSelectReport,
  onCycleReportStatus,
}: ReportsPanelProps) {
  const selectedReport = useMemo(() => {
    if (!selectedReportId) {
      return items[0] ?? null;
    }

    return items.find((item) => item.id === selectedReportId) ?? items[0] ?? null;
  }, [items, selectedReportId]);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(280px, 360px) minmax(0, 1fr)",
        gap: "16px",
      }}
    >
      <DashboardPanel title="Reports Queue">
        <div
          style={{
            display: "grid",
            gap: "12px",
          }}
        >
          {items.map((item) => {
            const isSelected = item.id === selectedReport?.id;
            const statusStyle = statusStyles[item.status];

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectReport(item.id)}
                style={{
                  textAlign: "left",
                  border: isSelected ? "1px solid #0891b2" : "1px solid #e5e7eb",
                  background: isSelected ? "#ecfeff" : "#ffffff",
                  borderRadius: "12px",
                  padding: "14px",
                  cursor: "pointer",
                  display: "grid",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    gap: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ display: "grid", gap: "6px" }}>
                    <strong
                      style={{
                        fontSize: "14px",
                        color: "#111827",
                        lineHeight: 1.5,
                      }}
                    >
                      {item.title}
                    </strong>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#6b7280",
                      }}
                    >
                      {item.source} ・ {item.createdAt}
                    </span>
                  </div>

                  <DashboardBadge
                    label={statusStyle.label}
                    color={statusStyle.color}
                    background={statusStyle.background}
                  />
                </div>

                <p
                  style={{
                    margin: 0,
                    fontSize: "13px",
                    lineHeight: 1.7,
                    color: "#4b5563",
                  }}
                >
                  {item.summary}
                </p>
              </button>
            );
          })}
        </div>
      </DashboardPanel>

      <DashboardPanel title="Report Reader">
        {selectedReport ? (
          <div
            style={{
              display: "grid",
              gap: "14px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "grid", gap: "6px" }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "18px",
                    color: "#111827",
                  }}
                >
                  {selectedReport.title}
                </h3>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    lineHeight: 1.6,
                  }}
                >
                  {selectedReport.source} ・ {selectedReport.createdAt}
                </div>
              </div>

              <DashboardActionButton
                label={`status: ${selectedReport.status}`}
                onClick={() => onCycleReportStatus(selectedReport.id)}
              />
            </div>

            <div
              style={{
                padding: "12px 14px",
                borderRadius: "12px",
                background: "#f9fafb",
                border: "1px solid #e5e7eb",
                fontSize: "13px",
                lineHeight: 1.7,
                color: "#4b5563",
              }}
            >
              {selectedReport.summary}
            </div>

            <article
              style={{
                whiteSpace: "pre-wrap",
                fontSize: "14px",
                lineHeight: 1.9,
                color: "#111827",
              }}
            >
              {selectedReport.body}
            </article>
          </div>
        ) : (
          <div
            style={{
              color: "#6b7280",
              fontSize: "14px",
              lineHeight: 1.8,
            }}
          >
            表示できるレポートがありません。
          </div>
        )}
      </DashboardPanel>
    </div>
  );
}

export default ReportsPanel;