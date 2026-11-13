"use client";

import { useStudio } from "@/components/studio/StudioProvider";
import type { InsightKind } from "@/lib/types";

const labels: Record<InsightKind, string> = {
  "stated-fact": "User-stated fact",
  preference: "Preference",
  "inferred-pattern": "Inferred pattern",
  uncertain: "Uncertain / conflicting",
};

export default function StudioInsightsPage() {
  const { state, setState, persist, setStatus } = useStudio();

  const deriveFromSources = () => {
    const derived = state.sources
      .filter((source) => source.approvedForTwin)
      .slice(0, 5)
      .map((source) => ({
        id: crypto.randomUUID(),
        kind: "inferred-pattern" as const,
        text: `From “${source.title}”: possible pattern worth review — ${source.preview.slice(0, 120)}`,
        sourceIds: [source.id],
        decision: "pending" as const,
      }));

    if (derived.length === 0) {
      setStatus("Approve at least one source before deriving insights.");
      return;
    }

    setState((prev) => ({
      ...prev,
      insights: [...derived, ...prev.insights],
    }));
    setStatus("Proposed insights added with source links. No accuracy scores claimed.");
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Insights</p>
        <h1 className="mt-2 font-display text-3xl text-[var(--ink)]">Review what the system thinks it learned</h1>
        <p className="mt-3 max-w-2xl text-[var(--ink-soft)]">
          Proposed insights stay separated by kind. Approve, correct, or reject.
          No unsupported diagnoses. No fake accuracy percentages.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" className="btn btn-primary" onClick={deriveFromSources}>
          Propose from approved sources
        </button>
        <button type="button" className="btn btn-secondary" onClick={persist}>
          Save locally
        </button>
      </div>

      {state.insights.length === 0 ? (
        <div className="panel p-6 text-[var(--ink-muted)]">
          No insights yet. Next action: approve sources or complete interview answers,
          then propose insights.
        </div>
      ) : (
        <div className="space-y-4">
          {state.insights.map((insight) => (
            <div key={insight.id} className="panel space-y-3 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge-soft">{labels[insight.kind]}</span>
                <span className="text-xs text-[var(--ink-muted)]">{insight.decision}</span>
              </div>
              <p className="text-[var(--ink)]">{insight.text}</p>
              <p className="text-xs text-[var(--ink-muted)]">
                Sources:{" "}
                {insight.sourceIds.length
                  ? insight.sourceIds
                      .map(
                        (id) =>
                          state.sources.find((source) => source.id === id)?.title || id,
                      )
                      .join(", ")
                  : "manual / interview seed"}
              </p>
              <label>
                <span className="label">Correction</span>
                <input
                  className="field"
                  value={insight.correction || ""}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      insights: prev.insights.map((row) =>
                        row.id === insight.id
                          ? { ...row, correction: e.target.value }
                          : row,
                      ),
                    }))
                  }
                  placeholder="Optional correction text"
                />
              </label>
              <div className="flex flex-wrap gap-2">
                {(["approved", "corrected", "rejected"] as const).map((decision) => (
                  <button
                    key={decision}
                    type="button"
                    className="btn btn-secondary px-3 py-2 text-sm"
                    onClick={() =>
                      setState((prev) => ({
                        ...prev,
                        insights: prev.insights.map((row) =>
                          row.id === insight.id ? { ...row, decision } : row,
                        ),
                      }))
                    }
                  >
                    {decision}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
