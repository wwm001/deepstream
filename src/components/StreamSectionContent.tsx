import StreamEventForm from "./StreamEventForm";
import StreamEventTimeline from "./StreamEventTimeline";
import StreamControlPanel, {
  type StreamFilter,
  type StreamSort,
} from "./StreamControlPanel";
import StreamPhaseSummary from "./StreamPhaseSummary";
import DashboardCardGrid from "./DashboardCardGrid";
import DashboardSectionStack from "./DashboardSectionStack";
import { dashboardSections, type StreamEvent } from "../data/dashboard";

type StreamSectionContentProps = {
  streamFilter: StreamFilter;
  onStreamFilterChange: (filter: StreamFilter) => void;
  streamSort: StreamSort;
  onStreamSortChange: (sort: StreamSort) => void;
  filteredStreamEvents: StreamEvent[];
  totalStreamEvents: number;
  phaseCounts: {
    doneCount: number;
    currentCount: number;
    nextCount: number;
  };
  onAddStreamEvent: (input: {
    title: string;
    detail: string;
    phase: StreamEvent["phase"];
  }) => void;
  onRemoveStreamEvent: (eventId: string) => void;
};

function StreamSectionContent({
  streamFilter,
  onStreamFilterChange,
  streamSort,
  onStreamSortChange,
  filteredStreamEvents,
  totalStreamEvents,
  phaseCounts,
  onAddStreamEvent,
  onRemoveStreamEvent,
}: StreamSectionContentProps) {
  const section = dashboardSections["ストリーム"];

  return (
    <DashboardSectionStack>
      <StreamPhaseSummary
        doneCount={phaseCounts.doneCount}
        currentCount={phaseCounts.currentCount}
        nextCount={phaseCounts.nextCount}
      />

      <StreamEventForm onAddEvent={onAddStreamEvent} />

      <StreamControlPanel
        selectedFilter={streamFilter}
        onSelectFilter={onStreamFilterChange}
        selectedSort={streamSort}
        onSelectSort={onStreamSortChange}
        totalCount={totalStreamEvents}
        filteredCount={filteredStreamEvents.length}
      />

      <StreamEventTimeline
        items={filteredStreamEvents}
        onRemoveEvent={onRemoveStreamEvent}
      />

      <DashboardCardGrid cards={section.cards} />
    </DashboardSectionStack>
  );
}

export default StreamSectionContent;