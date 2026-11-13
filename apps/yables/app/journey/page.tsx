"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ENTERTAINMENT_BADGES, YABLES_SESSIONS } from "@ohya/identity-schema";
import { loadJourney, type JourneyState } from "@/lib/journey-storage";

export default function JourneyPage() {
  const [journey, setJourney] = useState<JourneyState | null>(null);

  useEffect(() => {
    setJourney(loadJourney());
  }, []);

  if (!journey) {
    return <div className="container-page py-16 text-[var(--ink-muted)]">Opening your map…</div>;
  }

  return (
    <section className="py-12">
      <div className="container-page">
        <p className="eyebrow">Gamified journey</p>
        <h1 className="mt-3 font-display text-4xl text-[var(--charcoal)]">
          Twelve sessions. Three acts. One you.
        </h1>
        <p className="mt-4 max-w-2xl text-[var(--charcoal-soft)]">
          Entertainment badges are playful labels — not formal psychological
          classifications. Finalize a session when you choose; nothing sensitive is
          required to progress.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {ENTERTAINMENT_BADGES.map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-[var(--line)] bg-white px-3 py-1 text-xs font-semibold text-[var(--burgundy)]"
            >
              {badge}
            </span>
          ))}
        </div>

        {[1, 2, 3].map((act) => (
          <div key={act} className="mt-10">
            <h2 className="font-display text-2xl text-[var(--deep-red)]">
              Act {act === 1 ? "I — Getting Acquainted" : act === 2 ? "II — Beneath the Surface" : "III — Becoming You"}
            </h2>
            <ol className="mt-4 grid gap-4 md:grid-cols-2">
              {YABLES_SESSIONS.filter((session) => session.act === act).map((session) => {
                const progress = journey.sessions.find((s) => s.sessionId === session.id);
                const locked = progress?.status === "locked";
                return (
                  <li key={session.id} className="panel p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold tracking-[0.14em] text-[var(--gold)] uppercase">
                          Session {session.id}
                        </p>
                        <h3 className="mt-2 font-display text-xl">{session.title}</h3>
                        <p className="mt-2 text-sm text-[var(--charcoal-soft)]">{session.intro}</p>
                      </div>
                      <span className="text-xs uppercase text-[var(--ink-muted)]">
                        {progress?.status ?? "locked"}
                      </span>
                    </div>
                    {locked ? (
                      <p className="mt-4 text-sm text-[var(--ink-muted)]">Complete the previous session to unlock.</p>
                    ) : (
                      <Link
                        href={`/interview/${session.id}`}
                        className="btn btn-primary mt-4 px-4 py-2 text-sm"
                      >
                        {progress?.status === "completed" ? "Revisit" : "Continue"}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        ))}
      </div>
    </section>
  );
}
