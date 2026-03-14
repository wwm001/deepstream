import { useMemo, useState } from "react";
import StreamCard from "./StreamCard";
import StreamEventTimeline from "./StreamEventTimeline";
import StreamControlPanel, {
  type StreamFilter,
  type StreamSort,
} from "./StreamControlPanel";
import { dashboardSections, streamEvents } from "../dashboardCards";

function StreamSectionContent() {
  const section = dashboardSections["ストリーム"];
  const [streamFilter, setStreamFilter] = useState<StreamFilter>("all");
  const [streamSort, setStreamSort] = useState<StreamSort>("timeline");

  const filteredStreamEvents = useMemo(() => {
    const baseEvents =
      streamFilter === "all"
        ? streamEvents
        : streamEvents.filter((item) => item.phase === streamFilter);

    if (streamSort === "timeline") {
      return baseEvents;
    }

    if (streamSort === "newest") {
      return [...baseEvents].reverse();
    }

    const phaseOrder = {
      next: 0,
      current: 1,
      done: 2,
    } as const;

    return [...baseEvents].sort(
      (a, b) => phaseOrder[a.phase] - phaseOrder[b.phase]
    );
  }, [streamFilter, streamSort]);

  return (
    <>
      <StreamControlPanel
        selectedFilter={streamFilter}
        onSelectFilter={setStreamFilter}
        selectedSort={streamSort}
        onSelectSort={setStreamSort}
        totalCount={streamEvents.length}
        filteredCount={filteredStreamEvents.length}
      />

      <StreamEventTimeline items={filteredStreamEvents} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginTop: "24px",
        }}
      >
        {section.cards.map((card) => (
          <StreamCard
            key={card.title}
            title={card.title}
            description={card.description}
            type={card.type}
          />
        ))}
      </div>
    </>
  );
}

export default StreamSectionContent;