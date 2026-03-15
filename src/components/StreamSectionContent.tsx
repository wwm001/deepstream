import { useMemo } from "react";
import StreamEventTimeline from "./StreamEventTimeline";
import StreamControlPanel, {
  type StreamFilter,
  type StreamSort,
} from "./StreamControlPanel";
import StreamPhaseSummary from "./StreamPhaseSummary";
import DashboardCardGrid from "./DashboardCardGrid";
import DashboardSectionStack from "./DashboardSectionStack";
import {
  dashboardSections,
  streamEvents,
  type StreamEvent,
} from "../data/dashboard";

type StreamSectionContentProps = {
  streamFilter: StreamFilter;
  onStreamFilterChange: (filter: StreamFilter) => void;
  streamSort: StreamSort;
  onStreamSortChange: (sort: StreamSort) => void;
  filteredStreamEvents: StreamEvent[];
};

function StreamSectionContent({
  streamFilter,
  onStreamFilterChange,
  streamSort,
  onStreamSortChange,
  filteredStreamEvents,
}: StreamSectionContentProps) {
  const section = dashboardSections["ストリーム"];

  const summaryCounts = useMemo(
    () => ({
      doneCount: streamEvents.filter((item) => item.phase === "done").length,
      currentCount: streamEvents.filter((item) => item.phase === "current").length,
      nextCount: streamEvents.filter((item) => item.phase === "next").length,
    }),
    []
  );

  return (
    <DashboardSectionStack>
      <StreamPhaseSummary
        doneCount={summaryCounts.doneCount}
        currentCount={summaryCounts.currentCount}
        nextCount={summaryCounts.nextCount}
      />

      <StreamControlPanel
        selectedFilter={streamFilter}
        onSelectFilter={onStreamFilterChange}
        selectedSort={streamSort}
        onSelectSort={onStreamSortChange}
        totalCount={streamEvents.length}
        filteredCount={filteredStreamEvents.length}
      />

      <StreamEventTimeline items={filteredStreamEvents} />

      <DashboardCardGrid cards={section.cards} />
    </DashboardSectionStack>
  );
}

export default StreamSectionContent;