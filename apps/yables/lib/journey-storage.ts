import type { PersonalityProfile } from "@ohya/identity-schema";
import { ENTERTAINMENT_BADGES } from "@ohya/identity-schema";

export type MemoryCandidate = {
  id: string;
  sessionId: number;
  text: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

export type SessionProgress = {
  sessionId: number;
  status: "locked" | "open" | "completed";
  notes: string[];
  messages: Array<{ role: "assistant" | "user"; content: string }>;
  badge?: string;
  summary?: string;
};

export type JourneyState = {
  displayName: string;
  sessions: SessionProgress[];
  memoryCandidates: MemoryCandidate[];
  profile: PersonalityProfile | null;
  updatedAt: string;
};

const KEY = "yables.journey.v2";

export function createDefaultJourney(): JourneyState {
  return {
    displayName: "",
    sessions: Array.from({ length: 12 }, (_, index) => ({
      sessionId: index + 1,
      status: index === 0 ? "open" : "locked",
      notes: [],
      messages: [],
    })),
    memoryCandidates: [],
    profile: null,
    updatedAt: new Date().toISOString(),
  };
}

export function loadJourney(): JourneyState {
  if (typeof window === "undefined") return createDefaultJourney();
  try {
    const raw = window.localStorage.getItem(KEY) || window.localStorage.getItem("yables.journey.v1");
    if (!raw) return createDefaultJourney();
    const parsed = JSON.parse(raw) as Partial<JourneyState>;
    return {
      ...createDefaultJourney(),
      ...parsed,
      memoryCandidates: parsed.memoryCandidates || [],
      sessions: parsed.sessions?.length === 12 ? parsed.sessions : createDefaultJourney().sessions,
    };
  } catch {
    return createDefaultJourney();
  }
}

export function saveJourney(state: JourneyState): JourneyState {
  const next = { ...state, updatedAt: new Date().toISOString() };
  window.localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function unlockNext(state: JourneyState, completedId: number): JourneyState {
  const badge =
    ENTERTAINMENT_BADGES[(completedId - 1) % ENTERTAINMENT_BADGES.length] ||
    "The Storyteller";
  const sessions = state.sessions.map((session) => {
    if (session.sessionId === completedId) {
      return {
        ...session,
        status: "completed" as const,
        badge: session.badge || badge,
        summary: session.summary || session.notes[0] || "Session finalized by customer.",
      };
    }
    if (session.sessionId === completedId + 1 && session.status === "locked") {
      return { ...session, status: "open" as const };
    }
    return session;
  });
  return { ...state, sessions };
}

export function approvedNotes(state: JourneyState): string[] {
  return state.memoryCandidates
    .filter((item) => item.status === "approved")
    .map((item) => item.text);
}

export function setMemoryStatus(
  state: JourneyState,
  id: string,
  status: MemoryCandidate["status"],
): JourneyState {
  return {
    ...state,
    memoryCandidates: state.memoryCandidates.map((item) =>
      item.id === id ? { ...item, status } : item,
    ),
  };
}
