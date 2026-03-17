import type { DashboardCard } from "../types";

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
  title: string;
  detail: string;
  phase: "done" | "current" | "next";
};

export type HomeSignal = {
  label: string;
  value: string;
  note: string;
  tone: "primary" | "success" | "warning" | "neutral";
};

export type HomeSectionSnapshot = {
  section: string;
  status: string;
  focus: string;
  cardCount: number;
  note: string;
};