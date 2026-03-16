import { useEffect, useMemo, useState } from "react";
import {
  settingsChecks as seedSettingsChecks,
  type SettingCheck,
} from "../data/dashboard";
import type { SettingsFilter } from "../components/SettingsControlPanel";

const STORAGE_KEY = "deepstream:settings-state";

type StoredSettingsState = {
  items: SettingCheck[];
  showNotes: boolean;
  filter: SettingsFilter;
};

function isValidSettingCheck(value: unknown): value is SettingCheck {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.label === "string" &&
    typeof candidate.value === "string" &&
    typeof candidate.note === "string" &&
    (candidate.state === "ok" ||
      candidate.state === "watch" ||
      candidate.state === "next")
  );
}

function isValidSettingsFilter(value: unknown): value is SettingsFilter {
  return value === "all" || value === "ok" || value === "watch" || value === "next";
}

function getSafeLocalStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch (error) {
    console.warn("[useSettingsState] localStorage unavailable:", error);
    return null;
  }
}

function readStoredSettingsState(): StoredSettingsState {
  const storage = getSafeLocalStorage();

  if (!storage) {
    return {
      items: [...seedSettingsChecks],
      showNotes: true,
      filter: "all",
    };
  }

  try {
    const saved = storage.getItem(STORAGE_KEY);

    if (!saved) {
      return {
        items: [...seedSettingsChecks],
        showNotes: true,
        filter: "all",
      };
    }

    const parsed = JSON.parse(saved) as Partial<StoredSettingsState>;

    const validItems = Array.isArray(parsed.items)
      ? parsed.items.filter(isValidSettingCheck)
      : [];

    return {
      items: validItems.length > 0 ? validItems : [...seedSettingsChecks],
      showNotes: typeof parsed.showNotes === "boolean" ? parsed.showNotes : true,
      filter: isValidSettingsFilter(parsed.filter) ? parsed.filter : "all",
    };
  } catch (error) {
    console.warn("[useSettingsState] failed to read storage:", error);

    return {
      items: [...seedSettingsChecks],
      showNotes: true,
      filter: "all",
    };
  }
}

function writeStoredSettingsState(payload: StoredSettingsState) {
  const storage = getSafeLocalStorage();

  if (!storage) {
    return;
  }

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.warn("[useSettingsState] failed to write storage:", error);
  }
}

function getNextState(
  currentState: SettingCheck["state"]
): SettingCheck["state"] {
  if (currentState === "ok") {
    return "watch";
  }

  if (currentState === "watch") {
    return "next";
  }

  return "ok";
}

export function useSettingsState() {
  const initialState = readStoredSettingsState();

  const [settingsItems, setSettingsItems] = useState<SettingCheck[]>(
    initialState.items
  );
  const [showSettingsNotes, setShowSettingsNotes] = useState<boolean>(
    initialState.showNotes
  );
  const [settingsFilter, setSettingsFilter] = useState<SettingsFilter>(
    initialState.filter
  );

  useEffect(() => {
    writeStoredSettingsState({
      items: settingsItems,
      showNotes: showSettingsNotes,
      filter: settingsFilter,
    });
  }, [settingsItems, showSettingsNotes, settingsFilter]);

  const filteredSettingsChecks = useMemo(() => {
    if (settingsFilter === "all") {
      return settingsItems;
    }

    return settingsItems.filter((item) => item.state === settingsFilter);
  }, [settingsItems, settingsFilter]);

  const summaryCounts = useMemo(
    () => ({
      okCount: settingsItems.filter((item) => item.state === "ok").length,
      watchCount: settingsItems.filter((item) => item.state === "watch").length,
      nextCount: settingsItems.filter((item) => item.state === "next").length,
    }),
    [settingsItems]
  );

  const cycleSettingState = (label: string) => {
    setSettingsItems((current) =>
      current.map((item) =>
        item.label === label
          ? {
              ...item,
              state: getNextState(item.state),
            }
          : item
      )
    );
  };

  const toggleSettingsNotes = () => {
    setShowSettingsNotes((current) => !current);
  };

  return {
    settingsItems,
    settingsFilter,
    setSettingsFilter,
    showSettingsNotes,
    toggleSettingsNotes,
    filteredSettingsChecks,
    summaryCounts,
    cycleSettingState,
  };
}