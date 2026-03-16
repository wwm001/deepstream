import type { DashboardCard } from "../../types";
import type { NavigationSection } from "../../navigationItems";

export type DashboardDetailItem = {
  label: string;
  value: string;
};

export type DashboardSectionData = {
  description: string;
  statusLabel: string;
  focusLabel: string;
  detailItems: DashboardDetailItem[];
  cards: DashboardCard[];
};

export type SettingCheck = {
  label: string;
  value: string;
  state: "ok" | "watch" | "next";
  note: string;
};

export type LibraryAsset = {
  name: string;
  role: string;
  state: "stable" | "active" | "next";
  note: string;
};

export type StreamEvent = {
  id: string;
  title: string;
  detail: string;
  phase: "done" | "current" | "next";
};

export type HomeFocusItem = {
  label: string;
  title: string;
  detail: string;
  state: "now" | "ready" | "next";
};

export type DashboardSnapshotItem = {
  label: string;
  value: string;
  note: string;
  tone: "indigo" | "green" | "amber" | "gray";
};

export type DashboardSectionsRecord = Record<
  NavigationSection,
  DashboardSectionData
>;