import type { Metadata } from "next";
import Link from "next/link";
import { getBookingUrl } from "@/lib/config";

export const metadata: Metadata = {
  title: "Schedule a Demo",
  description: "Schedule an isoML walkthrough when booking is configured.",
  alternates: { canonical: "https://isoml.com/schedule" },
};

export default function SchedulePage() {
  const bookingUrl = getBookingUrl();

  return (
    <section className="section">
      <div className="container-page max-w-2xl">
        <p className="eyebrow">Schedule a Demo</p>
        <h1 className="mt-3 font-display text-4xl text-[var(--ink)]">
          Talk through Reachy Mini × You
        </h1>
        {bookingUrl ? (
          <div className="panel mt-8 space-y-4 p-6">
            <p className="text-[var(--ink-soft)]">
              Booking is configured for this environment. Continue to the
              scheduling page to pick a time.
            </p>
            <a href={bookingUrl} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
              Open scheduling
            </a>
          </div>
        ) : (
          <div className="panel mt-8 space-y-4 p-6">
            <span className="badge-soft badge-warn">Unavailable</span>
            <p className="text-[var(--ink-soft)]">
              Scheduling is not configured yet. Set{" "}
              <code>NEXT_PUBLIC_BOOKING_URL</code> in the environment to enable
              booking. Meanwhile, request early access or try the free demo.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/early-access" className="btn btn-primary">
                Request early access
              </Link>
              <Link href="/demo" className="btn btn-secondary">
                Try the Free Demo
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
