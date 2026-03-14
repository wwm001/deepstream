import type { DashboardSnapshotItem, HomeFocusItem } from "./types";
import { libraryAssets } from "./libraryData";
import { streamEvents } from "./streamData";
import { settingsChecks } from "./settingsData";

export const homeFocusItems: HomeFocusItem[] = [
  {
    label: "Current Mode",
    title: "Prototype Flight",
    detail:
      "DeepStream は、静的モックから状態連動型の試作機へ移行し、画面ごとの性格が見え始めています。",
    state: "now",
  },
  {
    label: "Stable Routine",
    title: "Small Save Cycle",
    detail:
      "表示確認後にすぐ commit / push する運用が定着し、差分を長く抱えない安定した開発サイクルになっています。",
    state: "ready",
  },
  {
    label: "Visible Progress",
    title: "Section-Specific UI",
    detail:
      "ホーム、ストリーム、ライブラリ、設定の全4画面が固有UIを持つ状態になりました。",
    state: "ready",
  },
  {
    label: "Next Orbit",
    title: "Toward Real Data",
    detail:
      "次段階では、仮置きの文言中心UIから、実データ構造や操作導線に近い形へ寄せていきます。",
    state: "next",
  },
];

export const homeSystemSnapshotItems: DashboardSnapshotItem[] = [
  {
    label: "Sections",
    value: "4",
    note: "ホーム / ストリーム / ライブラリ / 設定 の4画面を搭載しています。",
    tone: "indigo",
  },
  {
    label: "Cards",
    value: "16",
    note: "全セクションを合計した表示カード数です。",
    tone: "green",
  },
  {
    label: "Assets",
    value: String(libraryAssets.length),
    note: "ライブラリで管理している再利用資産の数です。",
    tone: "gray",
  },
  {
    label: "Events",
    value: String(streamEvents.length),
    note: "ストリーム画面で追跡している更新イベント数です。",
    tone: "amber",
  },
  {
    label: "Checks",
    value: String(settingsChecks.length),
    note: "設定画面で監視している確認項目です。",
    tone: "gray",
  },
];