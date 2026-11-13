import Link from "next/link";
import { DrYablesStage } from "@/components/dr-yables/DrYablesStage";

export default function YablesHomePage() {
  return (
    <>
      <section className="py-12 sm:py-16">
        <div className="container-page grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <p className="eyebrow">Yables · Your Fables</p>
            <h1 className="font-display text-4xl text-[var(--charcoal)] sm:text-5xl lg:text-6xl">
              Discover Yourself.
            </h1>
            <p className="max-w-xl text-lg text-[var(--charcoal-soft)]">
              Meet Dr. Yables — a charming AI autobiographical interviewer. Complete
              all 12 free sessions, review Your Profile, and download it anytime.
              When you&apos;re ready to embody it, isoML brings you to life.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/interview/1" className="btn btn-primary">
                Start with Dr. Yables
              </Link>
              <Link href="/journey" className="btn btn-secondary">
                See the 12 sessions
              </Link>
            </div>
            <p className="text-sm text-[var(--ink-muted)]">
              Completely free through Session 12. No paywall on your own data.
            </p>
          </div>
          <DrYablesStage emotion="happy" className="animate-drift" />
        </div>
      </section>

      <section className="pb-16">
        <div className="container-page grid gap-4 md:grid-cols-3">
          {[
            ["Playful discovery", "A first-date energy with documentary depth — never a clinical exam."],
            ["12 free sessions", "Pause, resume, skip, and edit. Sensitive disclosure is never required."],
            ["Bring Yourself to Life", "Your free profile stays yours. isoML is the commercial twin activation."],
          ].map(([title, copy]) => (
            <div key={title} className="panel p-6">
              <h2 className="font-display text-2xl text-[var(--deep-red)]">{title}</h2>
              <p className="mt-3 text-[var(--charcoal-soft)]">{copy}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
