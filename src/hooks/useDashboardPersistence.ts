import { useEffect } from "react";
import type {
  LibraryAsset,
  SettingCheck,
  StreamEvent,
} from "../dashboardData/types";
import { STORAGE_KEYS } from "../utils/storageKeys";
import { writeStorageJSON } from "../utils/safeLocalStorage";
import type {
  LibraryFilter,
  LibrarySort,
  SettingsFilter,
  StreamFilter,
  StreamSort,
} from "../utils/dashboardState";
import { DASHBOARD_STORAGE_NAMESPACE } from "../utils/dashboardState";

type UseDashboardPersistenceInput = {
  settingsItems: SettingCheck[];
  settingsFilter: SettingsFilter;
  showSettingsNotes: boolean;
  libraryItems: LibraryAsset[];
  libraryFilter: LibraryFilter;
  librarySort: LibrarySort;
  librarySearchTerm: string;
  streamItems: StreamEvent[];
  streamFilter: StreamFilter;
  streamSort: StreamSort;
};

function useDashboardPersistence({
  settingsItems,
  settingsFilter,
  showSettingsNotes,
  libraryItems,
  libraryFilter,
  librarySort,
  librarySearchTerm,
  streamItems,
  streamFilter,
  streamSort,
}: UseDashboardPersistenceInput) {
  useEffect(() => {
    writeStorageJSON(
      STORAGE_KEYS.settingsState,
      {
        settingsItems,
        settingsFilter,
        showSettingsNotes,
      },
      DASHBOARD_STORAGE_NAMESPACE
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
      DASHBOARD_STORAGE_NAMESPACE
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
      DASHBOARD_STORAGE_NAMESPACE
    );
  }, [streamItems, streamFilter, streamSort]);
}

export default useDashboardPersistence;