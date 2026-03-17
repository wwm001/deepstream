import type { DashboardSectionData, SettingCheck } from "./types";

export const settingsChecks: SettingCheck[] = [
  {
    label: "Dev Server",
    value: "Vite によるローカル確認フローを継続中",
    state: "ok",
    note: "画面確認のサイクルは安定しています。ポート切替が起きても動作自体は正常です。",
  },
  {
    label: "Git Sync",
    value: "main ブランチは GitHub と同期済み",
    state: "ok",
    note: "小さく変更して即 push する運用が定着しており、差分を長く抱え込んでいません。",
  },
  {
    label: "UI Direction",
    value: "静的モックから状態連動UIへ移行済み",
    state: "watch",
    note: "今後は見た目だけでなく、実データや実操作に寄せる段階に入ります。",
  },
  {
    label: "Next Expansion",
    value: "セクション別の専用表示を追加中",
    state: "next",
    note: "設定以外の画面にも、そのセクション専用の表示ブロックを増やしていく余地があります。",
  },
];

export const settingsSectionData: DashboardSectionData = {
  description: "環境情報や状態確認用の項目を表示します。",
  statusLabel: "開発環境を監視中",
  focusLabel: "同期状態の安定維持",
  detailItems: [
    {
      label: "Runtime",
      value: "Vite 開発サーバーを使い、ローカルで表示確認を継続しています。",
    },
    {
      label: "Git State",
      value: "main ブランチを基準に、ローカルと GitHub の同期状態を維持しています。",
    },
    {
      label: "Operational Rule",
      value: "表示確認後に即保存し、作業途中を長く抱えない運用を定着させています。",
    },
  ],
  cards: [
    {
      title: "Environment Check",
      description: "Vite 開発サーバーでローカル確認を継続しています。",
      type: "ステータス",
    },
    {
      title: "Git Sync",
      description: "main ブランチは GitHub と同期された状態です。",
      type: "進行中",
    },
    {
      title: "Next Config",
      description: "表示内容の実データ化と操作導線の強化を進めます。",
      type: "次の一手",
    },
    {
      title: "Prototype Ops",
      description: "ローカル確認 → commit → push の運用が定着しています。",
      type: "試作段階",
    },
  ],
};