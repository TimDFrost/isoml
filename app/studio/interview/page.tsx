"use client";

import { useStudio } from "@/components/studio/StudioProvider";

export default function StudioInterviewPage() {
  const { state, setState, persist } = useStudio();

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Interview</p>
        <h1 className="mt-2 font-display text-3xl text-[var(--ink)]">Guided sittings</h1>
        <p className="mt-3 max-w-2xl text-[var(--ink-soft)]">
          Cover life experiences, communication style, humor, values, decisions,
          boundaries, and how you show up with friends, family, and coworkers.
          Skip, edit, and approve lessons before they stick.
        </p>
      </div>

      <div className="space-y-4">
        {state.interviews.map((item) => (
          <div key={item.id} className="panel space-y-3 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="badge-soft">{item.category}</span>
              <span className="text-xs uppercase tracking-[0.14em] text-[var(--ink-muted)]">
                {item.status}
              </span>
            </div>
            <h2 className="font-display text-xl text-[var(--ink)]">{item.question}</h2>
            <label>
              <span className="label">Your answer</span>
              <textarea
                className="field min-h-24"
                value={item.answer}
                onChange={(e) =>
                  setState((prev) => ({
                    ...prev,
                    interviews: prev.interviews.map((row) =>
                      row.id === item.id ? { ...row, answer: e.target.value } : row,
                    ),
                  }))
                }
              />
            </label>
            <label>
              <span className="label">Lesson draft (editable)</span>
              <textarea
                className="field min-h-20"
                value={item.lesson}
                onChange={(e) =>
                  setState((prev) => ({
                    ...prev,
                    interviews: prev.interviews.map((row) =>
                      row.id === item.id ? { ...row, lesson: e.target.value } : row,
                    ),
                  }))
                }
                placeholder="What should the twin learn from this?"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-primary px-4 py-2 text-sm"
                onClick={() =>
                  setState((prev) => ({
                    ...prev,
                    interviews: prev.interviews.map((row) =>
                      row.id === item.id
                        ? {
                            ...row,
                            status: "approved",
                            lesson:
                              row.lesson ||
                              row.answer.slice(0, 180) ||
                              "Approved without extra lesson text.",
                          }
                        : row,
                    ),
                    twin: {
                      ...prev.twin,
                      approvedMemories: Array.from(
                        new Set([
                          ...prev.twin.approvedMemories,
                          ...(item.answer.trim()
                            ? [item.answer.trim().slice(0, 160)]
                            : []),
                        ]),
                      ).slice(0, 20),
                    },
                  }))
                }
              >
                Approve lesson
              </button>
              <button
                type="button"
                className="btn btn-secondary px-4 py-2 text-sm"
                onClick={() =>
                  setState((prev) => ({
                    ...prev,
                    interviews: prev.interviews.map((row) =>
                      row.id === item.id ? { ...row, status: "skipped" } : row,
                    ),
                  }))
                }
              >
                Skip
              </button>
            </div>
          </div>
        ))}
      </div>

      <button type="button" className="btn btn-secondary" onClick={persist}>
        Save interview progress locally
      </button>
    </div>
  );
}
