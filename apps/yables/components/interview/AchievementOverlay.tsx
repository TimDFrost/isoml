"use client";

type AchievementOverlayProps = {
  open: boolean;
  sessionId: number;
  badge?: string;
  onClose: () => void;
};

export function AchievementOverlay({
  open,
  sessionId,
  badge,
  onClose,
}: AchievementOverlayProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(42,36,33,0.55)] p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="achievement-title"
    >
      <div className="panel max-w-md space-y-4 p-8 text-center motion-safe:animate-[yables-pop_420ms_ease]">
        <p className="eyebrow">Session {sessionId} complete</p>
        <h2 id="achievement-title" className="font-display text-3xl text-[var(--deep-red)]">
          {badge || "The Storyteller"}
        </h2>
        <p className="text-[var(--charcoal-soft)]">
          A new piece of your Personality Blueprint is ready. Review candidate memories before
          they become lasting facts.
        </p>
        <button type="button" className="btn btn-primary" onClick={onClose}>
          Continue
        </button>
      </div>
    </div>
  );
}
