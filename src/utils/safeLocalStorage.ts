function getSafeLocalStorage(namespace: string): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch (error) {
    console.warn(`[${namespace}] localStorage unavailable:`, error);
    return null;
  }
}

export function readStorageJSON<T>(
  key: string,
  namespace: string,
  fallback: T
): T {
  const storage = getSafeLocalStorage(namespace);

  if (!storage) {
    return fallback;
  }

  try {
    const raw = storage.getItem(key);

    if (!raw) {
      return fallback;
    }

    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(`[${namespace}] failed to read storage "${key}":`, error);
    return fallback;
  }
}

export function writeStorageJSON(
  key: string,
  value: unknown,
  namespace: string
) {
  const storage = getSafeLocalStorage(namespace);

  if (!storage) {
    return;
  }

  try {
    storage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`[${namespace}] failed to write storage "${key}":`, error);
  }
}

export function removeStorageItem(key: string, namespace: string) {
  const storage = getSafeLocalStorage(namespace);

  if (!storage) {
    return;
  }

  try {
    storage.removeItem(key);
  } catch (error) {
    console.warn(`[${namespace}] failed to remove storage "${key}":`, error);
  }
}