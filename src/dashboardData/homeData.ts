import type {
  DashboardSectionData,
  HomeSignal,
  HomeSectionSnapshot,
} from "./types";
import { streamEvents, streamSectionData } from "./streamData";
import { libraryAssets, librarySectionData } from "./libraryData";
import { settingsChecks, settingsSectionData } from "./settingsData";

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

export const homeSectionSnapshots: HomeSectionSnapshot[] = [
  {
    section: "ホーム",
    status: homeSectionData.statusLabel,
    focus: homeSectionData.focusLabel,
    cardCount: homeSectionData.cards.length,
    note: "DeepStream 全体の現在地と主要信号を俯瞰するトップ画面です。",
  },
  {
    section: "ストリーム",
    status: streamSectionData.statusLabel,
    focus: streamSectionData.focusLabel,
    cardCount: streamSectionData.cards.length,
    note: "更新履歴と進行フローを追跡する時系列寄りの画面です。",
  },
  {
    section: "ライブラリ",
    status: librarySectionData.statusLabel,
    focus: librarySectionData.focusLabel,
    cardCount: librarySectionData.cards.length,
    note: "再利用部品や設計資産を棚卸しする整理用の画面です。",
  },
  {
    section: "設定",
    status: settingsSectionData.statusLabel,
    focus: settingsSectionData.focusLabel,
    cardCount: settingsSectionData.cards.length,
    note: "開発環境や運用状態を確認する監視用の画面です。",
  },
];

export const homeSignals: HomeSignal[] = [
  {
    label: "Active Section Count",
    value: String(homeSectionSnapshots.length),
    note: "ホーム / ストリーム / ライブラリ / 設定の4系統が切替可能です。",
    tone: "primary",
  },
  {
    label: "Stream Events",
    value: String(streamEvents.length),
    note: "ストリーム画面には進行イベントの時系列データを載せています。",
    tone: "success",
  },
  {
    label: "Library Assets",
    value: String(libraryAssets.length),
    note: "ライブラリ画面には再利用資産の一覧が整理されています。",
    tone: "warning",
  },
  {
    label: "Settings Checks",
    value: String(settingsChecks.length),
    note: "設定画面には環境確認項目を専用パネルで表示しています。",
    tone: "neutral",
  },
];