import type {
  DataSource,
  Insight,
  InterviewItem,
  OutboxDraft,
  StudioState,
  TwinConfig,
} from "@/lib/types";

const STORAGE_KEY = "isoml.studio.state.v1";

export const DEFAULT_TWIN: TwinConfig = {
  displayName: "",
  tone: "warm",
  vocabulary: "",
  humor: "",
  formality: "balanced",
  responseLength: "medium",
  favoriteExpressions: [],
  approvedMemories: [],
  topicsToAvoid: [],
  privateKnowledge: "",
  publicKnowledge: "",
  robotExpression: "subtle head tilts when curious; soft nods when agreeing",
};

const SEED_INTERVIEWS: InterviewItem[] = [
  {
    id: "iv-life",
    category: "Life experiences",
    question: "What chapter of your life shaped how you show up for others?",
    answer: "",
    lesson: "",
    status: "open",
  },
  {
    id: "iv-style",
    category: "Communication style",
    question: "Do you lead with stories, questions, or direct answers?",
    answer: "",
    lesson: "",
    status: "open",
  },
  {
    id: "iv-humor",
    category: "Humor",
    question: "How does your humor usually land — dry, playful, absurd?",
    answer: "",
    lesson: "",
    status: "open",
  },
  {
    id: "iv-values",
    category: "Values & preferences",
    question: "Which preference should your twin never override?",
    answer: "",
    lesson: "",
    status: "open",
  },
  {
    id: "iv-decisions",
    category: "Decision-making",
    question: "When you decide quickly, what are you usually optimizing for?",
    answer: "",
    lesson: "",
    status: "open",
  },
  {
    id: "iv-boundaries",
    category: "Boundaries",
    question: "What topics should stay private even if someone asks?",
    answer: "",
    lesson: "",
    status: "open",
  },
  {
    id: "iv-social",
    category: "Friends / family / coworkers",
    question: "How does your tone shift across friends, family, and work?",
    answer: "",
    lesson: "",
    status: "open",
  },
];

const SEED_INSIGHTS: Insight[] = [
  {
    id: "ins-1",
    kind: "preference",
    text: "Prefers draft-only automation until explicitly trusted.",
    sourceIds: [],
    decision: "pending",
  },
  {
    id: "ins-2",
    kind: "uncertain",
    text: "Humor style may be dry — needs confirmation from interview answers.",
    sourceIds: [],
    decision: "pending",
  },
];

export function createDefaultStudioState(): StudioState {
  return {
    twin: { ...DEFAULT_TWIN },
    sources: [],
    interviews: SEED_INTERVIEWS.map((item) => ({ ...item })),
    insights: SEED_INSIGHTS.map((item) => ({ ...item })),
    outboxMode: "draft-only",
    outbox: [],
    robot: {
      connection: "disconnected",
      selectedPersonality: "",
      nfcHat: "planned",
      notes: "",
    },
    updatedAt: new Date().toISOString(),
  };
}

export function loadStudioState(): StudioState {
  if (typeof window === "undefined") return createDefaultStudioState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultStudioState();
    const parsed = JSON.parse(raw) as StudioState;
    return {
      ...createDefaultStudioState(),
      ...parsed,
      twin: { ...DEFAULT_TWIN, ...parsed.twin },
      robot: {
        ...createDefaultStudioState().robot,
        ...parsed.robot,
        connection:
          parsed.robot?.connection === "disconnected" ||
          parsed.robot?.connection === "unavailable" ||
          parsed.robot?.connection === "planned"
            ? parsed.robot.connection
            : "disconnected",
      },
    };
  } catch {
    return createDefaultStudioState();
  }
}

export function saveStudioState(state: StudioState): StudioState {
  const next = { ...state, updatedAt: new Date().toISOString() };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function resetStudioState(): StudioState {
  const next = createDefaultStudioState();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function createSource(partial: {
  title: string;
  type: DataSource["type"];
  preview: string;
  origin?: string;
}): DataSource {
  return {
    id: crypto.randomUUID(),
    title: partial.title,
    type: partial.type,
    origin: partial.origin || "manual",
    date: new Date().toISOString(),
    status: "ready",
    permissions: "read for twin training with approval",
    approvedForTwin: false,
    preview: partial.preview.slice(0, 2000),
  };
}

export function createOutboxDraft(partial: {
  channel: OutboxDraft["channel"];
  recipient: string;
  body: string;
}): OutboxDraft {
  return {
    id: crypto.randomUUID(),
    channel: partial.channel,
    recipient: partial.recipient,
    body: partial.body,
    status: "draft",
    createdAt: new Date().toISOString(),
  };
}

export const MAX_UPLOAD_CHARS = 40_000;
export const MAX_UPLOAD_BYTES = 200_000;
