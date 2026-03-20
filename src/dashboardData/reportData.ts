import type { DashboardSectionData, ReportRecord } from "./types";

export const reportItems: ReportRecord[] = [
  {
    id: "report-001",
    title: "Morning Stream Health Check",
    source: "DeepStream Internal",
    createdAt: "2026-03-20 05:10",
    summary:
      "配信準備、接続安定性、通知状態を横断確認した朝のサマリー。現在の機体状態を短く把握するためのレポートです。",
    body: `Overview
今朝のセッションでは、配信準備フロー・通知・保存状態に大きな異常は見られませんでした。ワークスペースの基本導線は安定しています。

Observations
ストリーム系のイベント管理は current / next / done の見通しがよく、運用上の引っかかりは減っています。
ライブラリ系は quick add と inline edit が入り、更新速度が上がっています。
最近の改善で destructive action safeguards も入り、誤操作のリスクが下がりました。

Next Focus
次段では、完成済みレポートを一覧から選んで本文を読む動線を強化し、読み上げ機能へ自然に接続できる土台を作ります。`,
    status: "new",
  },
  {
    id: "report-002",
    title: "Library Workflow Review",
    source: "Operator Notes",
    createdAt: "2026-03-19 22:40",
    summary:
      "ライブラリの検索・ソート・編集体験を振り返ったレビュー。運用観点からどこが快適で、どこを次に磨くべきかを整理しています。",
    body: `Overview
ライブラリの現在地は、一覧性と編集速度の両立がかなり進んだ段階です。quick add と inline edit が接続されたことで、思考停止なく内容更新できるようになりました。

Strong Points
検索語を入れて絞り込み、その場で修正し、必要なら remove まで一続きで行えます。
reset / remove に確認を入れたことで、軽操作と破壊操作の境界線も整理されました。

Next Focus
次は、コンテンツ資産そのものを読む体験を強化するため、Reports セクションを独立させて本文の読み込み基盤を整えます。`,
    status: "reading",
  },
  {
    id: "report-003",
    title: "Session Architecture Memo",
    source: "System Recorder",
    createdAt: "2026-03-18 18:25",
    summary:
      "Dashboard まわりの構成整理メモ。どこが状態を持ち、どこが描画責務を担っているかを簡潔に確認するための記録です。",
    body: `Overview
Dashboard は section・summary・detail・extra content・cards の親ルータとして機能しています。実データの編集や絞り込みは各セクション用 UI に落とし込まれています。

Architecture Notes
DashboardExtraContent はセクション別の描画分岐を受け持ちます。
Home / Stream / Library / Settings はこのルータ経由で差し込まれています。
したがって Reports を足す場合も、この導線に沿うのが最も自然です。

Next Focus
今回は Reports を加え、一覧と本文の2ペイン表示だけを完成させます。音声読み上げは、その次の段で play / pause / speed を設計します。`,
    status: "archived",
  },
];

export const reportSectionData: DashboardSectionData = {
  description: "完成済みレポートを選択し、本文を読み込むための読書区画です。",
  statusLabel: "本文読み込み準備完了",
  focusLabel: "一覧選択 / 本文表示 / 読み上げ前段",
  detailItems: [
    {
      label: "Main Objective",
      value: "完成済みレポートを一覧から選び、本文を安定表示すること。",
    },
    {
      label: "Current Capability",
      value: "一覧・サマリー・本文表示・ステータス切替。",
    },
    {
      label: "Next Phase",
      value: "読み上げボタン、再生速度、段落ハイライトの追加。",
    },
  ],
  cards: [
    {
      title: "Reader Surface",
      description: "選択中レポートの本文を表示する読書面です。",
      type: "進行中",
    },
    {
      title: "Selection Memory",
      description: "最後に選んだレポートを保持するための土台です。",
      type: "ステータス",
    },
    {
      title: "TTS Ready",
      description: "次段の読み上げ機能に接続しやすい構造です。",
      type: "次の一手",
    },
    {
      title: "MVP Stable",
      description: "まずは一覧→選択→本文表示を成立させます。",
      type: "試作段階",
    },
  ],
};