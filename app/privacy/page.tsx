import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy",
  description: "isoML privacy practices for digital twin material and integrations.",
  alternates: { canonical: "https://isoml.com/privacy" },
};

export default function PrivacyPage() {
  return (
    <section className="section">
      <div className="container-page max-w-3xl space-y-6">
        <p className="eyebrow">Legal</p>
        <h1 className="font-display text-4xl text-[var(--ink)]">Privacy</h1>
        <p className="text-[var(--ink-soft)]">
          isoML separates private vs public avatar material, keeps credentials
          server-side, and aims to exclude personal contents from routine logs.
          Export and deletion controls are part of the studio design.
        </p>
        <ul className="space-y-3 text-[var(--ink-soft)]">
          <li>Live AI uses approved material only when a model is configured.</li>
          <li>External providers are disclosed when used; opt-in for secondary training.</li>
          <li>Voice replication requires separate consent.</li>
          <li>AI representations are labeled as such.</li>
          <li>
            Without a configured backend, studio data stays in your browser as a
            synthetic preview — not a secure vault claim.
          </li>
        </ul>
        <p className="text-sm text-[var(--ink-muted)]">
          Questions: <a href="mailto:privacy@isoml.com">privacy@isoml.com</a>
        </p>
        <Link href="/" className="btn btn-secondary inline-flex">
          Back home
        </Link>
      </div>
    </section>
  );
}
