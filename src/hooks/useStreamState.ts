import { useEffect, useMemo, useState } from "react";
import {
  streamEvents as seedStreamEvents,
  type StreamEvent,
} from "../data/dashboard";
import type {
  StreamFilter,
  StreamSort,
} from "../components/StreamControlPanel";

const STORAGE_KEY = "deepstream:stream-events";

type NewStreamEventInput = {
  title: string;
  detail: string;
  phase: StreamEvent["phase"];
};

function isValidStreamEvent(value: unknown): value is StreamEvent {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.detail === "string" &&
    (candidate.phase === "done" ||
      candidate.phase === "current" ||
      candidate.phase === "next")
  );
}

function getSafeLocalStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch (error) {
    console.warn("[useStreamState] localStorage unavailable:", error);
    return null;
  }
}

function readStoredStreamEvents(): StreamEvent[] {
  const storage = getSafeLocalStorage();

  if (!storage) {
    return [...seedStreamEvents];
  }

  try {
    const saved = storage.getItem(STORAGE_KEY);

    if (!saved) {
      return [...seedStreamEvents];
    }

    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return [...seedStreamEvents];
    }

    const validEvents = parsed.filter(isValidStreamEvent);

    return validEvents.length > 0 ? validEvents : [...seedStreamEvents];
  } catch (error) {
    console.warn("[useStreamState] failed to read storage:", error);
    return [...seedStreamEvents];
  }
}

function writeStoredStreamEvents(events: StreamEvent[]) {
  const storage = getSafeLocalStorage();

  if (!storage) {
    return;
  }

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (error) {
    console.warn("[useStreamState] failed to write storage:", error);
  }
}

export function useStreamState() {
  const [streamFilter, setStreamFilter] = useState<StreamFilter>("all");
  const [streamSort, setStreamSort] = useState<StreamSort>("timeline");
  const [events, setEvents] = useState<StreamEvent[]>(() =>
    readStoredStreamEvents()
  );

  useEffect(() => {
    writeStoredStreamEvents(events);
  }, [events]);

  const filteredStreamEvents = useMemo(() => {
    const baseEvents =
      streamFilter === "all"
        ? events
        : events.filter((item) => item.phase === streamFilter);

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
  }, [events, streamFilter, streamSort]);

  const phaseCounts = useMemo(
    () => ({
      doneCount: events.filter((item) => item.phase === "done").length,
      currentCount: events.filter((item) => item.phase === "current").length,
      nextCount: events.filter((item) => item.phase === "next").length,
    }),
    [events]
  );

  const addStreamEvent = ({ title, detail, phase }: NewStreamEventInput) => {
    const trimmedTitle = title.trim();
    const trimmedDetail = detail.trim();

    if (!trimmedTitle || !trimmedDetail) {
      return;
    }

    const newEvent: StreamEvent = {
      id: `stream-user-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      title: trimmedTitle,
      detail: trimmedDetail,
      phase,
    };

    setEvents((current) => [...current, newEvent]);
  };

  const removeStreamEvent = (eventId: string) => {
    setEvents((current) => current.filter((item) => item.id !== eventId));
  };

  return {
    streamFilter,
    setStreamFilter,
    streamSort,
    setStreamSort,
    events,
    filteredStreamEvents,
    phaseCounts,
    addStreamEvent,
    removeStreamEvent,
  };
}