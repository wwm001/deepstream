import { useEffect, useMemo, useState } from "react";
import {
  libraryAssets as seedLibraryAssets,
  type LibraryAsset,
} from "../data/dashboard";
import type {
  LibraryFilter,
  LibrarySort,
} from "../components/LibraryControlPanel";

const STORAGE_KEY = "deepstream:library-state";

type StoredLibraryState = {
  items: LibraryAsset[];
  filter: LibraryFilter;
  sort: LibrarySort;
  searchTerm: string;
};

type NewLibraryAssetInput = {
  name: string;
  role: string;
  state: LibraryAsset["state"];
  note: string;
};

function isValidLibraryAsset(value: unknown): value is LibraryAsset {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.name === "string" &&
    typeof candidate.role === "string" &&
    typeof candidate.note === "string" &&
    (candidate.state === "stable" ||
      candidate.state === "active" ||
      candidate.state === "next")
  );
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

function getSafeLocalStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch (error) {
    console.warn("[useLibraryState] localStorage unavailable:", error);
    return null;
  }
}

function readStoredLibraryState(): StoredLibraryState {
  const storage = getSafeLocalStorage();

  if (!storage) {
    return {
      items: [...seedLibraryAssets],
      filter: "all",
      sort: "name",
      searchTerm: "",
    };
  }

  try {
    const saved = storage.getItem(STORAGE_KEY);

    if (!saved) {
      return {
        items: [...seedLibraryAssets],
        filter: "all",
        sort: "name",
        searchTerm: "",
      };
    }

    const parsed = JSON.parse(saved) as Partial<StoredLibraryState>;

    const validItems = Array.isArray(parsed.items)
      ? parsed.items.filter(isValidLibraryAsset)
      : [];

    return {
      items: validItems.length > 0 ? validItems : [...seedLibraryAssets],
      filter: isValidLibraryFilter(parsed.filter) ? parsed.filter : "all",
      sort: isValidLibrarySort(parsed.sort) ? parsed.sort : "name",
      searchTerm:
        typeof parsed.searchTerm === "string" ? parsed.searchTerm : "",
    };
  } catch (error) {
    console.warn("[useLibraryState] failed to read storage:", error);

    return {
      items: [...seedLibraryAssets],
      filter: "all",
      sort: "name",
      searchTerm: "",
    };
  }
}

function writeStoredLibraryState(payload: StoredLibraryState) {
  const storage = getSafeLocalStorage();

  if (!storage) {
    return;
  }

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.warn("[useLibraryState] failed to write storage:", error);
  }
}

export function useLibraryState() {
  const initialState = readStoredLibraryState();

  const [libraryItems, setLibraryItems] = useState<LibraryAsset[]>(
    initialState.items
  );
  const [libraryFilter, setLibraryFilter] = useState<LibraryFilter>(
    initialState.filter
  );
  const [librarySort, setLibrarySort] = useState<LibrarySort>(
    initialState.sort
  );
  const [librarySearchTerm, setLibrarySearchTerm] = useState<string>(
    initialState.searchTerm
  );

  useEffect(() => {
    writeStoredLibraryState({
      items: libraryItems,
      filter: libraryFilter,
      sort: librarySort,
      searchTerm: librarySearchTerm,
    });
  }, [libraryItems, libraryFilter, librarySort, librarySearchTerm]);

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

  const summaryCounts = useMemo(
    () => ({
      stableCount: libraryItems.filter((item) => item.state === "stable").length,
      activeCount: libraryItems.filter((item) => item.state === "active").length,
      nextCount: libraryItems.filter((item) => item.state === "next").length,
    }),
    [libraryItems]
  );

  const addLibraryAsset = ({
    name,
    role,
    state,
    note,
  }: NewLibraryAssetInput) => {
    const trimmedName = name.trim();
    const trimmedRole = role.trim();
    const trimmedNote = note.trim();

    if (!trimmedName || !trimmedRole || !trimmedNote) {
      return;
    }

    const newAsset: LibraryAsset = {
      id: `library-user-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      name: trimmedName,
      role: trimmedRole,
      state,
      note: trimmedNote,
    };

    setLibraryItems((current) => [...current, newAsset]);
  };

  const removeLibraryAsset = (assetId: string) => {
    setLibraryItems((current) => current.filter((item) => item.id !== assetId));
  };

  return {
    libraryItems,
    libraryFilter,
    setLibraryFilter,
    librarySort,
    setLibrarySort,
    librarySearchTerm,
    setLibrarySearchTerm,
    filteredLibraryAssets,
    summaryCounts,
    addLibraryAsset,
    removeLibraryAsset,
  };
}