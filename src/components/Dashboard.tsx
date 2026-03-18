import { useEffect, useMemo, useState } from "react";
import StreamCard from "./StreamCard";
import StatusPill from "./StatusPill";
import SectionHeader from "./SectionHeader";
import DashboardSummary from "./DashboardSummary";
import DashboardDetailPanel from "./DashboardDetailPanel";
import DashboardExtraContent from "./DashboardExtraContent";
import { dashboardSections } from "../dashboardData/sections";
import { settingsChecks as initialSettingsChecks } from "../dashboardData/settingsData";
import { libraryAssets as initialLibraryAssets } from "../dashboardData/libraryData";
import { streamEvents as initialStreamEvents } from "../dashboardData/streamData";
import type {
  HomeSectionSnapshot,
  HomeSignal,
  LibraryAsset,
  SettingCheck,
  StreamEvent,
} from "../dashboardData/types";
import type { NavigationSection } from "../navigationItems";
import { STORAGE_KEYS } from "../utils/storageKeys";
import {
  readStorageJSON,
  removeStorageItem,
  writeStorageJSON,
} from "../utils/safeLocalStorage";

type DashboardProps = {
  currentSection: NavigationSection;
  onSelectSection: (section: NavigationSection) => void;
};

type SettingsFilter = "all" | SettingCheck["state"];
type LibraryFilter = "all" | LibraryAsset["state"];
type LibrarySort = "name" | "state";
type StreamFilter = "all" | StreamEvent["phase"];
type StreamSort = "timeline" | "newest" | "planned";

type PersistedSettingsState = {
  settingsItems: SettingCheck[];
  settingsFilter: SettingsFilter;
  showSettingsNotes: boolean;
};

type PersistedLibraryState = {
  libraryItems: LibraryAsset[];
  libraryFilter: LibraryFilter;
  librarySort: LibrarySort;
  librarySearchTerm: string;
};

type PersistedStreamState = {
  streamItems: StreamEvent[];
  streamFilter: StreamFilter;
  streamSort: StreamSort;
};

const STORAGE_NAMESPACE = "Dashboard";

const nextSettingStateMap: Record<
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

function isValidSettingsFilter(value: unknown): value is SettingsFilter {
  return value === "all" || value === "ok" || value === "watch" || value === "next";
}

function isValidLibraryFilter(value: unknown): value is LibraryFilter {
  return (
    value === "all" ||
    value === "stable" ||
    value === "active" ||
    value === "next"
  );
}

function isValidLibrarySort(value: unknown): value is LibrarySort {
  return value === "name" || value === "state";
}

function isValidStreamFilter(value: unknown): value is StreamFilter {
  return value === "all" || value === "done" || value === "current" || value === "next";
}

function isValidStreamSort(value: unknown): value is StreamSort {
  return value === "timeline" || value === "newest" || value === "planned";
}

