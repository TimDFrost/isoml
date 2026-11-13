"use client";

import type { JourneyState, MemoryCandidate } from "@/lib/journey-storage";
import { saveJourney, setMemoryStatus } from "@/lib/journey-storage";

type ProfileReviewProps = {
  journey: JourneyState;
  onChange: (next: JourneyState) => void;
  sessionFilter?: number;
};

export function ProfileReview({ journey, onChange, sessionFilter }: ProfileReviewProps) {
  const items = journey.memoryCandidates.filter((item) =>
    sessionFilter ? item.sessionId === sessionFilter : true,
  );

  const update = (id: string, status: MemoryCandidate["status"]) => {
    const next = saveJourney(setMemoryStatus(journey, id, status));
    onChange(next);
  };

  if (items.length === 0) {
    return (
      <p className="text-sm text-[var(--ink-muted)]">
        Candidate memories appear here after you share answers. Nothing becomes a lasting
        personality fact until you approve it.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.id} className="rounded-2xl border border-[var(--line)] bg-white/70 p-3">
          <p className="text-sm text-[var(--charcoal)]">{item.text}</p>
          <p className="mt-1 text-xs text-[var(--ink-muted)]">
            Session {item.sessionId} · {item.status}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-primary px-3 py-1.5 text-xs"
              onClick={() => update(item.id, "approved")}
            >
              Approve
            </button>
            <button
              type="button"
              className="btn btn-secondary px-3 py-1.5 text-xs"
              onClick={() => update(item.id, "rejected")}
            >
              Reject
            </button>
            <button
              type="button"
              className="btn btn-secondary px-3 py-1.5 text-xs"
              onClick={() => update(item.id, "pending")}
            >
              Reset
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
