import Link from "next/link";
import { IsoMlWordmark } from "@/components/brand/IsoMlWordmark";
import { TeachTwinVisual } from "@/components/brand/TeachTwinVisual";
import { InteractiveTeachPreview } from "@/components/home/InteractiveTeachPreview";
import { REACHY_BUY_URL } from "@/lib/config";

const journey = [
  {
    title: "Collect",
    copy: "Bring stories, writing samples, preferences, and selected files into one place.",
  },
  {
    title: "Understand",
    copy: "Review proposed insights with source links — approve, correct, or reject.",
  },
  {
    title: "Configure",
    copy: "Shape tone, vocabulary, humor, boundaries, and what stays private.",
  },
  {
    title: "Test",
    copy: "Chat with your twin, correct misses, and decide what becomes lasting.",
  },
  {
    title: "Connect",
    copy: "When ready, connect an approved personality to Reachy Mini.",
  },
] as const;

const materials = [
  "Journals and personal stories",
  "Writing samples and essays",
  "Resumes and work examples",
  "Message exports you choose to share",
  "Preferences, facts, and hard boundaries",
];

const privacyPoints = [
  "Separate private vs public avatar material",
  "Per-source permissions independent from action permissions",
  "Export and deletion controls",
  "Server-side credentials only — never in the browser",
  "Opt-in for any secondary training use",
  "Voice replication requires separate consent",
];

