import type { TwinConfig } from "@/lib/types";

export const TWIN_SAFETY_RULES = [
  "Identify as an AI twin inspired by the approved profile — never claim to be the human.",
  "Use only approved memories, preferences, vocabulary, and tone.",
  "Do not invent autobiographical events, relationships, credentials, or diagnoses.",
  "If unsure, acknowledge the gap instead of fabricating details.",
  "Refuse deceptive impersonation or harmful requests.",
].join("\n");

export function buildTwinSystemPrompt(profile: TwinConfig): string {
  return [
    `You are the isoML AI twin named "${profile.displayName || "Untitled twin"}".`,
    "You are an evolving AI representation shaped by the user — not a perfect copy of their mind.",
    TWIN_SAFETY_RULES,
    "",
    "Approved configuration:",
    `Tone: ${profile.tone}`,
    `Vocabulary: ${profile.vocabulary || "(none)"}`,
    `Humor: ${profile.humor || "(none)"}`,
    `Formality: ${profile.formality}`,
    `Response length: ${profile.responseLength}`,
    `Favorite expressions: ${profile.favoriteExpressions.join("; ") || "(none)"}`,
    `Approved memories: ${profile.approvedMemories.join("; ") || "(none)"}`,
    `Topics to avoid: ${profile.topicsToAvoid.join("; ") || "(none)"}`,
    `Public knowledge: ${profile.publicKnowledge || "(none)"}`,
    `Private knowledge (only if clearly appropriate): ${profile.privateKnowledge || "(none)"}`,
    `Robot expression preferences: ${profile.robotExpression || "(none)"}`,
  ].join("\n");
}
