"use client";

import { useEffect, useState } from "react";

const beats = [
  {
    title: "Share a story",
    line: "You: My friends say I explain things with small stories before the point.",
  },
  {
    title: "Twin learns",
    line: "Twin draft: Prefer narrative lead-ins, then a clear takeaway.",
  },
  {
    title: "You approve",
    line: "You: Keep that — and never invent family details.",
  },
  {
    title: "Robot expression",
    line: "Reachy preview: slight head tilt while listening, then a soft nod.",
  },
];

export function InteractiveTeachPreview() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((value) => (value + 1) % beats.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="panel overflow-hidden">
      <div className="studio-grid border-b border-[var(--line)] px-6 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="eyebrow">Interactive preview</p>
            <h3 className="mt-1 font-display text-xl text-[var(--ink)]">
              Teaching your twin, step by step
            </h3>
          </div>
          <span className="badge-soft badge-demo">Demonstration</span>
        </div>
      </div>
      <div className="grid gap-0 md:grid-cols-[0.9fr_1.1fr]">
        <ol className="space-y-2 border-b border-[var(--line)] p-4 md:border-b-0 md:border-r">
          {beats.map((beat, beatIndex) => (
            <li key={beat.title}>
              <button
                type="button"
                className={`w-full rounded-[var(--radius-md)] px-3 py-3 text-left transition ${
                  beatIndex === index
                    ? "bg-[var(--violet-soft)] text-[var(--violet-deep)]"
                    : "text-[var(--ink-soft)] hover:bg-[var(--surface-soft)]"
                }`}
                onClick={() => setIndex(beatIndex)}
              >
                <span className="text-xs font-semibold tracking-[0.14em] uppercase">
                  0{beatIndex + 1}
                </span>
                <p className="mt-1 font-medium">{beat.title}</p>
              </button>
            </li>
          ))}
        </ol>
        <div className="flex min-h-[220px] flex-col justify-center p-6">
          <p className="text-sm text-[var(--ink-muted)]">Live scripted beat</p>
          <p className="mt-3 text-lg leading-relaxed text-[var(--ink)] animate-fade-rise" key={index}>
            {beats[index].line}
          </p>
          <p className="mt-6 text-sm text-[var(--ink-muted)]">
            This preview is synthetic. Your private studio keeps approvals in your
            control before anything becomes lasting twin behavior.
          </p>
        </div>
      </div>
    </div>
  );
}
