"use client";

import dynamic from "next/dynamic";
import type { DrYablesEmotion } from "@ohya/ai";
import { DrYablesFallback2D } from "@/components/dr-yables/DrYablesFallback2D";

const DrYablesCanvas = dynamic(
  () => import("@/components/dr-yables/DrYablesCanvas").then((m) => m.DrYablesCanvas),
  { ssr: false, loading: () => <DrYablesFallback2D emotion="idle" /> },
);

export type DrYablesAvatarProps = {
  emotion?: DrYablesEmotion;
  speakingAmplitude?: number;
  captions?: string;
  prefer2d?: boolean;
  className?: string;
};

/**
 * Reusable interviewer avatar for homepage, sessions, profile, and demos.
 * Rendering stays decoupled from DB/payment systems.
 */
export function DrYablesAvatar({
  emotion = "idle",
  speakingAmplitude = 0,
  captions,
  prefer2d = false,
  className = "",
}: DrYablesAvatarProps) {
  return (
    <div className={className}>
      {prefer2d ? (
        <DrYablesFallback2D emotion={emotion} />
      ) : (
        <DrYablesCanvas emotion={emotion} speakingAmplitude={speakingAmplitude} />
      )}
      {captions ? (
        <p
          className="mt-3 rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3 text-sm text-[var(--charcoal)]"
          aria-live="polite"
        >
          <span className="font-semibold text-[var(--burgundy)]">Dr. Yables: </span>
          {captions}
        </p>
      ) : null}
    </div>
  );
}
