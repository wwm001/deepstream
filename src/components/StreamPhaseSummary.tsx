import MetricSummaryPanel, {
  type MetricSummaryItem,
} from "./MetricSummaryPanel";

type StreamPhaseSummaryProps = {
  doneCount: number;
  currentCount: number;
  nextCount: number;
};

function StreamPhaseSummary({
  doneCount,
  currentCount,
  nextCount,
}: StreamPhaseSummaryProps) {
  const items: MetricSummaryItem[] = [
    {
      label: "done",
      value: doneCount,
      note: "完了済みのイベントです。",
      tone: "green",
    },
    {
      label: "current",
      value: currentCount,
      note: "現在進行中のイベントです。",
      tone: "blue",
    },
    {
      label: "next",
      value: nextCount,
      note: "次に控えているイベントです。",
      tone: "amber",
    },
  ];

  return <MetricSummaryPanel title="Stream Summary" items={items} />;
}

export default StreamPhaseSummary;