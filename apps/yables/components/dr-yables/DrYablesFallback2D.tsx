"use client";

import type { DrYablesEmotion } from "@ohya/ai";

const faces: Record<DrYablesEmotion, string> = {
  idle: "◡̈",
  greeting: "◕‿◕",
  listening: "◉ ◉",
  thinking: "◔ ◔",
  speaking: "◡ᴗ◡",
  amused: "ᵔᴥᵔ",
  curious: "⊙‿⊙",
  surprised: "◉_◉",
  celebrating: "★‿★",
  resting: "-_-",
  happy: "◕‿◕",
};

export function DrYablesFallback2D({ emotion }: { emotion: DrYablesEmotion }) {
  return (
    <div className="panel flex aspect-[4/5] max-h-[560px] flex-col items-center justify-center bg-[linear-gradient(160deg,#fffdf8,#f3d5c4)] p-6">
      <div className="animate-drift flex h-44 w-44 flex-col items-center justify-center rounded-[2rem] bg-white shadow-[var(--shadow)]">
        <div className="mb-2 text-xs font-semibold tracking-[0.14em] text-[var(--burgundy)] uppercase">
          Dr. Yables
        </div>
        <div className="text-3xl text-[var(--charcoal)]">{faces[emotion]}</div>
        <div className="mt-2 text-[10px] text-[var(--ink-muted)]">spectacles · mustache · tweed</div>
      </div>
      <p className="mt-4 text-center text-sm text-[var(--charcoal-soft)]">
        2D fallback active. AI autobiographical interviewer — not a licensed therapist.
      </p>
    </div>
  );
}
