import type { DashboardSectionData, StreamEvent } from "./types";

export const streamEvents: StreamEvent[] = [
  {
    title: "UI骨格の初期構築",
    detail:
      "Header / Sidebar / Dashboard / Footer の基本構成を整え、DeepStream の画面ベースを確立しました。",
    phase: "done",
  },
  {
    title: "コンポーネント分割の実施",
    detail:
      "StatusPill、SectionHeader、SidebarNavItem、AppLayout などを分離し、小さな責務単位へ整理しました。",
    phase: "done",
  },
  {
    title: "状態連動UIへ移行",
    detail:
      "Sidebar の active 状態を App 管理へ移し、固定データではなく画面状態として扱う構成に変更しました。",
    phase: "current",
  },
  {
    title: "セクション専用UIの追加",
    detail:
      "設定・ライブラリ・ストリームの各画面に、それぞれ固有の補助パネルを追加する流れに入っています。",
    phase: "current",
  },
  {
    title: "実データ接続への準備",
    detail:
      "次は表示用の仮データを、より実運用に近いデータ構造や操作導線に寄せていく段階です。",
    phase: "next",
  },
];

export const streamSectionData: DashboardSectionData = {
  description: "進行中の更新や作業ログの流れを表示します。",
  statusLabel: "更新フローを追跡中",
  focusLabel: "作業の連続性確認",
  detailItems: [
    {
      label: "Stream Source",
      value: "UI更新、リファクタ、状態管理導入などの進行状況を集約します。",
    },
    {
      label: "Current Motion",
      value: "コンポーネント分割から、セクション連動型の画面へ進化しています。",
    },
    {
      label: "Next Stream Step",
      value: "今後は実データや実操作に近い表示へ寄せていく段階です。",
    },
  ],
  cards: [
    {
      title: "Recent Activity",
      description: "コンポーネント分割と状態管理の整備を進行中です。",
      type: "進行中",
    },
    {
      title: "Sidebar Control",
      description: "ナビゲーション選択が画面状態に連動しています。",
      type: "ステータス",
    },
    {
      title: "Next Update",
      description: "セクションごとの実データ表示をさらに磨きます。",
      type: "次の一手",
    },
    {
      title: "Flow Check",
      description: "表示確認と Git 保存の運用フローは安定しています。",
      type: "試作段階",
    },
  ],
};