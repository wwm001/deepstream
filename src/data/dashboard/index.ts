import type { NavigationSection } from "../../navigationItems";
import type { DashboardSectionData } from "../../dashboardData/types";

import type {
  HomeSectionSnapshot,
  HomeSignal,
  LibraryAsset,
  ReportRecord,
  ReportStatus,
  SettingCheck,
  StreamEvent,
} from "../../dashboardData/types";

import {
  homeSectionData,
  createHomeSectionSnapshots,
  createHomeSignals,
} from "../../dashboardData/homeData";
import { streamSectionData, streamEvents } from "../../dashboardData/streamData";
import { librarySectionData, libraryAssets } from "../../dashboardData/libraryData";
import { reportSectionData, reportItems } from "../../dashboardData/reportData";
import { settingsSectionData, settingsChecks } from "../../dashboardData/settingsData";

export type DashboardSectionsRecord = Record<
  NavigationSection,
  DashboardSectionData
>;

export const dashboardSections: DashboardSectionsRecord = {
  ホーム: homeSectionData,
  ストリーム: streamSectionData,
  ライブラリ: librarySectionData,
  レポート: reportSectionData,
  設定: settingsSectionData,
};

export type {
  HomeSectionSnapshot,
  HomeSignal,
  LibraryAsset,
  ReportRecord,
  ReportStatus,
  SettingCheck,
  StreamEvent,
};

export { createHomeSignals, createHomeSectionSnapshots };
export { settingsChecks, libraryAssets, streamEvents, reportItems };

export type HomeFocusItem = {
  title: string;
  label: string;
  value: string;
  note: string;
  detail: string;
  state: string;
};

export const homeFocusItems: HomeFocusItem[] = [
  {
    title: "Active Mission",
    label: "Active Mission",
    value: homeSectionData.focusLabel,
    note: homeSectionData.description,
    detail: "ホーム画面は全体状況の把握と次の一手の確認に使います。",
    state: "now",
  },
  {
    title: "Current Status",
    label: "Current Status",
    value: homeSectionData.statusLabel,
    note: "司令室として、現在の状況と重要ポイントを一目で確認できます。",
    detail: "司令室として、現在の状況と重要ポイントを一目で確認できます。",
    state: "ready",
  },
  {
    title: "Section Count",
    label: "Section Count",
    value: String(Object.keys(dashboardSections).length),
    note: "現在有効なナビゲーション区画の総数です。",
    detail: "現在有効なナビゲーション区画の総数です。",
    state: "attention",
  },
  {
    title: "Prototype Readiness",
    label: "Prototype Readiness",
    value: "Stable",
    note: "小分け改修と表示確認を継続できる段階です。",
    detail: "小分け改修と表示確認を継続できる段階です。",
    state: "queued",
  },
];

export type DashboardSnapshotItem = {
  label: string;
  value: string;
  note: string;
  tone: string;
  section?: NavigationSection;
  title?: string;
  status?: string;
  focus?: string;
  cardCount?: number;
  description?: string;
};

export const dashboardSnapshotItems: DashboardSnapshotItem[] =
  createHomeSectionSnapshots().map((item) => {
    const toneMap: Record<NavigationSection, string> = {
      ホーム: "indigo",
      ストリーム: "green",
      ライブラリ: "amber",
      レポート: "gray",
      設定: "gray",
    };

    return {
      label: item.section,
      value: item.focus,
      note: item.note,
      tone: toneMap[item.section],
      section: item.section,
      title: item.section,
      status: item.status,
      focus: item.focus,
      cardCount: item.cardCount,
      description: item.note,
    };
  });