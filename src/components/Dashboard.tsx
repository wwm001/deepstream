import { useEffect, useState } from "react";
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
  SettingCheck,
  LibraryAsset,
  StreamEvent,
} from "../dashboardData/types";
import type { NavigationSection } from "../navigationItems";
import { STORAGE_KEYS } from "../utils/storageKeys";
import {
  readStorageJSON,
  writeStorageJSON,
  removeStorageItem,
} from "../utils/safeLocalStorage";

type DashboardProps = {
  currentSection: NavigationSection;
  onSelectSection: (section: NavigationSection) => void;
};

type PersistedSettingsState = {
  settingsItems: SettingCheck[];
};

type PersistedLibraryState = {
  libraryItems: LibraryAsset[];
};

type PersistedStreamState = {
  streamItems: StreamEvent[];
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

function readStoredSettingsItems(): SettingCheck[] {
  const fallback = {
    settingsItems: cloneSettingsItems(initialSettingsChecks),
  };

  const parsed = readStorageJSON<PersistedSettingsState>(
    STORAGE_KEYS.settingsState,
    STORAGE_NAMESPACE,
    fallback
  );

  if (!Array.isArray(parsed.settingsItems)) {
    return fallback.settingsItems;
  }

  const validItems = parsed.settingsItems.filter(isValidSettingCheck);

  if (parsed.settingsItems.length > 0 && validItems.length === 0) {
    return fallback.settingsItems;
  }

  return validItems;
}

function readStoredLibraryItems(): LibraryAsset[] {
  const fallback = {
    libraryItems: cloneLibraryItems(initialLibraryAssets),
  };

  const parsed = readStorageJSON<PersistedLibraryState>(
    STORAGE_KEYS.libraryState,
    STORAGE_NAMESPACE,
    fallback
  );

  if (!Array.isArray(parsed.libraryItems)) {
    return fallback.libraryItems;
  }

  const validItems = parsed.libraryItems.filter(isValidLibraryAsset);

  if (parsed.libraryItems.length > 0 && validItems.length === 0) {
    return fallback.libraryItems;
  }

  return validItems;
}

function readStoredStreamItems(): StreamEvent[] {
  const fallback = {
    streamItems: cloneStreamItems(initialStreamEvents),
  };

  const parsed = readStorageJSON<PersistedStreamState>(
    STORAGE_KEYS.streamState,
    STORAGE_NAMESPACE,
    fallback
  );

  if (!Array.isArray(parsed.streamItems)) {
    return fallback.streamItems;
  }

  const validItems = parsed.streamItems.filter(isValidStreamEvent);

  if (parsed.streamItems.length > 0 && validItems.length === 0) {
    return fallback.streamItems;
  }

  return validItems;
}

function Dashboard({
  currentSection,
  onSelectSection,
}: DashboardProps) {
  const [settingsItems, setSettingsItems] = useState<SettingCheck[]>(() =>
    readStoredSettingsItems()
  );
  const [libraryItems, setLibraryItems] = useState<LibraryAsset[]>(() =>
    readStoredLibraryItems()
  );
  const [streamItems, setStreamItems] = useState<StreamEvent[]>(() =>
    readStoredStreamItems()
  );

  const section = dashboardSections[currentSection];

  useEffect(() => {
    writeStorageJSON(
      STORAGE_KEYS.settingsState,
      {
        settingsItems,
      },
      STORAGE_NAMESPACE
    );
  }, [settingsItems]);

  useEffect(() => {
    writeStorageJSON(
      STORAGE_KEYS.libraryState,
      {
        libraryItems,
      },
      STORAGE_NAMESPACE
    );
  }, [libraryItems]);

  useEffect(() => {
    writeStorageJSON(
      STORAGE_KEYS.streamState,
      {
        streamItems,
      },
      STORAGE_NAMESPACE
    );
  }, [streamItems]);

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
  };

  const handleResetLibrary = () => {
    removeStorageItem(STORAGE_KEYS.libraryState, STORAGE_NAMESPACE);
    setLibraryItems(cloneLibraryItems(initialLibraryAssets));
  };

  const handleResetStream = () => {
    removeStorageItem(STORAGE_KEYS.streamState, STORAGE_NAMESPACE);
    setStreamItems(cloneStreamItems(initialStreamEvents));
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
        libraryItems={libraryItems}
        streamItems={streamItems}
        onCycleSettingState={handleCycleSettingState}
        onRemoveLibraryAsset={handleRemoveLibraryAsset}
        onRemoveStreamEvent={handleRemoveStreamEvent}
        onAddLibraryAsset={handleAddLibraryAsset}
        onAddStreamEvent={handleAddStreamEvent}
        onResetSettings={handleResetSettings}
        onResetLibrary={handleResetLibrary}
        onResetStream={handleResetStream}
      />
    </section>
  );
}

export default Dashboard;