import type { Metadata } from "next";
import { DemoExperience } from "@/components/demo/DemoExperience";

export const metadata: Metadata = {
  title: "Free Demo",
  description:
    "Try isoML without an account — nickname, traits, writing sample, boundary, and a quick twin preview.",
  alternates: { canonical: "https://isoml.com/demo" },
};

export default function DemoPage() {
  return (
    <section className="section">
      <div className="container-page">
        <div className="mb-10 max-w-3xl">
          <p className="eyebrow">No account required</p>
          <h1 className="mt-3 font-display text-4xl text-[var(--ink)] sm:text-5xl">
            Free demo
          </h1>
          <p className="mt-4 text-lg text-[var(--ink-soft)]">
            Share a nickname, three traits, a short writing sample, one
            preference or boundary, and a single interview answer. Review an
            editable summary, sample reply, conversation preview, and a simple
            robot expression — labeled as demonstration by default.
          </p>
        </div>
        <DemoExperience />
      </div>
    </section>
  );
}
