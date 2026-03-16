import MetricSummaryPanel, {
  type MetricSummaryItem,
} from "./MetricSummaryPanel";

type LibraryStateSummaryProps = {
  stableCount: number;
  activeCount: number;
  nextCount: number;
};

function LibraryStateSummary({
  stableCount,
  activeCount,
  nextCount,
}: LibraryStateSummaryProps) {
  const items: MetricSummaryItem[] = [
    {
      label: "stable",
      value: stableCount,
      note: "安定運用中の資産です。",
      tone: "blue",
    },
    {
      label: "active",
      value: activeCount,
      note: "現在主力として使っている資産です。",
      tone: "green",
    },
    {
      label: "next",
      value: nextCount,
      note: "次に育てる候補資産です。",
      tone: "amber",
    },
  ];

  return <MetricSummaryPanel title="Library Summary" items={items} />;
}

export default LibraryStateSummary;