const faqs = [
  {
    q: "Is the twin a perfect copy of me?",
    a: "No. isoML presents an evolving AI representation shaped by what you teach and approve — not a perfect copy of anyone’s mind.",
  },
  {
    q: "Do I need a Reachy Mini to start?",
    a: "No. Start with the free demo or studio. Hardware purchase is separate through Pollen Robotics.",
  },
  {
    q: "Will isoML auto-send messages for me?",
    a: "Outbox defaults to Draft only. Ask-before-sending and rule-based handling are explicit modes — never implied account takeover.",
  },
  {
    q: "What happens without API keys or hardware?",
    a: "The interface still works with synthetic previews and honest unavailable states. Live models and robot adapters activate only when configured.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="section-tight relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 jewel-dots opacity-40"
        />
        <div className="container-page relative grid items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className="animate-fade-rise space-y-6">
            <IsoMlWordmark size="hero" priority />
            <p className="eyebrow">Reachy Mini × You</p>
            <h1 className="font-display text-3xl leading-[1.08] text-[var(--chrome)] sm:text-4xl lg:text-5xl">
              Meet Your Other Self.
            </h1>
            <p className="font-display text-xl text-[var(--ink-soft)] sm:text-2xl">
              An AI twin. A robot personality. Unmistakably you.
            </p>
            <p className="max-w-xl text-lg text-[var(--ink-soft)]">
              Bring together your stories, voice, and preferences. Teach your
              digital twin how you think and communicate, then bring it to life
              with Reachy Mini.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link href="/demo" className="btn btn-primary">
                Try the Free Demo
              </Link>
              <Link href="/studio" className="btn btn-secondary">
                Build My Twin
              </Link>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-[var(--ink-muted)]">
              <Link href="/schedule" className="underline-offset-4 hover:underline">
                Schedule a Demo
              </Link>
              <a
                href={REACHY_BUY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 hover:underline"
              >
                Buy Reachy Mini
              </a>
            </div>
          </div>
          <div className="animate-fade-rise-delay animate-drift">
            <TeachTwinVisual className="h-auto w-full rounded-[1.5rem] shadow-[var(--shadow-soft)]" />
          </div>
        </div>
      </section>

      <section className="section" id="preview">
        <div className="container-page">
          <InteractiveTeachPreview />
        </div>
      </section>

      <section className="section studio-grid border-y border-[var(--line)]" id="journey">
        <div className="container-page">
          <div className="mb-10 max-w-2xl">
            <p className="eyebrow">The journey</p>
            <h2 className="mt-3 font-display text-3xl text-[var(--ink)] sm:text-4xl">
              Collect → Understand → Configure → Test → Connect
            </h2>
            <p className="mt-4 text-[var(--ink-soft)]">
              Five clear steps from personal material to an approved twin — and,
              when you choose, a robot personality.
            </p>
          </div>
          <ol className="grid gap-4 md:grid-cols-5">
            {journey.map((step, index) => (
              <li key={step.title} className="panel p-5">
                <p className="text-xs font-semibold tracking-[0.16em] text-[var(--electric)] uppercase">
                  0{index + 1}
                </p>
                <h3 className="mt-3 font-display text-xl text-[var(--ink)]">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm text-[var(--ink-muted)]">{step.copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" id="reachy">
        <div className="container-page panel overflow-hidden">
          <div className="grid gap-0 lg:grid-cols-2">
            <div className="space-y-4 p-8 sm:p-10">
              <p className="eyebrow">Flagship</p>
              <h2 className="font-display text-3xl text-[var(--ink)] sm:text-4xl">
                Reachy Mini × You
              </h2>
              <p className="text-[var(--ink-soft)]">
                Customers teach an AI representation of themselves through
                interviews, writing, stories, preferences, and selected files —
                then review, test, and eventually connect the approved
                personality to Reachy Mini.
              </p>
              <p className="text-sm text-[var(--ink-muted)]">
                Hardware is purchased separately. isoML does not claim an
                official partnership, reseller status, or bundled robot sale.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link href="/studio/reachy" className="btn btn-primary">
                  Open Reachy Mini setup
                </Link>
                <a
                  href={REACHY_BUY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                >
                  Buy Reachy Mini
                </a>
              </div>
            </div>
            <div className="border-t border-[var(--line)] bg-[var(--surface-soft)] p-8 sm:p-10 lg:border-l lg:border-t-0">
              <ul className="space-y-4 text-[var(--ink-soft)]">
                <li>Personality service stays separate from the hardware adapter</li>
                <li>No fake successful connections — status stays honest</li>
                <li>NFC hat assignment marked as planned until verified</li>
                <li>Voice and expression controls only where supported</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="materials">
        <div className="container-page grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="eyebrow">What you can contribute</p>
            <h2 className="mt-3 font-display text-3xl text-[var(--ink)] sm:text-4xl">
              Material that teaches how you think and communicate
            </h2>
            <p className="mt-4 text-[var(--ink-soft)]">
              You choose what enters the twin. No passwords. No claim of
              universal account access.
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {materials.map((item) => (
              <li key={item} className="panel px-5 py-4 text-[var(--ink-soft)]">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" id="studio">
        <div className="container-page">
          <div className="mb-8 max-w-2xl">
            <p className="eyebrow">Private studio</p>
            <h2 className="mt-3 font-display text-3xl text-[var(--ink)] sm:text-4xl">
              A calm workspace for data, interviews, insights, and play
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Overview", "Progress, sources, twin config, robot status"],
              ["Twin Builder", "Tone, memories, boundaries, robot expression"],
              ["Playground", "Chat, corrections, lasting vs one-off fixes"],
            ].map(([title, copy]) => (
              <div key={title} className="panel p-6">
                <h3 className="font-display text-xl text-[var(--ink)]">{title}</h3>
                <p className="mt-3 text-sm text-[var(--ink-muted)]">{copy}</p>
              </div>
            ))}
          </div>
          <Link href="/studio" className="btn btn-primary mt-8">
            Enter the studio
          </Link>
        </div>
      </section>

      <section className="section studio-grid border-y border-[var(--line)]" id="privacy">
        <div className="container-page grid gap-8 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Privacy & control</p>
            <h2 className="mt-3 font-display text-3xl text-[var(--ink)] sm:text-4xl">
              Practical controls, not vague promises
            </h2>
            <p className="mt-4 text-[var(--ink-soft)]">
              Without a configured backend, studio features run as a synthetic
              local preview. We never claim a secure vault without real
              protections.
            </p>
          </div>
          <ul className="space-y-3">
            {privacyPoints.map((point) => (
              <li key={point} className="panel px-5 py-4 text-sm text-[var(--ink-soft)]">
                {point}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" id="faq">
        <div className="container-page max-w-3xl">
          <p className="eyebrow">FAQ</p>
          <h2 className="mt-3 font-display text-3xl text-[var(--ink)] sm:text-4xl">
            Straight answers
          </h2>
          <div className="mt-8 space-y-4">
            {faqs.map((item) => (
              <details key={item.q} className="panel group p-5">
                <summary className="cursor-pointer list-none font-display text-lg text-[var(--ink)]">
                  {item.q}
                </summary>
                <p className="mt-3 text-[var(--ink-soft)]">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <div className="panel relative overflow-hidden px-8 py-12 sm:px-12">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-8 -top-10 h-44 w-44 rounded-full bg-[var(--electric-soft)] blur-2xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-12 left-10 h-40 w-40 rounded-full bg-[var(--violet-soft)] blur-2xl"
            />
            <p className="eyebrow">Start today</p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl text-[var(--ink)] sm:text-4xl">
              Try the free demo, or schedule a deeper walkthrough.
            </h2>
            <p className="mt-4 max-w-xl text-[var(--ink-soft)]">
              Request early access where purchase isn&apos;t open yet. No invented
              prices, testimonials, or checkout flows.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/demo" className="btn btn-primary">
                Try the Free Demo
              </Link>
              <Link href="/schedule" className="btn btn-secondary">
                Schedule a Demo
              </Link>
              <Link href="/early-access" className="btn btn-ghost">
                Request early access
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
