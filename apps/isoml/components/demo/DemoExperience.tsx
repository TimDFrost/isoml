"use client";

import { useEffect, useState } from "react";
import { synthesizeDemo } from "@/lib/demo-engine";
import {
  clearDemoSession,
  loadDemoSession,
  saveDemoSession,
} from "@/lib/demo-storage";
import type { DemoSession } from "@/lib/types";

const robotFaces: Record<DemoSession["robotMood"], string> = {
  curious: "◉‿◉",
  warm: "◕‿◕",
  focused: "ಸ_ಸ",
};

export function DemoExperience() {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<DemoSession | null>(null);
  const [status, setStatus] = useState("");
  const [persistNote, setPersistNote] = useState(false);
  const [mode, setMode] = useState<"synthetic" | "llm-pending">("synthetic");

  useEffect(() => {
    setSession(loadDemoSession());
    setReady(true);
  }, []);

  if (!ready || !session) {
    return <div className="panel p-8 text-[var(--ink-muted)]">Opening the demo…</div>;
  }

  const update = <K extends keyof DemoSession>(key: K, value: DemoSession[K]) => {
    setSession({ ...session, [key]: value });
  };

  const runDemo = async () => {
    const next = synthesizeDemo(session);
    setSession(next);
    saveDemoSession(next);
    setMode("synthetic");
    setStatus("Demo twin generated locally. Output is labeled as demonstration.");

    try {
      const response = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      if (response.ok) {
        const data = (await response.json()) as {
          mode?: string;
          summary?: string;
          sampleReply?: string;
        };
        if (data.mode === "llm" && data.summary && data.sampleReply) {
          const live = {
            ...next,
            summary: data.summary,
            sampleReply: data.sampleReply,
            conversation: [
              {
                role: "user" as const,
                content: "How would you introduce yourself?",
              },
              { role: "assistant" as const, content: data.sampleReply },
            ],
          };
          setSession(live);
          saveDemoSession(live);
          setMode("llm-pending");
          setStatus(
            "Live model reply received server-side. Only demo fields were sent to the provider.",
          );
        }
      }
    } catch {
      // keep synthetic
    }
  };

  const reset = () => {
    const next = clearDemoSession();
    setSession(next);
    setStatus("Demo session cleared.");
    setPersistNote(false);
    setMode("synthetic");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="badge-soft badge-demo">Free demo · no account</span>
        <span className="badge-soft">
          {mode === "synthetic" ? "Scripted / synthetic default" : "Live model available"}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="panel space-y-4 p-6">
          <h2 className="font-display text-2xl text-[var(--ink)]">Teach a quick twin</h2>
          <label>
            <span className="label">Display name / nickname</span>
            <input
              className="field"
              value={session.nickname}
              onChange={(event) => update("nickname", event.target.value)}
              placeholder="e.g. Alex"
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-3">
            {session.traits.map((trait, index) => (
              <label key={`trait-${index}`}>
                <span className="label">Trait {index + 1}</span>
                <input
                  className="field"
                  value={trait}
                  onChange={(event) => {
                    const traits = [...session.traits] as DemoSession["traits"];
                    traits[index] = event.target.value;
                    update("traits", traits);
                  }}
                  placeholder={["warm", "witty", "direct"][index]}
                />
              </label>
            ))}
          </div>
          <label>
            <span className="label">Short writing sample</span>
            <textarea
              className="field min-h-28"
              value={session.writingSample}
              onChange={(event) => update("writingSample", event.target.value)}
              placeholder="A paragraph that sounds like you"
            />
          </label>
          <label>
            <span className="label">Preference or boundary</span>
            <input
              className="field"
              value={session.preference}
              onChange={(event) => update("preference", event.target.value)}
              placeholder="e.g. Never share family addresses"
            />
          </label>
          <label>
            <span className="label">One interview response</span>
            <textarea
              className="field min-h-24"
              value={session.interviewAnswer}
              onChange={(event) => update("interviewAnswer", event.target.value)}
              placeholder="What should people feel after five minutes with you?"
            />
          </label>
          <div className="flex flex-wrap gap-3 pt-2">
            <button type="button" className="btn btn-primary" onClick={() => void runDemo()}>
              Generate demo twin
            </button>
            <button type="button" className="btn btn-secondary" onClick={reset}>
              Reset session
            </button>
          </div>
          <p className="text-sm text-[var(--ink-muted)]">
            Session memory stays in this browser tab until you reset. Nothing is
            persisted to a server without an explicit action below.
          </p>
        </div>

        <div className="space-y-6">
          <div className="panel space-y-3 p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-2xl text-[var(--ink)]">Personality summary</h2>
              <span className="badge-soft badge-demo">Editable</span>
            </div>
            <textarea
              className="field min-h-32"
              value={session.summary}
              onChange={(event) => {
                const next = { ...session, summary: event.target.value };
                setSession(next);
                saveDemoSession(next);
              }}
              placeholder="Generate to see a draft summary"
            />
          </div>

          <div className="panel space-y-3 p-6">
            <h2 className="font-display text-2xl text-[var(--ink)]">Sample reply</h2>
            <p className="rounded-[var(--radius-md)] bg-[var(--surface-soft)] p-4 text-[var(--ink-soft)]">
              {session.sampleReply || "Generate to preview a reply in your style."}
            </p>
          </div>

          <div className="panel space-y-3 p-6">
            <h2 className="font-display text-2xl text-[var(--ink)]">Conversation preview</h2>
            <div className="space-y-3">
              {session.conversation.length === 0 ? (
                <p className="text-sm text-[var(--ink-muted)]">No conversation yet.</p>
              ) : (
                session.conversation.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={`max-w-[92%] rounded-[var(--radius-md)] px-3 py-2 text-sm ${
                      message.role === "user"
                        ? "ml-auto bg-[linear-gradient(135deg,var(--violet),var(--electric))] text-white"
                        : "bg-[var(--surface-soft)] text-[var(--ink)]"
                    }`}
                  >
                    {message.content}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="panel flex items-center gap-4 p-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[linear-gradient(135deg,var(--violet),var(--electric))] text-2xl text-white animate-drift">
              {robotFaces[session.robotMood]}
            </div>
            <div>
              <p className="font-display text-xl text-[var(--ink)]">Robot expression</p>
              <p className="mt-1 text-sm text-[var(--ink-muted)]">
                Simple mood preview: <strong>{session.robotMood}</strong>. Not a live
                hardware link.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="panel space-y-3 p-6">
        <h3 className="font-display text-xl text-[var(--ink)]">Optional explicit save</h3>
        <p className="text-sm text-[var(--ink-muted)]">
          By default this demo does not write to a server. If you explicitly save,
          we still only keep a local download on your device in this MVP.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              const blob = new Blob([JSON.stringify(session, null, 2)], {
                type: "application/json",
              });
              const url = URL.createObjectURL(blob);
              const anchor = document.createElement("a");
              anchor.href = url;
              anchor.download = "isoml-demo-session.json";
              anchor.click();
              URL.revokeObjectURL(url);
              setPersistNote(true);
              setStatus("Downloaded a local JSON copy. No server persistence.");
            }}
          >
            Download local copy
          </button>
        </div>
        {persistNote ? (
          <p className="text-sm text-[var(--success)]" role="status">
            Local download complete.
          </p>
        ) : null}
        {status ? (
          <p className="text-sm text-[var(--violet-deep)]" role="status">
            {status}
          </p>
        ) : null}
      </div>
    </div>
  );
}
