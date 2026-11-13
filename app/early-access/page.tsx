import type { Metadata } from "next";
import { EarlyAccessForm } from "@/components/early-access/EarlyAccessForm";

export const metadata: Metadata = {
  title: "Request early access",
  description: "Request early access to isoML Reachy Mini × You.",
  alternates: { canonical: "https://isoml.com/early-access" },
};

export default function EarlyAccessPage() {
  return (
    <section className="section">
      <div className="container-page max-w-2xl">
        <p className="eyebrow">Commercial</p>
        <h1 className="mt-3 font-display text-4xl text-[var(--ink)]">
          Request early access
        </h1>
        <p className="mt-4 text-[var(--ink-soft)]">
          Reachy Mini × You is not presented with invented prices or checkout
          here. Join the list for studio previews and updates.
        </p>
        <div className="mt-8">
          <EarlyAccessForm />
        </div>
      </div>
    </section>
  );
}
