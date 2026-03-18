import type {
  LibraryAsset,
  SettingCheck,
  StreamEvent,
} from "../dashboardData/types";
import { STORAGE_KEYS } from "./storageKeys";
import { readStorageJSON } from "./safeLocalStorage";

export type SettingsFilter = "all" | SettingCheck["state"];
export type LibraryFilter = "all" | LibraryAsset["state"];
export type LibrarySort = "name" | "state";
export type StreamFilter = "all" | StreamEvent["phase"];
export type StreamSort = "timeline" | "newest" | "planned";

export type PersistedSettingsState = {
  settingsItems: SettingCheck[];
  settingsFilter: SettingsFilter;
  showSettingsNotes: boolean;
};

export type PersistedLibraryState = {
  libraryItems: LibraryAsset[];
  libraryFilter: LibraryFilter;
  librarySort: LibrarySort;
  librarySearchTerm: string;
};

export type PersistedStreamState = {
  streamItems: StreamEvent[];
  streamFilter: StreamFilter;
  streamSort: StreamSort;
};

export const DASHBOARD_STORAGE_NAMESPACE = "Dashboard";

export const nextSettingStateMap: Record<
  SettingCheck["state"],
  SettingCheck["state"]
> = {
  ok: "watch",
  watch: "next",
  next: "ok",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function isValidSettingsFilter(value: unknown): value is SettingsFilter {
  return value === "all" || value === "ok" || value === "watch" || value === "next";
}

export function isValidLibraryFilter(value: unknown): value is LibraryFilter {
  return (
    value === "all" ||
    value === "stable" ||
    value === "active" ||
    value === "next"
  );
}

export function isValidLibrarySort(value: unknown): value is LibrarySort {
  return value === "name" || value === "state";
}

export function isValidStreamFilter(value: unknown): value is StreamFilter {
  return value === "all" || value === "done" || value === "current" || value === "next";
}

export function isValidStreamSort(value: unknown): value is StreamSort {
  return value === "timeline" || value === "newest" || value === "planned";
}

export function isValidSettingCheck(value: unknown): value is SettingCheck {
  return (
    isRecord(value) &&
    typeof value.label === "string" &&
    typeof value.value === "string" &&
    typeof value.note === "string" &&
    (value.state === "ok" ||
      value.state === "watch" ||
      value.state === "next")
  );
}

export function isValidLibraryAsset(value: unknown): value is LibraryAsset {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.role === "string" &&
    typeof value.note === "string" &&
    (value.state === "stable" ||
      value.state === "active" ||
      value.state === "next")
  );
}

export function isValidStreamEvent(value: unknown): value is StreamEvent {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.detail === "string" &&
    (value.phase === "done" ||
      value.phase === "current" ||
      value.phase === "next")
  );
}

export function cloneSettingsItems(items: SettingCheck[]): SettingCheck[] {
  return items.map((item) => ({ ...item }));
}

export function cloneLibraryItems(items: LibraryAsset[]): LibraryAsset[] {
  return items.map((item) => ({ ...item }));
}

export function cloneStreamItems(items: StreamEvent[]): StreamEvent[] {
  return items.map((item) => ({ ...item }));
}

export function createClientId(prefix: string) {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return `${prefix}${crypto.randomUUID()}`;
  }

  return `${prefix}${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function readStoredSettingsState(
  initialSettingsChecks: SettingCheck[]
): PersistedSettingsState {
  const fallback: PersistedSettingsState = {
    settingsItems: cloneSettingsItems(initialSettingsChecks),
    settingsFilter: "all",
    showSettingsNotes: true,
  };

  const parsed = readStorageJSON<unknown>(
    STORAGE_KEYS.settingsState,
    DASHBOARD_STORAGE_NAMESPACE,
    fallback
  );

  if (!isRecord(parsed)) {
    return fallback;
  }

  const nextItems = Array.isArray(parsed.settingsItems)
    ? parsed.settingsItems.length === 0
      ? []
      : (() => {
          const validItems = parsed.settingsItems.filter(isValidSettingCheck);
          return validItems.length > 0 ? validItems : fallback.settingsItems;
        })()
    : fallback.settingsItems;

  return {
    settingsItems: nextItems,
    settingsFilter: isValidSettingsFilter(parsed.settingsFilter)
      ? parsed.settingsFilter
      : "all",
    showSettingsNotes:
      typeof parsed.showSettingsNotes === "boolean"
        ? parsed.showSettingsNotes
        : true,
  };
}

export function readStoredLibraryState(
  initialLibraryAssets: LibraryAsset[]
): PersistedLibraryState {
  const fallback: PersistedLibraryState = {
    libraryItems: cloneLibraryItems(initialLibraryAssets),
    libraryFilter: "all",
    librarySort: "name",
    librarySearchTerm: "",
  };

  const parsed = readStorageJSON<unknown>(
    STORAGE_KEYS.libraryState,
    DASHBOARD_STORAGE_NAMESPACE,
    fallback
  );

  if (!isRecord(parsed)) {
    return fallback;
  }

  const nextItems = Array.isArray(parsed.libraryItems)
    ? parsed.libraryItems.length === 0
      ? []
      : (() => {
          const validItems = parsed.libraryItems.filter(isValidLibraryAsset);
          return validItems.length > 0 ? validItems : fallback.libraryItems;
        })()
    : fallback.libraryItems;

  return {
    libraryItems: nextItems,
    libraryFilter: isValidLibraryFilter(parsed.libraryFilter)
      ? parsed.libraryFilter
      : "all",
    librarySort: isValidLibrarySort(parsed.librarySort)
      ? parsed.librarySort
      : "name",
    librarySearchTerm:
      typeof parsed.librarySearchTerm === "string"
        ? parsed.librarySearchTerm
        : "",
  };
}

export function readStoredStreamState(
  initialStreamEvents: StreamEvent[]
): PersistedStreamState {
  const fallback: PersistedStreamState = {
    streamItems: cloneStreamItems(initialStreamEvents),
    streamFilter: "all",
    streamSort: "timeline",
  };

  const parsed = readStorageJSON<unknown>(
    STORAGE_KEYS.streamState,
    DASHBOARD_STORAGE_NAMESPACE,
    fallback
  );

  if (!isRecord(parsed)) {
    return fallback;
  }

  const nextItems = Array.isArray(parsed.streamItems)
    ? parsed.streamItems.length === 0
      ? []
      : (() => {
          const validItems = parsed.streamItems.filter(isValidStreamEvent);
          return validItems.length > 0 ? validItems : fallback.streamItems;
        })()
    : fallback.streamItems;

  return {
    streamItems: nextItems,
    streamFilter: isValidStreamFilter(parsed.streamFilter)
      ? parsed.streamFilter
      : "all",
    streamSort: isValidStreamSort(parsed.streamSort)
      ? parsed.streamSort
      : "timeline",
  };
}