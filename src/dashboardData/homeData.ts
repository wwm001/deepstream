import type { DashboardSectionData, HomeSignal } from "./types";

export const homeSignals: HomeSignal[] = [
  {
    label: "Active Section Count",
    value: "4",
    note: "ホーム / ストリーム / ライブラリ / 設定の4系統が切替可能です。",
    tone: "primary",
  },
  {
    label: "Git State",
    value: "Synced",
    note: "main ブランチ基準でローカルと GitHub の同期が取れている状態です。",
    tone: "success",
  },
  {
    label: "Current Focus",
    value: "UI Refinement",
    note: "静的モックから、各画面に固有の役割を持つ試作UIへ進化しています。",
    tone: "warning",
  },
  {
    label: "Operation Mode",
    value: "Small Commits",
    note: "表示確認後すぐ保存する運用が定着し、差分管理が安定しています。",
    tone: "neutral",
  },
];

export const homeSectionData: DashboardSectionData = {
  description: "DeepStream 全体の現在地と重要ポイントを表示します。",
  statusLabel: "全体状況を監視中",
  focusLabel: "主要状態の可視化",
  detailItems: [
    {
      label: "Main Objective",
      value: "画面全体の状態と次の作業ポイントを一目で把握すること。",
    },
    {
      label: "Current Phase",
      value: "UI骨格の整備を終え、情報設計を実用寄りに調整する段階です。",
    },
    {
      label: "Operator Note",
      value:
        "最小単位で改修し、表示確認後に即 commit / push する運用が安定しています。",
    },
  ],
  cards: [
    {
      title: "Now Status",
      description: "DeepStream は起動中です。",
      type: "ステータス",
    },
    {
      title: "Mission Focus",
      description: "画面構成を実用レベルへ近づける段階です。",
      type: "次の一手",
    },
    {
      title: "Build State",
      description: "状態管理を導入し、静的モックを卒業しました。",
      type: "進行中",
    },
    {
      title: "Prototype Readiness",
      description: "UI確認と小分け保存を継続できる状態です。",
      type: "試作段階",
    },
  ],
};