function isValidSettingCheck(value: unknown): value is SettingCheck {
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

function isValidLibraryAsset(value: unknown): value is LibraryAsset {
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

function isValidStreamEvent(value: unknown): value is StreamEvent {
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

function cloneSettingsItems(items: SettingCheck[]): SettingCheck[] {
  return items.map((item) => ({ ...item }));
}

function cloneLibraryItems(items: LibraryAsset[]): LibraryAsset[] {
  return items.map((item) => ({ ...item }));
}

function cloneStreamItems(items: StreamEvent[]): StreamEvent[] {
  return items.map((item) => ({ ...item }));
}

function createClientId(prefix: string) {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return `${prefix}${crypto.randomUUID()}`;
  }

  return `${prefix}${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function readStoredSettingsState(): PersistedSettingsState {
  const fallback: PersistedSettingsState = {
    settingsItems: cloneSettingsItems(initialSettingsChecks),
    settingsFilter: "all",
    showSettingsNotes: true,
  };

  const parsed = readStorageJSON<unknown>(
    STORAGE_KEYS.settingsState,
    STORAGE_NAMESPACE,
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

function readStoredLibraryState(): PersistedLibraryState {
  const fallback: PersistedLibraryState = {
    libraryItems: cloneLibraryItems(initialLibraryAssets),
    libraryFilter: "all",
    librarySort: "name",
    librarySearchTerm: "",
  };

  const parsed = readStorageJSON<unknown>(
    STORAGE_KEYS.libraryState,
    STORAGE_NAMESPACE,
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

function readStoredStreamState(): PersistedStreamState {
  const fallback: PersistedStreamState = {
    streamItems: cloneStreamItems(initialStreamEvents),
    streamFilter: "all",
    streamSort: "timeline",
  };

  const parsed = readStorageJSON<unknown>(
    STORAGE_KEYS.streamState,
    STORAGE_NAMESPACE,
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

function Dashboard({
  currentSection,
  onSelectSection,
}: DashboardProps) {
  const [settingsPersistedState] = useState<PersistedSettingsState>(() =>
    readStoredSettingsState()
  );
  const [libraryPersistedState] = useState<PersistedLibraryState>(() =>
    readStoredLibraryState()
  );
  const [streamPersistedState] = useState<PersistedStreamState>(() =>
    readStoredStreamState()
  );

  const [settingsItems, setSettingsItems] = useState<SettingCheck[]>(
    settingsPersistedState.settingsItems
  );
  const [settingsFilter, setSettingsFilter] = useState<SettingsFilter>(
    settingsPersistedState.settingsFilter
  );
  const [showSettingsNotes, setShowSettingsNotes] = useState<boolean>(
    settingsPersistedState.showSettingsNotes
  );

  const [libraryItems, setLibraryItems] = useState<LibraryAsset[]>(
    libraryPersistedState.libraryItems
  );
  const [libraryFilter, setLibraryFilter] = useState<LibraryFilter>(
    libraryPersistedState.libraryFilter
  );
  const [librarySort, setLibrarySort] = useState<LibrarySort>(
    libraryPersistedState.librarySort
  );
  const [librarySearchTerm, setLibrarySearchTerm] = useState<string>(
    libraryPersistedState.librarySearchTerm
  );

  const [streamItems, setStreamItems] = useState<StreamEvent[]>(
    streamPersistedState.streamItems
  );
  const [streamFilter, setStreamFilter] = useState<StreamFilter>(
    streamPersistedState.streamFilter
  );
  const [streamSort, setStreamSort] = useState<StreamSort>(
    streamPersistedState.streamSort
  );

  const section = dashboardSections[currentSection];

  useEffect(() => {
    writeStorageJSON(
      STORAGE_KEYS.settingsState,
      {
        settingsItems,
        settingsFilter,
        showSettingsNotes,
      },
      STORAGE_NAMESPACE
    );
  }, [settingsItems, settingsFilter, showSettingsNotes]);

  useEffect(() => {
    writeStorageJSON(
      STORAGE_KEYS.libraryState,
      {
        libraryItems,
        libraryFilter,
        librarySort,
        librarySearchTerm,
      },
      STORAGE_NAMESPACE
    );
  }, [libraryItems, libraryFilter, librarySort, librarySearchTerm]);

  useEffect(() => {
    writeStorageJSON(
      STORAGE_KEYS.streamState,
      {
        streamItems,
        streamFilter,
        streamSort,
      },
      STORAGE_NAMESPACE
    );
  }, [streamItems, streamFilter, streamSort]);

  const filteredSettingsChecks = useMemo(() => {
    if (settingsFilter === "all") {
      return settingsItems;
    }

    return settingsItems.filter((item) => item.state === settingsFilter);
  }, [settingsItems, settingsFilter]);

  const filteredLibraryAssets = useMemo(() => {
    const normalizedSearchTerm = librarySearchTerm.trim().toLowerCase();

    const baseAssets = libraryItems.filter((item) => {
      const matchesFilter =
        libraryFilter === "all" ? true : item.state === libraryFilter;

      const matchesSearch =
        normalizedSearchTerm.length === 0
          ? true
          : `${item.name} ${item.role} ${item.note}`
              .toLowerCase()
              .includes(normalizedSearchTerm);

      return matchesFilter && matchesSearch;
    });

    if (librarySort === "name") {
      return [...baseAssets].sort((a, b) => a.name.localeCompare(b.name));
    }

    const stateOrder = {
      stable: 0,
      active: 1,
      next: 2,
    } as const;

    return [...baseAssets].sort((a, b) => {
      const stateDiff = stateOrder[a.state] - stateOrder[b.state];

      if (stateDiff !== 0) {
        return stateDiff;
      }

      return a.name.localeCompare(b.name);
    });
  }, [libraryItems, libraryFilter, librarySearchTerm, librarySort]);

  const filteredStreamEvents = useMemo(() => {
    const baseEvents =
      streamFilter === "all"
        ? streamItems
        : streamItems.filter((item) => item.phase === streamFilter);

    if (streamSort === "timeline") {
      return baseEvents;
    }

    if (streamSort === "newest") {
      return [...baseEvents].reverse();
    }

    const phaseOrder = {
      next: 0,
      current: 1,
      done: 2,
    } as const;

    return [...baseEvents].sort(
      (a, b) => phaseOrder[a.phase] - phaseOrder[b.phase]
    );
  }, [streamItems, streamFilter, streamSort]);

  const settingsStateCounts = useMemo(
    () => ({
      okCount: settingsItems.filter((item) => item.state === "ok").length,
      watchCount: settingsItems.filter((item) => item.state === "watch").length,
      nextCount: settingsItems.filter((item) => item.state === "next").length,
    }),
    [settingsItems]
  );

  const libraryStateCounts = useMemo(
    () => ({
      stableCount: libraryItems.filter((item) => item.state === "stable").length,
      activeCount: libraryItems.filter((item) => item.state === "active").length,
      nextCount: libraryItems.filter((item) => item.state === "next").length,
    }),
    [libraryItems]
  );

  const streamPhaseCounts = useMemo(
    () => ({
      doneCount: streamItems.filter((item) => item.phase === "done").length,
      currentCount: streamItems.filter((item) => item.phase === "current").length,
      nextCount: streamItems.filter((item) => item.phase === "next").length,
    }),
    [streamItems]
  );

  const userCreatedEventCount = useMemo(
    () =>
      streamItems.filter((item) => item.id.startsWith("stream-user-")).length,
    [streamItems]
  );

  const userCreatedAssetCount = useMemo(
    () =>
      libraryItems.filter((item) => item.id.startsWith("library-user-")).length,
    [libraryItems]
  );

  const handleCycleSettingState = (label: string) => {
    setSettingsItems((currentItems) =>
      currentItems.map((item) =>
        item.label === label
          ? {
              ...item,
              state: nextSettingStateMap[item.state],
            }
          : item
      )
    );
  };

  const handleToggleSettingsNotes = () => {
    setShowSettingsNotes((current) => !current);
  };

  const handleRemoveLibraryAsset = (assetId: string) => {
    setLibraryItems((currentItems) =>
      currentItems.filter((item) => item.id !== assetId)
    );
  };

  const handleRemoveStreamEvent = (eventId: string) => {
    setStreamItems((currentItems) =>
      currentItems.filter((item) => item.id !== eventId)
    );
  };

  const handleAddLibraryAsset = (asset: Omit<LibraryAsset, "id">) => {
    const trimmedName = asset.name.trim();
    const trimmedRole = asset.role.trim();
    const trimmedNote = asset.note.trim();

    if (!trimmedName || !trimmedRole || !trimmedNote) {
      return;
    }

    const newAsset: LibraryAsset = {
      id: createClientId("library-user-"),
      name: trimmedName,
      role: trimmedRole,
      note: trimmedNote,
      state: asset.state,
    };

    setLibraryItems((currentItems) => [...currentItems, newAsset]);
  };

  const handleAddStreamEvent = (event: Omit<StreamEvent, "id">) => {
    const trimmedTitle = event.title.trim();
    const trimmedDetail = event.detail.trim();

    if (!trimmedTitle || !trimmedDetail) {
      return;
    }

    const newEvent: StreamEvent = {
      id: createClientId("stream-user-"),
      title: trimmedTitle,
      detail: trimmedDetail,
      phase: event.phase,
    };

    setStreamItems((currentItems) => [...currentItems, newEvent]);
  };

  const handleResetSettings = () => {
    removeStorageItem(STORAGE_KEYS.settingsState, STORAGE_NAMESPACE);
    setSettingsItems(cloneSettingsItems(initialSettingsChecks));
    setSettingsFilter("all");
    setShowSettingsNotes(true);
  };

  const handleResetLibrary = () => {
    removeStorageItem(STORAGE_KEYS.libraryState, STORAGE_NAMESPACE);
    setLibraryItems(cloneLibraryItems(initialLibraryAssets));
    setLibraryFilter("all");
    setLibrarySort("name");
    setLibrarySearchTerm("");
  };

  const handleResetStream = () => {
    removeStorageItem(STORAGE_KEYS.streamState, STORAGE_NAMESPACE);
    setStreamItems(cloneStreamItems(initialStreamEvents));
    setStreamFilter("all");
    setStreamSort("timeline");
  };

  return (
    <section>
      <SectionHeader
        title={`${currentSection} Dashboard`}
        description={section.description}
        right={
          <StatusPill
            label={`表示カード数: ${section.cards.length}`}
            tone="gray"
            uppercase={false}
          />
        }
      />

      <DashboardSummary
        sectionLabel={currentSection}
        statusLabel={section.statusLabel}
        focusLabel={section.focusLabel}
      />

      <DashboardDetailPanel
        title="Section Details"
        items={section.detailItems}
      />

      <DashboardExtraContent
        currentSection={currentSection}
        onSelectSection={onSelectSection}
        settingsItems={settingsItems}
        filteredSettingsChecks={filteredSettingsChecks}
        settingsFilter={settingsFilter}
        showSettingsNotes={showSettingsNotes}
        settingsItemsCount={settingsItems.length}
        filteredSettingsCount={filteredSettingsChecks.length}
        settingsStateCounts={settingsStateCounts}
        onSetSettingsFilter={setSettingsFilter}
        onToggleSettingsNotes={handleToggleSettingsNotes}
        onCycleSettingState={handleCycleSettingState}
        onResetSettings={handleResetSettings}
        libraryItems={libraryItems}
        filteredLibraryAssets={filteredLibraryAssets}
        libraryFilter={libraryFilter}
        librarySort={librarySort}
        librarySearchTerm={librarySearchTerm}
        libraryItemsCount={libraryItems.length}
        filteredLibraryAssetsCount={filteredLibraryAssets.length}
        libraryStateCounts={libraryStateCounts}
        userCreatedAssetCount={userCreatedAssetCount}
        onSetLibraryFilter={setLibraryFilter}
        onSetLibrarySort={setLibrarySort}
        onSetLibrarySearchTerm={setLibrarySearchTerm}
        onAddLibraryAsset={handleAddLibraryAsset}
        onRemoveLibraryAsset={handleRemoveLibraryAsset}
        onResetLibrary={handleResetLibrary}
        streamItems={streamItems}
        filteredStreamEvents={filteredStreamEvents}
        streamFilter={streamFilter}
        streamSort={streamSort}
        streamEventsCount={streamItems.length}
        filteredStreamEventsCount={filteredStreamEvents.length}
        streamPhaseCounts={streamPhaseCounts}
        userCreatedEventCount={userCreatedEventCount}
        onSetStreamFilter={setStreamFilter}
        onSetStreamSort={setStreamSort}
        onAddStreamEvent={handleAddStreamEvent}
        onRemoveStreamEvent={handleRemoveStreamEvent}
        onResetStream={handleResetStream}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginTop: "24px",
        }}
      >
        {section.cards.map((card) => (
          <StreamCard
            key={card.title}
            title={card.title}
            description={card.description}
            type={card.type}
          />
        ))}
      </div>
    </section>
  );
}

export default Dashboard;