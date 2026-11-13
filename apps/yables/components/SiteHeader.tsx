"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/journey", label: "12 Sessions" },
  { href: "/interview/1", label: "Meet Dr. Yables" },
  { href: "/profile", label: "Your Profile" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--ivory)_88%,transparent)] backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="font-display text-2xl text-[var(--deep-red)]">
          Yables
        </Link>
        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                pathname === link.href || pathname.startsWith(`${link.href}/`)
                  ? "font-semibold text-[var(--burgundy)]"
                  : "text-[var(--charcoal-soft)]"
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:block">
          <Link href="/interview/1" className="btn btn-primary">
            Begin Session 1
          </Link>
        </div>
        <button
          type="button"
          className="md:hidden rounded-full border border-[var(--line)] px-3 py-2"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          Menu
        </button>
      </div>
      {open ? (
        <div className="border-t border-[var(--line)] bg-[var(--surface)] px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
            <Link href="/interview/1" className="btn btn-primary" onClick={() => setOpen(false)}>
              Begin Session 1
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
