import type { AvatarBehavior, DrYablesEmotion } from "@ohya/ai";

/**
 * Shared abstract behavior contract for the web avatar now,
 * and a future Reachy Mini adapter (official SDK only — no invented APIs).
 */
export type WebAvatarBehavior = AvatarBehavior & {
  getEmotion(): DrYablesEmotion;
};

export function createWebAvatarBehavior(handlers: {
  speak: (text: string) => Promise<void> | void;
  listen: () => void;
  setEmotion: (emotion: DrYablesEmotion) => void;
  stop: () => void;
  getEmotion: () => DrYablesEmotion;
}): WebAvatarBehavior {
  return {
    speak: handlers.speak,
    listen: handlers.listen,
    setEmotion: handlers.setEmotion,
    lookAt: (_target: string) => {
      // Web avatar uses subtle head/eye intent via emotion for now.
    },
    celebrate: () => handlers.setEmotion("celebrating"),
    stop: handlers.stop,
    getEmotion: handlers.getEmotion,
  };
}
