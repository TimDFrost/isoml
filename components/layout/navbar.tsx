"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/demo", label: "Free Demo" },
  { href: "/studio", label: "Studio" },
  { href: "/#journey", label: "Journey" },
  { href: "/#reachy", label: "Reachy Mini × You" },
  { href: "/schedule", label: "Schedule" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const hideChrome = pathname.startsWith("/studio");

  if (hideChrome) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--offwhite)_88%,transparent)] backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--violet),var(--electric))] text-sm font-bold text-white">
            i
          </span>
          <span className="font-display text-xl text-[var(--ink)]">isoML</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm transition-colors",
                pathname === link.href || pathname.startsWith(`${link.href}/`)
                  ? "font-semibold text-[var(--violet-deep)]"
                  : "text-[var(--ink-soft)] hover:text-[var(--violet)]",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/demo" className="btn btn-secondary px-4 py-2 text-sm">
            Try the Free Demo
          </Link>
          <Link href="/studio" className="btn btn-primary px-4 py-2 text-sm">
            Build My Twin
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div
          id="mobile-nav"
          className="border-t border-[var(--line)] bg-[var(--surface)] px-4 py-4 md:hidden"
        >
          <nav className="flex flex-col gap-3" aria-label="Mobile">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-1 text-[var(--ink-soft)]"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/demo"
              className="btn btn-secondary mt-2"
              onClick={() => setOpen(false)}
            >
              Try the Free Demo
            </Link>
            <Link
              href="/studio"
              className="btn btn-primary"
              onClick={() => setOpen(false)}
            >
              Build My Twin
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
