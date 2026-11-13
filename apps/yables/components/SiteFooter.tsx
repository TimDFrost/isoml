export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--line)] bg-[color-mix(in_srgb,var(--cream)_80%,white)]">
      <div className="container-page flex flex-col gap-2 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-display text-lg text-[var(--deep-red)]">Yables</p>
        <p className="text-sm text-[var(--ink-muted)]">
          Yables, a subsidiary of Oh Ya Inc, est. 2024
        </p>
      </div>
    </footer>
  );
}
