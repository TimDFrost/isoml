import type { PersonalityProfile } from "@ohya/identity-schema";

export type SessionProgress = {
  sessionId: number;
  status: "locked" | "open" | "completed";
  notes: string[];
  messages: Array<{ role: "assistant" | "user"; content: string }>;
  badge?: string;
};

export type JourneyState = {
  displayName: string;
  sessions: SessionProgress[];
  profile: PersonalityProfile | null;
  updatedAt: string;
};

const KEY = "yables.journey.v1";

export function createDefaultJourney(): JourneyState {
  return {
    displayName: "",
    sessions: Array.from({ length: 12 }, (_, index) => ({
      sessionId: index + 1,
      status: index === 0 ? "open" : "locked",
      notes: [],
      messages: [],
    })),
    profile: null,
    updatedAt: new Date().toISOString(),
  };
}

export function loadJourney(): JourneyState {
  if (typeof window === "undefined") return createDefaultJourney();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return createDefaultJourney();
    return { ...createDefaultJourney(), ...(JSON.parse(raw) as JourneyState) };
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
  const sessions = state.sessions.map((session) => {
    if (session.sessionId === completedId) {
      return { ...session, status: "completed" as const };
    }
    if (session.sessionId === completedId + 1 && session.status === "locked") {
      return { ...session, status: "open" as const };
    }
    return session;
  });
  return { ...state, sessions };
}
