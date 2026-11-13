"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { IsoMlWordmark } from "@/components/brand/IsoMlWordmark";
import { StudioProvider, useStudio } from "@/components/studio/StudioProvider";
import { cn } from "@/lib/utils";

const navItems: Array<{ href: string; label: string; exact?: boolean }> = [
  { href: "/studio", label: "Overview", exact: true },
  { href: "/studio/data", label: "My Data" },
  { href: "/studio/interview", label: "Interview" },
  { href: "/studio/insights", label: "Insights" },
  { href: "/studio/builder", label: "Twin Builder" },
  { href: "/studio/playground", label: "Twin Playground" },
  { href: "/studio/reachy", label: "Reachy Mini" },
  { href: "/studio/outbox", label: "Outbox" },
];

function StudioChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { ready, persist, reset, status } = useStudio();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--navy)]">
      <div className="border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--navy)_90%,transparent)] backdrop-blur-md">
        <div className="mx-auto flex w-[min(1200px,calc(100%-1.5rem))] items-center justify-between gap-3 py-4">
          <div className="flex items-center gap-3">
            <Link href="/" aria-label="isoML home">
              <IsoMlWordmark size="sm" />
            </Link>
            <span className="badge-soft">Private studio preview</span>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <button type="button" className="btn btn-secondary px-4 py-2 text-sm" onClick={persist}>
              Save locally
            </button>
            <button type="button" className="btn btn-ghost px-4 py-2 text-sm" onClick={reset}>
              Reset
            </button>
          </div>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] lg:hidden"
            aria-label="Toggle studio navigation"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className="mx-auto grid w-[min(1200px,calc(100%-1.5rem))] gap-6 py-6 lg:grid-cols-[220px_1fr]">
        <aside
          className={cn(
            "panel h-fit p-3 lg:sticky lg:top-4",
            open ? "block" : "hidden lg:block",
          )}
        >
          <nav className="flex flex-col gap-1" aria-label="Studio">
            {navItems.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-[var(--radius-md)] px-3 py-2 text-sm transition",
                    active
                      ? "bg-[var(--accent-soft)] font-semibold text-[var(--jewel-teal)]"
                      : "text-[var(--ink-soft)] hover:bg-[var(--surface-soft)]",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-4 flex flex-col gap-2 sm:hidden">
            <button type="button" className="btn btn-secondary px-3 py-2 text-sm" onClick={persist}>
              Save locally
            </button>
            <button type="button" className="btn btn-ghost px-3 py-2 text-sm" onClick={reset}>
              Reset
            </button>
          </div>
        </aside>

        <div className="min-w-0 space-y-4">
          {!ready ? (
            <div className="panel p-8 text-[var(--ink-muted)]">Opening studio…</div>
          ) : (
            children
          )}
          {status ? (
            <p className="text-sm text-[var(--violet-deep)]" role="status">
              {status}
            </p>
          ) : null}
          <p className="text-xs text-[var(--ink-muted)]">
            Without a configured backend this studio is a synthetic local preview —
            not a secure multi-device vault.
          </p>
        </div>
      </div>
    </div>
  );
}

export function StudioShell({ children }: { children: React.ReactNode }) {
  return (
    <StudioProvider>
      <StudioChrome>{children}</StudioChrome>
    </StudioProvider>
  );
}
