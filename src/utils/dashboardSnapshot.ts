import type { NavigationSection } from "../navigationItems";
import { navigationItems } from "../navigationItems";
import type {
  LibraryAsset,
  SettingCheck,
  StreamEvent,
} from "../dashboardData/types";
import {
  isValidLibraryAsset,
  isValidLibraryFilter,
  isValidLibrarySort,
  isValidSettingCheck,
  isValidSettingsFilter,
  isValidStreamEvent,
  isValidStreamFilter,
  isValidStreamSort,
  type LibraryFilter,
  type LibrarySort,
  type SettingsFilter,
  type StreamFilter,
  type StreamSort,
} from "./dashboardState";

export type DashboardSnapshot = {
  version: 1;
  exportedAt: string;
  currentSection: NavigationSection;
  settings: {
    items: SettingCheck[];
    filter: SettingsFilter;
    showNotes: boolean;
  };
  library: {
    items: LibraryAsset[];
    filter: LibraryFilter;
    sort: LibrarySort;
    searchTerm: string;
  };
  stream: {
    items: StreamEvent[];
    filter: StreamFilter;
    sort: StreamSort;
  };
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isNavigationSection(value: unknown): value is NavigationSection {
  return (
    typeof value === "string" &&
    navigationItems.includes(value as NavigationSection)
  );
}

export function isDashboardSnapshot(value: unknown): value is DashboardSnapshot {
  if (!isRecord(value)) {
    return false;
  }

  if (value.version !== 1) {
    return false;
  }

  if (typeof value.exportedAt !== "string") {
    return false;
  }

  if (!isNavigationSection(value.currentSection)) {
    return false;
  }

  if (!isRecord(value.settings) || !isRecord(value.library) || !isRecord(value.stream)) {
    return false;
  }

  if (
    !Array.isArray(value.settings.items) ||
    !value.settings.items.every(isValidSettingCheck) ||
    !isValidSettingsFilter(value.settings.filter) ||
    typeof value.settings.showNotes !== "boolean"
  ) {
    return false;
  }

  if (
    !Array.isArray(value.library.items) ||
    !value.library.items.every(isValidLibraryAsset) ||
    !isValidLibraryFilter(value.library.filter) ||
    !isValidLibrarySort(value.library.sort) ||
    typeof value.library.searchTerm !== "string"
  ) {
    return false;
  }

  if (
    !Array.isArray(value.stream.items) ||
    !value.stream.items.every(isValidStreamEvent) ||
    !isValidStreamFilter(value.stream.filter) ||
    !isValidStreamSort(value.stream.sort)
  ) {
    return false;
  }

  return true;
}

export function createDashboardSnapshotFilename() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const mi = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");

  return `deepstream-snapshot-${yyyy}${mm}${dd}-${hh}${mi}${ss}.json`;
}