import type { DemoSession } from "@/lib/types";

export function emptyDemoSession(): DemoSession {
  return {
    nickname: "",
    traits: ["", "", ""],
    writingSample: "",
    preference: "",
    interviewAnswer: "",
    summary: "",
    sampleReply: "",
    conversation: [],
    robotMood: "curious",
    updatedAt: new Date().toISOString(),
  };
}

export function synthesizeDemo(session: DemoSession): DemoSession {
  const name = session.nickname.trim() || "Friend";
  const traits = session.traits.map((t) => t.trim()).filter(Boolean);
  const traitLine = traits.length
    ? traits.join(", ")
    : "curious, thoughtful, and clear";
  const preference =
    session.preference.trim() || "Keep private details private unless asked.";
  const writing = session.writingSample.trim();
  const interview =
    session.interviewAnswer.trim() ||
    "I care about showing up consistently for the people who matter.";

  const summary = [
    `${name} comes across as ${traitLine}.`,
    writing
      ? `Their writing suggests a voice that is ${inferVoice(writing)}.`
      : "Their writing voice is still light — more samples will sharpen the twin.",
    `Boundary / preference: ${preference}`,
    `From the interview: ${interview}`,
  ].join(" ");

  const sampleReply = [
    `Hey — I'm a demo twin inspired by ${name}, not the real person.`,
    traits[0]
      ? `I'd keep things ${traits[0].toLowerCase()} while staying honest about what I don't know.`
      : "I'd stay warm, direct, and careful with anything uncertain.",
    `If we were chatting, I'd honor this preference: ${preference}`,
  ].join(" ");

  const conversation = [
    {
      role: "user" as const,
      content: "How would you introduce yourself in a first meeting?",
    },
    {
      role: "assistant" as const,
      content: sampleReply,
    },
    {
      role: "user" as const,
      content: "What matters to you day to day?",
    },
    {
      role: "assistant" as const,
      content: `Based on the demo answers, I'd say: ${interview} I'm labeling this as scripted demonstration output until a live model is configured.`,
    },
  ];

  const robotMood = traits.some((t) => /warm|kind|friendly/i.test(t))
    ? "warm"
    : traits.some((t) => /focus|serious|direct/i.test(t))
      ? "focused"
      : "curious";

  return {
    ...session,
    summary,
    sampleReply,
    conversation,
    robotMood,
    updatedAt: new Date().toISOString(),
  };
}

function inferVoice(sample: string): string {
  if (sample.length > 280) return "expansive and story-forward";
  if (/!|\?/.test(sample)) return "expressive and conversational";
  if (sample.split(" ").length < 25) return "concise and punchy";
  return "measured and reflective";
}
