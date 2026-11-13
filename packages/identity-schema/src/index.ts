export type MemoryKind = "self-report" | "user-confirmed" | "source-supported";

export type PrivacyBoundary = {
  id: string;
  label: string;
  description: string;
  enforced: boolean;
};

export type PersonalityMemory = {
  id: string;
  text: string;
  kind: MemoryKind;
  sourceRefs: string[];
  confidenceNote?: string;
  approved: boolean;
};

export type PersonalityProfile = {
  id: string;
  userId: string;
  version: number;
  displayName: string;
  summary: string;
  timeline: string[];
  values: string[];
  traits: string[];
  bigFive?: Record<string, number>;
  behavioralExamples: string[];
  relationshipPrefs: string[];
  creativeInterests: string[];
  humor: string[];
  vocabulary: string[];
  speakingStyle: string;
  aiInstructions: string[];
  privacyBoundaries: PrivacyBoundary[];
  memories: PersonalityMemory[];
  completedSessions: number[];
  createdAt: string;
  updatedAt: string;
};

export type InterviewSessionId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type SessionDefinition = {
  id: InterviewSessionId;
  act: 1 | 2 | 3;
  title: string;
  slug: string;
  intro: string;
  focus: string;
};

export const YABLES_SESSIONS: SessionDefinition[] = [
  {
    id: 1,
    act: 1,
    title: "First Impressions",
    slug: "first-impressions",
    intro: "A charming first hello — interests, tastes, humor, and how you introduce yourself.",
    focus: "Interests, favorite experiences, personal tastes, humor, introductions",
  },
  {
    id: 2,
    act: 1,
    title: "The Way You Think",
    slug: "the-way-you-think",
    intro: "Curiosity, reasoning, imagination, and how you decide.",
    focus: "Curiosity, reasoning, problem-solving, imagination, decision-making",
  },
  {
    id: 3,
    act: 1,
    title: "Your Personality",
    slug: "your-personality",
    intro: "Temperament — with an optional scored Big Five questionnaire.",
    focus: "Temperament and optional Big Five",
  },
  {
    id: 4,
    act: 1,
    title: "Where It Began",
    slug: "where-it-began",
    intro: "Origins, formative memories, and early influences — only what you choose to share.",
    focus: "Origins, childhood, family background, formative memories",
  },
  {
    id: 5,
    act: 2,
    title: "People & Relationships",
    slug: "people-relationships",
    intro: "Friendships, family, communication, and boundaries.",
    focus: "Friendships, love, family, communication, attachment, boundaries",
  },
  {
    id: 6,
    act: 2,
    title: "Turning Points",
    slug: "turning-points",
    intro: "Accomplishments, disappointments, and decisions that mattered.",
    focus: "Accomplishments, disappointments, decisions, failures, life events",
  },
  {
    id: 7,
    act: 2,
    title: "What Drives You",
    slug: "what-drives-you",
    intro: "Goals, values, motivations, and principles.",
    focus: "Goals, values, motivations, ambitions, principles",
  },
  {
    id: 8,
    act: 2,
    title: "The Real You",
    slug: "the-real-you",
    intro: "How you behave when things get practical, conflicted, or uncertain.",
    focus: "Practical situations, conflict, uncertainty",
  },
  {
    id: 9,
    act: 3,
    title: "Your Sense of Humor",
    slug: "sense-of-humor",
    intro: "Jokes, quirks, and what makes you laugh.",
    focus: "Humor, expressions, comic preferences, anecdotes",
  },
  {
    id: 10,
    act: 3,
    title: "Your Voice",
    slug: "your-voice",
    intro: "Vocabulary, speech habits, and optional authorized voice recordings.",
    focus: "Vocabulary, speech habits, communication style, optional voice",
  },
  {
    id: 11,
    act: 3,
    title: "Your Future Self",
    slug: "future-self",
    intro: "Aspirations and the identity you hope to grow into.",
    focus: "Aspirations, growth, future plans",
  },
  {
    id: 12,
    act: 3,
    title: "Meet Your Twin",
    slug: "meet-your-twin",
    intro: "Preview, correct, and authorize — then decide whether to bring yourself to life.",
    focus: "Preview, memory review, corrections, authorizations",
  },
];

export const ENTERTAINMENT_BADGES = [
  "The Storyteller",
  "The Inventor",
  "The Romantic",
  "The Philosopher",
  "The Adventurer",
  "The Comedian",
] as const;

export function emptyProfile(userId: string, displayName = ""): PersonalityProfile {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    userId,
    version: 1,
    displayName,
    summary: "",
    timeline: [],
    values: [],
    traits: [],
    behavioralExamples: [],
    relationshipPrefs: [],
    creativeInterests: [],
    humor: [],
    vocabulary: [],
    speakingStyle: "",
    aiInstructions: [
      "Identify as an AI representation inspired by the approved profile — never claim to be the human.",
      "Use only approved memories and preferences.",
      "Acknowledge uncertainty instead of inventing autobiography.",
    ],
    privacyBoundaries: [
      {
        id: "no-clinical",
        label: "No clinical diagnoses",
        description: "Do not invent medical or psychiatric conclusions.",
        enforced: true,
      },
    ],
    memories: [],
    completedSessions: [],
    createdAt: now,
    updatedAt: now,
  };
}
