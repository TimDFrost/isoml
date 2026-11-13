import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms",
  description: "isoML terms of use.",
  alternates: { canonical: "https://isoml.com/terms" },
};

export default function TermsPage() {
  return (
    <section className="section">
      <div className="container-page max-w-3xl space-y-6">
        <p className="eyebrow">Legal</p>
        <h1 className="font-display text-4xl text-[var(--ink)]">Terms</h1>
        <p className="text-[var(--ink-soft)]">
          isoML provides software tools for collecting and configuring approved
          personal material into an AI twin representation. The twin is not a
          perfect copy of a person. Hardware such as Reachy Mini is sold
          separately by its manufacturer; isoML does not imply reseller status or
          bundled robot fulfillment unless explicitly stated.
        </p>
        <p className="text-[var(--ink-soft)]">
          Demo and studio previews may be synthetic. Do not upload secrets or
          content you are not authorized to share. Automation features default to
          draft-only and never imply automatic authorization of third-party
          accounts.
        </p>
        <Link href="/" className="btn btn-secondary inline-flex">
          Back home
        </Link>
      </div>
    </section>
  );
}
