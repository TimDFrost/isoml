"use client";

import { useStudio } from "@/components/studio/StudioProvider";
import type { TwinConfig, TwinTone } from "@/lib/types";

const tones: TwinTone[] = ["warm", "witty", "calm", "direct", "curious"];

export default function StudioBuilderPage() {
  const { state, setState, persist } = useStudio();
  const twin = state.twin;

  const update = <K extends keyof TwinConfig>(key: K, value: TwinConfig[K]) => {
    setState((prev) => ({ ...prev, twin: { ...prev.twin, [key]: value } }));
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Twin Builder</p>
        <h1 className="mt-2 font-display text-3xl text-[var(--ink)]">Configure the representation</h1>
        <p className="mt-3 max-w-2xl text-[var(--ink-soft)]">
          Source permissions stay independent from action permissions. This twin is
          shaped by you — not promised as a perfect mental copy.
        </p>
      </div>

      <div className="panel grid gap-4 p-5 md:grid-cols-2">
        <label className="md:col-span-2">
          <span className="label">Display name</span>
          <input
            className="field"
            value={twin.displayName}
            onChange={(e) => update("displayName", e.target.value)}
            placeholder="e.g. Alex Twin"
          />
        </label>
        <label>
          <span className="label">Tone</span>
          <select
            className="field"
            value={twin.tone}
            onChange={(e) => update("tone", e.target.value as TwinTone)}
          >
            {tones.map((tone) => (
              <option key={tone} value={tone}>
                {tone}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="label">Formality</span>
          <select
            className="field"
            value={twin.formality}
            onChange={(e) =>
              update("formality", e.target.value as TwinConfig["formality"])
            }
          >
            <option value="casual">casual</option>
            <option value="balanced">balanced</option>
            <option value="formal">formal</option>
          </select>
        </label>
        <label>
          <span className="label">Vocabulary notes</span>
          <input
            className="field"
            value={twin.vocabulary}
            onChange={(e) => update("vocabulary", e.target.value)}
          />
        </label>
        <label>
          <span className="label">Humor</span>
          <input
            className="field"
            value={twin.humor}
            onChange={(e) => update("humor", e.target.value)}
          />
        </label>
        <label>
          <span className="label">Response length</span>
          <select
            className="field"
            value={twin.responseLength}
            onChange={(e) =>
              update(
                "responseLength",
                e.target.value as TwinConfig["responseLength"],
              )
            }
          >
            <option value="short">short</option>
            <option value="medium">medium</option>
            <option value="long">long</option>
          </select>
        </label>
        <label>
          <span className="label">Favorite expressions (comma-separated)</span>
          <input
            className="field"
            value={twin.favoriteExpressions.join(", ")}
            onChange={(e) =>
              update(
                "favoriteExpressions",
                e.target.value
                  .split(",")
                  .map((part) => part.trim())
                  .filter(Boolean),
              )
            }
          />
        </label>
        <label className="md:col-span-2">
          <span className="label">Approved memories (comma-separated)</span>
          <textarea
            className="field min-h-24"
            value={twin.approvedMemories.join(", ")}
            onChange={(e) =>
              update(
                "approvedMemories",
                e.target.value
                  .split(",")
                  .map((part) => part.trim())
                  .filter(Boolean),
              )
            }
          />
        </label>
        <label className="md:col-span-2">
          <span className="label">Topics to avoid</span>
          <textarea
            className="field min-h-20"
            value={twin.topicsToAvoid.join(", ")}
            onChange={(e) =>
              update(
                "topicsToAvoid",
                e.target.value
                  .split(",")
                  .map((part) => part.trim())
                  .filter(Boolean),
              )
            }
          />
        </label>
        <label>
          <span className="label">Private knowledge</span>
          <textarea
            className="field min-h-24"
            value={twin.privateKnowledge}
            onChange={(e) => update("privateKnowledge", e.target.value)}
          />
        </label>
        <label>
          <span className="label">Public knowledge</span>
          <textarea
            className="field min-h-24"
            value={twin.publicKnowledge}
            onChange={(e) => update("publicKnowledge", e.target.value)}
          />
        </label>
        <label className="md:col-span-2">
          <span className="label">Robot expression preferences</span>
          <textarea
            className="field min-h-20"
            value={twin.robotExpression}
            onChange={(e) => update("robotExpression", e.target.value)}
          />
        </label>
      </div>

      <button type="button" className="btn btn-primary" onClick={persist}>
        Save twin configuration locally
      </button>
    </div>
  );
}
