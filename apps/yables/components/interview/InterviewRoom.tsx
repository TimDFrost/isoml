"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { YABLES_SESSIONS } from "@ohya/identity-schema";
import type { DrYablesEmotion } from "@ohya/ai";
import { DrYablesStage } from "@/components/dr-yables/DrYablesStage";
import {
  loadJourney,
  saveJourney,
  unlockNext,
  type JourneyState,
} from "@/lib/journey-storage";

export function InterviewRoom({ sessionId }: { sessionId: number }) {
  const session = useMemo(
    () => YABLES_SESSIONS.find((item) => item.id === sessionId),
    [sessionId],
  );
  const [journey, setJourney] = useState<JourneyState | null>(null);
  const [input, setInput] = useState("");
  const [emotion, setEmotion] = useState<DrYablesEmotion>("idle");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const loaded = loadJourney();
    setJourney(loaded);
  }, []);

  if (!session || !journey) {
    return <div className="container-page py-16 text-[var(--ink-muted)]">Preparing the sitting…</div>;
  }

  const progress = journey.sessions.find((item) => item.sessionId === sessionId)!;
  if (progress.status === "locked") {
    return (
      <div className="container-page space-y-4 py-16">
        <h1 className="font-display text-3xl">Session {sessionId} is locked</h1>
        <Link href="/journey" className="btn btn-secondary">
          Back to journey map
        </Link>
      </div>
    );
  }

  const send = async () => {
    const trimmed = input.trim();
    if (!trimmed || busy) return;
    setBusy(true);
    setEmotion("listening");

    const userMessage = { role: "user" as const, content: trimmed };
    setInput("");

    try {
      const response = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          message: trimmed,
          turn: progress.messages.length,
        }),
      });
      const data = (await response.json()) as {
        reply?: string;
        emotion?: DrYablesEmotion;
        candidateInsight?: string;
      };

      setEmotion(data.emotion || "speaking");
      const assistant = {
        role: "assistant" as const,
        content: data.reply || "I'm still here — tell me more when you're ready.",
      };

      const nextSessions = journey.sessions.map((item) =>
        item.sessionId === sessionId
          ? {
              ...item,
              messages: [...item.messages, userMessage, assistant],
              notes: data.candidateInsight
                ? [...item.notes, data.candidateInsight]
                : item.notes,
            }
          : item,
      );
      const next = saveJourney({ ...journey, sessions: nextSessions });
      setJourney(next);
      setStatus("Saved locally — free and private to this browser until auth is configured.");
    } catch {
      setStatus("Could not reach the interview bridge. Try again.");
      setEmotion("curious");
    } finally {
      setBusy(false);
    }
  };

  const completeSession = () => {
    const unlocked = unlockNext(journey, sessionId);
    const withBadge = {
      ...unlocked,
      sessions: unlocked.sessions.map((item) =>
        item.sessionId === sessionId
          ? { ...item, badge: item.badge || "The Storyteller" }
          : item,
      ),
    };
    const saved = saveJourney(withBadge);
    setJourney(saved);
    setEmotion("happy");
    setStatus(
      sessionId === 12
        ? "Session 12 complete — open Your Profile, then Bring Yourself to Life on isoML."
        : `Session ${sessionId} finalized. Next session unlocked.`,
    );
  };

  return (
    <section className="py-10">
      <div className="container-page grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <DrYablesStage emotion={emotion} />
        <div className="space-y-4">
          <p className="eyebrow">
            Session {session.id} · Act {session.act}
          </p>
          <h1 className="font-display text-4xl text-[var(--charcoal)]">{session.title}</h1>
          <p className="text-[var(--charcoal-soft)]">{session.intro}</p>
          <p className="text-sm text-[var(--ink-muted)]">
            Dr. Yables is an AI autobiographical interviewer — not a licensed
            psychologist. Skip, decline, or end anytime.
          </p>

          <div className="panel max-h-[360px] space-y-3 overflow-y-auto p-4">
            {progress.messages.length === 0 ? (
              <p className="text-sm text-[var(--ink-muted)]">
                Dr. Yables is ready. Share whatever feels comfortable to begin.
              </p>
            ) : (
              progress.messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`max-w-[92%] rounded-2xl px-3 py-2 text-sm ${
                    message.role === "user"
                      ? "ml-auto bg-[var(--burgundy)] text-white"
                      : "bg-[var(--cream)] text-[var(--charcoal)]"
                  }`}
                >
                  {message.content}
                </div>
              ))
            )}
          </div>

          <div className="flex gap-2">
            <input
              className="flex-1 rounded-full border border-[var(--line)] bg-white px-4 py-3"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") void send();
              }}
              placeholder="Type your answer"
            />
            <button type="button" className="btn btn-primary" disabled={busy} onClick={() => void send()}>
              Send
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-secondary" onClick={completeSession}>
              Finalize session
            </button>
            <Link href="/journey" className="btn btn-secondary">
              Pause & return later
            </Link>
            {sessionId === 12 ? (
              <Link href="/profile" className="btn btn-primary">
                Meet Yourself
              </Link>
            ) : null}
          </div>
          {status ? <p className="text-sm text-[var(--burgundy)]">{status}</p> : null}
        </div>
      </div>
    </section>
  );
}
