import { useMemo } from "react";
import type {
  LibraryAsset,
  SettingCheck,
  StreamEvent,
} from "../dashboardData/types";
import type {
  LibraryFilter,
  LibrarySort,
  SettingsFilter,
  StreamFilter,
  StreamSort,
} from "../utils/dashboardState";

type UseDashboardDerivedStateInput = {
  settingsItems: SettingCheck[];
  settingsFilter: SettingsFilter;
  libraryItems: LibraryAsset[];
  libraryFilter: LibraryFilter;
  librarySort: LibrarySort;
  librarySearchTerm: string;
  streamItems: StreamEvent[];
  streamFilter: StreamFilter;
  streamSort: StreamSort;
};

function useDashboardDerivedState({
  settingsItems,
  settingsFilter,
  libraryItems,
  libraryFilter,
  librarySort,
  librarySearchTerm,
  streamItems,
  streamFilter,
  streamSort,
}: UseDashboardDerivedStateInput) {
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

  return {
    filteredSettingsChecks,
    filteredLibraryAssets,
    filteredStreamEvents,
    settingsStateCounts,
    libraryStateCounts,
    streamPhaseCounts,
    userCreatedEventCount,
    userCreatedAssetCount,
  };
}

export default useDashboardDerivedState;