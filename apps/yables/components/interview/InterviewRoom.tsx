"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { YABLES_SESSIONS } from "@ohya/identity-schema";
import type { DrYablesEmotion } from "@ohya/ai";
import { DrYablesAvatar } from "@/components/dr-yables/DrYablesAvatar";
import { AchievementOverlay } from "@/components/interview/AchievementOverlay";
import { ProfileReview } from "@/components/interview/ProfileReview";
import { createWebAvatarBehavior } from "@/lib/avatar-behavior";
import {
  approvedNotes,
  loadJourney,
  saveJourney,
  unlockNext,
  type JourneyState,
  type MemoryCandidate,
} from "@/lib/journey-storage";
import { createBrowserSpeechInput } from "@/lib/speech-input";
import { createBrowserSpeechOutput } from "@/lib/speech-output";

export function InterviewRoom({ sessionId }: { sessionId: number }) {
  const session = useMemo(
    () => YABLES_SESSIONS.find((item) => item.id === sessionId),
    [sessionId],
  );
  const [journey, setJourney] = useState<JourneyState | null>(null);
  const [input, setInput] = useState("");
  const [emotion, setEmotion] = useState<DrYablesEmotion>("greeting");
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const [status, setStatus] = useState("");
  const [captions, setCaptions] = useState("");
  const [amplitude, setAmplitude] = useState(0);
  const [voiceOn, setVoiceOn] = useState(true);
  const [celebrateOpen, setCelebrateOpen] = useState(false);
  const [modeLabel, setModeLabel] = useState("");
  const speechOut = useRef(createBrowserSpeechOutput());
  const speechIn = useRef(createBrowserSpeechInput());
  const emotionRef = useRef<DrYablesEmotion>("greeting");
  const ampTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const loaded = loadJourney();
    setJourney(loaded);
    emotionRef.current = "greeting";
    setEmotion("greeting");
    const opener =
      "Hello — I'm Dr. Yables, an AI autobiographical interviewer, not a therapist. What would you like to share first?";
    setCaptions(opener);
    void speechOut.current.speak(opener, {
      onStart: () => {
        setEmotion("speaking");
        emotionRef.current = "speaking";
        startAmpPulse();
      },
      onEnd: () => {
        stopAmpPulse();
        setEmotion("curious");
        emotionRef.current = "curious";
      },
    });
    return () => {
      speechOut.current.stop();
      speechIn.current.stop();
      stopAmpPulse();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const startAmpPulse = () => {
    stopAmpPulse();
    ampTimer.current = setInterval(() => {
      setAmplitude(0.35 + Math.random() * 0.55);
    }, 120);
  };

  const stopAmpPulse = () => {
    if (ampTimer.current) clearInterval(ampTimer.current);
    ampTimer.current = null;
    setAmplitude(0);
  };

  const behavior = useMemo(
    () =>
      createWebAvatarBehavior({
        speak: (text) => speechOut.current.speak(text),
        listen: () => {
          setEmotion("listening");
          emotionRef.current = "listening";
        },
        setEmotion: (next) => {
          setEmotion(next);
          emotionRef.current = next;
        },
        stop: () => {
          speechOut.current.stop();
          speechIn.current.stop();
          stopAmpPulse();
        },
        getEmotion: () => emotionRef.current,
      }),
    [],
  );

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

  const completedCount = journey.sessions.filter((s) => s.status === "completed").length;
  const overallPct = Math.round((completedCount / 12) * 100);

  const speakReply = async (text: string, nextEmotion: DrYablesEmotion) => {
    setCaptions(text);
    if (!voiceOn) {
      setEmotion(nextEmotion);
      emotionRef.current = nextEmotion;
      return;
    }
    await speechOut.current.speak(text, {
      onStart: () => {
        setEmotion("speaking");
        emotionRef.current = "speaking";
        startAmpPulse();
      },
      onEnd: () => {
        stopAmpPulse();
        setEmotion(nextEmotion === "speaking" ? "curious" : nextEmotion);
        emotionRef.current = nextEmotion === "speaking" ? "curious" : nextEmotion;
      },
    });
  };

  const send = async (raw?: string) => {
    const trimmed = (raw ?? input).trim();
    if (!trimmed || busy) return;
    setBusy(true);
    speechOut.current.stop();
    stopAmpPulse();
    behavior.listen();
    setStatus("");

    const userMessage = { role: "user" as const, content: trimmed };
    setInput("");

    try {
      setEmotion("thinking");
      emotionRef.current = "thinking";
      const response = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          message: trimmed,
          turn: progress.messages.length,
          history: progress.messages.slice(-8),
          approvedNotes: approvedNotes(journey),
        }),
      });
      const data = (await response.json()) as {
        reply?: string;
        emotion?: DrYablesEmotion;
        candidateInsight?: string;
        mode?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || "Interview failed");
      }

      const reply =
        data.reply || "I'm still here — tell me more when you're ready.";
      const nextEmotion = data.emotion || "curious";
      setModeLabel(data.mode || "");

      const assistant = { role: "assistant" as const, content: reply };
      const candidates: MemoryCandidate[] = data.candidateInsight
        ? [
            ...journey.memoryCandidates,
            {
              id: `mc-${Date.now()}`,
              sessionId,
              text: data.candidateInsight,
              status: "pending",
              createdAt: new Date().toISOString(),
            },
          ]
        : journey.memoryCandidates;

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
      const next = saveJourney({
        ...journey,
        sessions: nextSessions,
        memoryCandidates: candidates,
      });
      setJourney(next);
      setStatus("Saved locally on this device. Approve memories before they become lasting facts.");
      await speakReply(reply, nextEmotion);
    } catch {
      setStatus("Could not reach the interview bridge. Try again, or type a shorter answer.");
      setEmotion("surprised");
      emotionRef.current = "surprised";
    } finally {
      setBusy(false);
      setListening(false);
    }
  };

  const startMic = async () => {
    if (busy || listening) return;
    speechOut.current.stop();
    stopAmpPulse();
    setListening(true);
    behavior.listen();
    setStatus(
      speechIn.current.supported
        ? "Listening… speak when ready. You can edit the transcript before sending."
        : "Speech recognition unavailable — please type instead.",
    );
    const result = await speechIn.current.start();
    setListening(false);
    if (result.error) {
      setStatus(result.error);
      setEmotion("idle");
      emotionRef.current = "idle";
      return;
    }
    if (result.transcript) {
      setInput(result.transcript);
      setStatus("Transcript ready — edit if needed, then send.");
      setEmotion("curious");
      emotionRef.current = "curious";
    } else {
      setStatus("No speech captured. You can type instead.");
      setEmotion("idle");
      emotionRef.current = "idle";
    }
  };

  const stopSpeaking = () => {
    speechOut.current.stop();
    stopAmpPulse();
    setEmotion("idle");
    emotionRef.current = "idle";
  };

  const completeSession = () => {
    speechOut.current.stop();
    const unlocked = unlockNext(journey, sessionId);
    const saved = saveJourney(unlocked);
    setJourney(saved);
    behavior.celebrate();
    setCelebrateOpen(true);
    setStatus(
      sessionId === 12
        ? "Session 12 complete — open Your Profile, then Bring Yourself to Life on isoML."
        : `Session ${sessionId} finalized. Next session unlocked.`,
    );
    void speakReply(
      sessionId === 12
        ? "Magnificent! Twelve sessions complete. Review your profile whenever you like — Yables stays free."
        : `Delightful! Session ${sessionId} is in the books. The next chapter awaits.`,
      "celebrating",
    );
  };

  return (
    <section className="py-6 md:py-10">
      <div className="container-page space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Yables · Session {session.id} of 12 · Act {session.act}</p>
            <h1 className="font-display text-3xl text-[var(--charcoal)] md:text-4xl">
              {session.title}
            </h1>
          </div>
          <div className="min-w-[160px]">
            <p className="mb-1 text-xs text-[var(--ink-muted)]">Journey {overallPct}%</p>
            <div className="h-2 overflow-hidden rounded-full bg-[var(--cream)]">
              <div
                className="h-full rounded-full bg-[var(--burgundy)] transition-all"
                style={{ width: `${overallPct}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className="space-y-3 lg:sticky lg:top-20 lg:self-start">
            <DrYablesAvatar
              emotion={emotion}
              captions={captions}
              speakingAmplitude={amplitude}
            />
            <p className="text-xs text-[var(--ink-muted)]">
              Dr. Yables is an AI autobiographical interviewer — not a licensed psychologist.
              Skip, decline, or end anytime. {modeLabel ? `Reply mode: ${modeLabel}.` : null}
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-[var(--charcoal-soft)]">{session.intro}</p>

            <div className="panel max-h-[min(42vh,380px)] space-y-3 overflow-y-auto p-4">
              {progress.messages.length === 0 ? (
                <p className="text-sm text-[var(--ink-muted)]">
                  Share whatever feels comfortable. One question at a time — no pressure.
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

            <div className="space-y-2">
              <label className="sr-only" htmlFor="interview-answer">
                Your answer
              </label>
              <textarea
                id="interview-answer"
                className="min-h-[88px] w-full resize-y rounded-2xl border border-[var(--line)] bg-white px-4 py-3"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void send();
                  }
                }}
                placeholder="Type your answer — or use Talk, then edit the transcript"
                disabled={busy}
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={busy || !input.trim()}
                  onClick={() => void send()}
                >
                  Send
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={busy || listening}
                  onClick={() => void startMic()}
                >
                  {listening ? "Listening…" : "Talk"}
                </button>
                <button type="button" className="btn btn-secondary" onClick={stopSpeaking}>
                  Stop speaking
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    const next = !voiceOn;
                    setVoiceOn(next);
                    speechOut.current.setEnabled(next);
                    if (!next) stopSpeaking();
                  }}
                >
                  Voice {voiceOn ? "on" : "off"}
                </button>
              </div>
            </div>

            <div className="panel space-y-3 p-4">
              <h2 className="font-display text-xl">Memory review</h2>
              <ProfileReview
                journey={journey}
                sessionFilter={sessionId}
                onChange={setJourney}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button type="button" className="btn btn-primary" onClick={completeSession}>
                Finalize session
              </button>
              <Link href="/journey" className="btn btn-secondary">
                Pause & return later
              </Link>
              {sessionId === 12 ? (
                <Link href="/profile" className="btn btn-secondary">
                  Meet Yourself
                </Link>
              ) : null}
            </div>
            {status ? <p className="text-sm text-[var(--burgundy)]">{status}</p> : null}
          </div>
        </div>
      </div>

      <AchievementOverlay
        open={celebrateOpen}
        sessionId={sessionId}
        badge={journey.sessions.find((s) => s.sessionId === sessionId)?.badge}
        onClose={() => setCelebrateOpen(false)}
      />
    </section>
  );
}
