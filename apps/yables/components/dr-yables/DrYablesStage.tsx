"use client";

import type { DrYablesEmotion } from "@ohya/ai";
import { DrYablesAvatar } from "@/components/dr-yables/DrYablesAvatar";

/** Back-compat wrapper used by homepage and older imports. */
export function DrYablesStage({
  emotion = "idle",
  className = "",
  prefer2d = false,
  captions,
  speakingAmplitude,
}: {
  emotion?: DrYablesEmotion;
  className?: string;
  prefer2d?: boolean;
  captions?: string;
  speakingAmplitude?: number;
}) {
  return (
    <DrYablesAvatar
      emotion={emotion}
      className={className}
      prefer2d={prefer2d}
      captions={captions}
      speakingAmplitude={speakingAmplitude}
    />
  );
}
