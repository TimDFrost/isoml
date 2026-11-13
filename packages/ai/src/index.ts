import type { PersonalityProfile, SessionDefinition } from "@ohya/identity-schema";

export type DrYablesEmotion =
  | "idle"
  | "listening"
  | "thinking"
  | "speaking"
  | "happy"
  | "curious"
  | "surprised";

export const DR_YABLES_SAFETY = [
  "You are Dr. Yables, an AI autobiographical interviewer — not a licensed psychologist or therapist.",
  "Use open-ended, non-leading questions. Never coerce sensitive disclosure.",
  "Reflective listening is welcome; clinical diagnoses are forbidden.",
  "Confirm interpretations before treating them as profile facts.",
  "Customers may skip, decline, or end anytime — honor that immediately.",
].join("\n");

export function buildSessionSystemPrompt(session: SessionDefinition): string {
  return [
    DR_YABLES_SAFETY,
    `Current session ${session.id}: ${session.title}.`,
    `Focus: ${session.focus}`,
    "Ask one meaningful question at a time. Prefer concrete examples.",
    "Keep the tone like a charming first date crossed with a thoughtful documentary interview.",
  ].join("\n");
}

export function buildTwinSystemPrompt(profile: PersonalityProfile): string {
  const approved = profile.memories.filter((m) => m.approved);
  return [
    `You are an AI twin inspired by "${profile.displayName || "the customer"}".`,
    "Never claim to be the human. Identify as an AI representation.",
    "Use only approved profile material. Acknowledge gaps.",
    "",
    `Summary: ${profile.summary || "(none)"}`,
    `Traits: ${profile.traits.join("; ") || "(none)"}`,
    `Values: ${profile.values.join("; ") || "(none)"}`,
    `Humor: ${profile.humor.join("; ") || "(none)"}`,
    `Speaking style: ${profile.speakingStyle || "(none)"}`,
    `AI instructions: ${profile.aiInstructions.join(" | ")}`,
    `Approved memories: ${approved.map((m) => m.text).join(" || ") || "(none)"}`,
  ].join("\n");
}

export function localInterviewReply(input: {
  session: SessionDefinition;
  userMessage: string;
  turn: number;
}): { reply: string; emotion: DrYablesEmotion; candidateInsight?: string } {
  const message = input.userMessage.trim();
  if (!message) {
    return {
      reply: "Whenever you're ready — what would you like to share first?",
      emotion: "curious",
    };
  }

  const starters = [
    "That's a vivid detail. Can you give me one concrete example?",
    "I'm listening. What felt most true about that moment?",
    "Interesting — what did you do next?",
    "If a close friend told that story about you, what would they emphasize?",
  ];

  return {
    reply: [
      `Thank you — noted for Session ${input.session.id}: ${input.session.title}.`,
      starters[input.turn % starters.length],
      "(Demonstration reply — live model activates when LLM keys are configured server-side.)",
    ].join(" "),
    emotion: input.turn % 2 === 0 ? "listening" : "thinking",
    candidateInsight: message.slice(0, 160),
  };
}

export function synthesizeProfileDraft(input: {
  displayName: string;
  notes: string[];
  completedSessions: number[];
}): PersonalityProfile {
  const now = new Date().toISOString();
  const memories = input.notes.filter(Boolean).map((text, index) => ({
    id: `mem-${index + 1}`,
    text,
    kind: "self-report" as const,
    sourceRefs: [`session-note-${index + 1}`],
    approved: false,
    confidenceNote: "Candidate insight — awaiting your confirmation.",
  }));

  return {
    id: crypto.randomUUID(),
    userId: "local-guest",
    version: 1,
    displayName: input.displayName || "You",
    summary:
      memories.length > 0
        ? `${input.displayName || "You"} shared ${memories.length} notes across ${input.completedSessions.length} sessions. Review and approve before anything becomes lasting twin material.`
        : "Your Profile will fill in as you complete sessions and approve insights.",
    timeline: input.completedSessions.map((id) => `Completed session ${id}`),
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
    ],
    privacyBoundaries: [
      {
        id: "no-clinical",
        label: "No clinical diagnoses",
        description: "Do not invent medical or psychiatric conclusions.",
        enforced: true,
      },
    ],
    memories,
    completedSessions: input.completedSessions,
    createdAt: now,
    updatedAt: now,
  };
}
