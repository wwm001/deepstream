import { useCallback } from "react";
import type { Dispatch, SetStateAction } from "react";
import type {
  LibraryAsset,
  SettingCheck,
  StreamEvent,
} from "../dashboardData/types";
import { STORAGE_KEYS } from "../utils/storageKeys";
import {
  removeStorageItem,
} from "../utils/safeLocalStorage";
import {
  cloneLibraryItems,
  cloneSettingsItems,
  cloneStreamItems,
  createClientId,
  DASHBOARD_STORAGE_NAMESPACE,
  nextSettingStateMap,
  type LibraryFilter,
  type LibrarySort,
  type SettingsFilter,
  type StreamFilter,
  type StreamSort,
} from "../utils/dashboardState";

type UseDashboardActionsInput = {
  initialSettingsChecks: SettingCheck[];
  initialLibraryAssets: LibraryAsset[];
  initialStreamEvents: StreamEvent[];
  setSettingsItems: Dispatch<SetStateAction<SettingCheck[]>>;
  setSettingsFilter: Dispatch<SetStateAction<SettingsFilter>>;
  setShowSettingsNotes: Dispatch<SetStateAction<boolean>>;
  setLibraryItems: Dispatch<SetStateAction<LibraryAsset[]>>;
  setLibraryFilter: Dispatch<SetStateAction<LibraryFilter>>;
  setLibrarySort: Dispatch<SetStateAction<LibrarySort>>;
  setLibrarySearchTerm: Dispatch<SetStateAction<string>>;
  setStreamItems: Dispatch<SetStateAction<StreamEvent[]>>;
  setStreamFilter: Dispatch<SetStateAction<StreamFilter>>;
  setStreamSort: Dispatch<SetStateAction<StreamSort>>;
};

function useDashboardActions({
  initialSettingsChecks,
  initialLibraryAssets,
  initialStreamEvents,
  setSettingsItems,
  setSettingsFilter,
  setShowSettingsNotes,
  setLibraryItems,
  setLibraryFilter,
  setLibrarySort,
  setLibrarySearchTerm,
  setStreamItems,
  setStreamFilter,
  setStreamSort,
}: UseDashboardActionsInput) {
  const handleCycleSettingState = useCallback(
    (label: string) => {
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
    },
    [setSettingsItems]
  );

  const handleToggleSettingsNotes = useCallback(() => {
    setShowSettingsNotes((current) => !current);
  }, [setShowSettingsNotes]);

  const handleRemoveLibraryAsset = useCallback(
    (assetId: string) => {
      setLibraryItems((currentItems) =>
        currentItems.filter((item) => item.id !== assetId)
      );
    },
    [setLibraryItems]
  );

  const handleRemoveStreamEvent = useCallback(
    (eventId: string) => {
      setStreamItems((currentItems) =>
        currentItems.filter((item) => item.id !== eventId)
      );
    },
    [setStreamItems]
  );

  const handleAddLibraryAsset = useCallback(
    (asset: Omit<LibraryAsset, "id">) => {
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
    },
    [setLibraryItems]
  );

  const handleAddStreamEvent = useCallback(
    (event: Omit<StreamEvent, "id">) => {
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
    },
    [setStreamItems]
  );

  const handleResetSettings = useCallback(() => {
    removeStorageItem(STORAGE_KEYS.settingsState, DASHBOARD_STORAGE_NAMESPACE);
    setSettingsItems(cloneSettingsItems(initialSettingsChecks));
    setSettingsFilter("all");
    setShowSettingsNotes(true);
  }, [
    initialSettingsChecks,
    setSettingsItems,
    setSettingsFilter,
    setShowSettingsNotes,
  ]);

  const handleResetLibrary = useCallback(() => {
    removeStorageItem(STORAGE_KEYS.libraryState, DASHBOARD_STORAGE_NAMESPACE);
    setLibraryItems(cloneLibraryItems(initialLibraryAssets));
    setLibraryFilter("all");
    setLibrarySort("name");
    setLibrarySearchTerm("");
  }, [
    initialLibraryAssets,
    setLibraryItems,
    setLibraryFilter,
    setLibrarySort,
    setLibrarySearchTerm,
  ]);

  const handleResetStream = useCallback(() => {
    removeStorageItem(STORAGE_KEYS.streamState, DASHBOARD_STORAGE_NAMESPACE);
    setStreamItems(cloneStreamItems(initialStreamEvents));
    setStreamFilter("all");
    setStreamSort("timeline");
  }, [
    initialStreamEvents,
    setStreamItems,
    setStreamFilter,
    setStreamSort,
  ]);

  return {
    handleCycleSettingState,
    handleToggleSettingsNotes,
    handleRemoveLibraryAsset,
    handleRemoveStreamEvent,
    handleAddLibraryAsset,
    handleAddStreamEvent,
    handleResetSettings,
    handleResetLibrary,
    handleResetStream,
  };
}

export default useDashboardActions;