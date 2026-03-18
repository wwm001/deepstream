import type {
  DashboardSectionData,
  HomeSectionSnapshot,
  HomeSignal,
} from "./types";
import { streamSectionData } from "./streamData";
import { librarySectionData } from "./libraryData";
import { settingsSectionData } from "./settingsData";
import type { NavigationSection } from "../navigationItems";

type CreateHomeSignalsInput = {
  currentSection: NavigationSection;

  filteredStreamEventsCount: number;
  streamFilter: "all" | "done" | "current" | "next";
  streamSort: "timeline" | "newest" | "planned";
  streamEventsCount: number;
  streamPhaseCounts: {
    doneCount: number;
    currentCount: number;
    nextCount: number;
  };
  userCreatedEventCount: number;

  filteredLibraryAssetsCount: number;
  libraryFilter: "all" | "stable" | "active" | "next";
  librarySort: "name" | "state";
  librarySearchTerm: string;
  libraryItemsCount: number;
  libraryStateCounts: {
    stableCount: number;
    activeCount: number;
    nextCount: number;
  };
  userCreatedAssetCount: number;

  filteredSettingsCount: number;
  settingsFilter: "all" | "ok" | "watch" | "next";
  showSettingsNotes: boolean;
  settingsItemsCount: number;
  settingsStateCounts: {
    okCount: number;
    watchCount: number;
    nextCount: number;
  };
};

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

export function createHomeSignals({
  currentSection,
  filteredStreamEventsCount,
  streamFilter,
  streamSort,
  streamEventsCount,
  streamPhaseCounts,
  userCreatedEventCount,
  filteredLibraryAssetsCount,
  libraryFilter,
  librarySort,
  librarySearchTerm,
  libraryItemsCount,
  libraryStateCounts,
  userCreatedAssetCount,
  filteredSettingsCount,
  settingsFilter,
  showSettingsNotes,
  settingsItemsCount,
  settingsStateCounts,
}: CreateHomeSignalsInput): HomeSignal[] {
  return [
    {
      label: "Active Section",
      value: currentSection,
      note: `現在表示中のセクションは「${currentSection}」です。リロード後もここへ戻ります。`,
      tone: "primary",
    },
    {
      label: "Stream View",
      value: String(filteredStreamEventsCount),
      note: `filter ${streamFilter} / sort ${streamSort}。全体は done ${streamPhaseCounts.doneCount} / current ${streamPhaseCounts.currentCount} / next ${streamPhaseCounts.nextCount} / total ${streamEventsCount}。`,
      tone: "success",
    },
    {
      label: "Library View",
      value: String(filteredLibraryAssetsCount),
      note:
        librarySearchTerm.trim().length > 0
          ? `検索語「${librarySearchTerm}」・filter ${libraryFilter}・sort ${librarySort} の結果件数です。全体は stable ${libraryStateCounts.stableCount} / active ${libraryStateCounts.activeCount} / next ${libraryStateCounts.nextCount} / total ${libraryItemsCount}。`
          : `filter ${libraryFilter} / sort ${librarySort} の表示件数です。全体は stable ${libraryStateCounts.stableCount} / active ${libraryStateCounts.activeCount} / next ${libraryStateCounts.nextCount} / total ${libraryItemsCount}。`,
      tone: "warning",
    },
    {
      label: "Settings View",
      value: String(filteredSettingsCount),
      note: `filter ${settingsFilter} / notes ${showSettingsNotes ? "on" : "off"}。全体は ok ${settingsStateCounts.okCount} / watch ${settingsStateCounts.watchCount} / next ${settingsStateCounts.nextCount} / total ${settingsItemsCount}。`,
      tone: "neutral",
    },
    {
      label: "User Events",
      value: String(userCreatedEventCount),
      note: `追加済みのユーザーイベント数です。全イベント総数は ${streamEventsCount} 件です。`,
      tone: "success",
    },
    {
      label: "User Assets",
      value: String(userCreatedAssetCount),
      note: `追加済みのユーザーアセット数です。全アセット総数は ${libraryItemsCount} 件です。`,
      tone: "warning",
    },
  ];
}

export function createHomeSectionSnapshots(): HomeSectionSnapshot[] {
  return [
    {
      section: "ホーム",
      status: homeSectionData.statusLabel,
      focus: homeSectionData.focusLabel,
      cardCount: homeSectionData.cards.length,
      note: "全体俯瞰と主要信号の司令室です。",
    },
    {
      section: "ストリーム",
      status: streamSectionData.statusLabel,
      focus: streamSectionData.focusLabel,
      cardCount: streamSectionData.cards.length,
      note: "進行イベントの流れと追加操作を扱う時系列画面です。",
    },
    {
      section: "ライブラリ",
      status: librarySectionData.statusLabel,
      focus: librarySectionData.focusLabel,
      cardCount: librarySectionData.cards.length,
      note: "再利用資産の検索・整理・追加を行う棚卸し画面です。",
    },
    {
      section: "設定",
      status: settingsSectionData.statusLabel,
      focus: settingsSectionData.focusLabel,
      cardCount: settingsSectionData.cards.length,
      note: "環境状態の監視と状態切替を扱う監視画面です。",
    },
  ];
}