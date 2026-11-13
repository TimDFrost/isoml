"use client";

import dynamic from "next/dynamic";
import type { DrYablesEmotion } from "@ohya/ai";
import { DrYablesFallback2D } from "@/components/dr-yables/DrYablesFallback2D";

const DrYablesCanvas = dynamic(
  () =>
    import("@/components/dr-yables/DrYablesCanvas").then((mod) => mod.DrYablesCanvas),
  {
    ssr: false,
    loading: () => <DrYablesFallback2D emotion="idle" />,
  },
);

type Props = {
  emotion?: DrYablesEmotion;
  className?: string;
  prefer2d?: boolean;
};

/**
 * Production-ready animation interface for Dr. Yables.
 * Uses a labeled procedural 3D placeholder until a rigged GLB is supplied.
 */
export function DrYablesStage({
  emotion = "idle",
  className = "",
  prefer2d = false,
}: Props) {
  if (prefer2d) {
    return (
      <div className={className}>
        <DrYablesFallback2D emotion={emotion} />
      </div>
    );
  }

  return (
    <div className={className}>
      <DrYablesCanvas emotion={emotion} />
      <p className="mt-2 text-center text-xs text-[var(--ink-muted)]">
        Placeholder rigged character — swap in official GLB when available. Animation
        API already supports idle, listen, think, speak, happy, curious, surprised.
      </p>
    </div>
  );
}
