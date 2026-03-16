import MetricSummaryPanel, {
  type MetricSummaryItem,
} from "./MetricSummaryPanel";

type SettingsStateSummaryProps = {
  okCount: number;
  watchCount: number;
  nextCount: number;
};

function SettingsStateSummary({
  okCount,
  watchCount,
  nextCount,
}: SettingsStateSummaryProps) {
  const items: MetricSummaryItem[] = [
    {
      label: "ok",
      value: okCount,
      note: "安定している確認項目です。",
      tone: "green",
    },
    {
      label: "watch",
      value: watchCount,
      note: "監視を継続したい確認項目です。",
      tone: "amber",
    },
    {
      label: "next",
      value: nextCount,
      note: "次に手を入れる候補項目です。",
      tone: "blue",
    },
  ];

  return <MetricSummaryPanel title="Settings Summary" items={items} />;
}

export default SettingsStateSummary;