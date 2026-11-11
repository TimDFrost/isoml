"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { REACHY_BUY_URL } from "@/lib/config";

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/studio")) return null;

  return (
    <footer className="border-t border-[var(--line)] bg-[color-mix(in_srgb,var(--offwhite-deep)_80%,white)]">
      <div className="container-page grid gap-8 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl text-[var(--ink)]">isoML</p>
          <p className="mt-2 max-w-md text-sm text-[var(--ink-muted)]">
            in search of Machine Learning — collect, understand, and configure a
            digital twin that can power Reachy Mini.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--ink)]">Explore</p>
          <ul className="mt-3 space-y-2 text-sm text-[var(--ink-muted)]">
            <li>
              <Link href="/demo">Free Demo</Link>
            </li>
            <li>
              <Link href="/studio">Private Studio</Link>
            </li>
            <li>
              <Link href="/schedule">Schedule a Demo</Link>
            </li>
            <li>
              <Link href="/early-access">Request early access</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--ink)]">Hardware</p>
          <ul className="mt-3 space-y-2 text-sm text-[var(--ink-muted)]">
            <li>
              <a href={REACHY_BUY_URL} target="_blank" rel="noopener noreferrer">
                Buy Reachy Mini
              </a>
            </li>
            <li>
              <Link href="/privacy">Privacy</Link>
            </li>
            <li>
              <Link href="/terms">Terms</Link>
            </li>
          </ul>
          <p className="mt-4 text-xs text-[var(--ink-muted)]">
            Hardware is sold separately by Pollen Robotics. isoML is not an
            official reseller or partner program.
          </p>
        </div>
      </div>
      <div className="border-t border-[var(--line)]">
        <div className="container-page flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[var(--ink-soft)]">
            isoML, a subsidiary of Oh Ya Inc, est. 2024
          </p>
          <p className="text-xs text-[var(--ink-muted)]">isoml.com</p>
        </div>
      </div>
    </footer>
  );
}
