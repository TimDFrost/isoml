/** Pub/sub bus — decouple auth, gamify, voting, fan-lounge for future backend sync */
const listeners = new Map();

export const Events = {
  USER_SIGNED_IN: "user:signed-in",
  USER_SIGNED_OUT: "user:signed-out",
  USER_UPDATED: "user:updated",
  XP_AWARDED: "gamify:xp-awarded",
  LEVEL_UP: "gamify:level-up",
  BADGE_EARNED: "gamify:badge-earned",
  VOTE_CAST: "vote:cast",
  POST_CREATED: "fan:post-created",
  COMMENT_CREATED: "fan:comment-created",
  FEED_UPDATED: "fan:feed-updated",
  POST_FEATURED: "fan:post-featured",
  POST_YOUTUBE_QUEUED: "fan:post-youtube-queued",
  POST_YOUTUBE_PUBLISHED: "fan:post-youtube-published",
  WEEKLY_FUNNIEST_CROWNED: "fan:weekly-funniest-crowned",
  CHECKOUT_INTENT: "checkout:intent",
  CHECKOUT_COMPLETE: "checkout:complete",
  PREORDER_PLACED: "preorder:placed",
};

export function on(event, handler) {
  if (!listeners.has(event)) listeners.set(event, new Set());
  listeners.get(event).add(handler);
  return () => listeners.get(event)?.delete(handler);
}

export function emit(event, payload) {
  listeners.get(event)?.forEach((fn) => {
    try {
      fn(payload);
    } catch (err) {
      console.error(`[events] ${event}`, err);
    }
  });
}
