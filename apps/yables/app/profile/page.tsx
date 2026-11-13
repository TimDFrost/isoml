"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { synthesizeProfileDraft } from "@ohya/ai";
import { loadJourney, saveJourney, type JourneyState } from "@/lib/journey-storage";

export default function ProfilePage() {
  const [journey, setJourney] = useState<JourneyState | null>(null);
  const [name, setName] = useState("");

  useEffect(() => {
    const loaded = loadJourney();
    setJourney(loaded);
    setName(loaded.displayName);
  }, []);

  if (!journey) {
    return <div className="container-page py-16 text-[var(--ink-muted)]">Loading Your Profile…</div>;
  }

  const completed = journey.sessions.filter((s) => s.status === "completed").map((s) => s.sessionId);
  const notes = journey.sessions.flatMap((s) => s.notes);
  const allDone = completed.length >= 12;

  const rebuild = () => {
    const profile = synthesizeProfileDraft({
      displayName: name || journey.displayName || "You",
      notes,
      completedSessions: completed,
    });
    const next = saveJourney({
      ...journey,
      displayName: name || journey.displayName,
      profile,
    });
    setJourney(next);
  };

  const downloadJson = () => {
    const profile =
      journey.profile ||
      synthesizeProfileDraft({
        displayName: name || "You",
        notes,
        completedSessions: completed,
      });
    const blob = new Blob([JSON.stringify(profile, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "yables-your-profile.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPdfText = () => {
    const profile =
      journey.profile ||
      synthesizeProfileDraft({
        displayName: name || "You",
        notes,
        completedSessions: completed,
      });
    // Lightweight printable text stand-in until a PDF renderer is wired.
    const text = [
      "Yables — Your Profile (free export)",
      `Name: ${profile.displayName}`,
      "",
      profile.summary,
      "",
      "Memories (review/approve on dashboard):",
      ...profile.memories.map((m) => `- [${m.kind}] ${m.text}`),
      "",
      "This download is free. Commercial twin activation happens on isoML after payment + consent.",
    ].join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "yables-your-profile.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="py-12">
      <div className="container-page max-w-3xl space-y-6">
        <p className="eyebrow">Your Profile · free</p>
        <h1 className="font-display text-4xl text-[var(--charcoal)]">
          {allDone ? "Congratulations! You've discovered yourself." : "Your emerging profile"}
        </h1>
        <p className="text-[var(--charcoal-soft)]">
          Review, edit, and download without payment. isoML only charges for commercial twin
          activation and hosted import — never for owning your data.
        </p>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Display name</span>
          <input
            className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn btn-primary" onClick={rebuild}>
            Refresh profile draft
          </button>
          <button type="button" className="btn btn-secondary" onClick={downloadJson}>
            Download JSON
          </button>
          <button type="button" className="btn btn-secondary" onClick={downloadPdfText}>
            Download printable profile
          </button>
        </div>

        <div className="panel space-y-3 p-6">
          <h2 className="font-display text-2xl">Summary</h2>
          <p className="text-[var(--charcoal-soft)]">
            {journey.profile?.summary || "Complete sessions and refresh to generate a draft."}
          </p>
          <p className="text-sm text-[var(--ink-muted)]">
            Completed sessions: {completed.join(", ") || "none yet"}
          </p>
          <ul className="space-y-2 text-sm text-[var(--charcoal-soft)]">
            {(journey.profile?.memories || []).map((memory) => (
              <li key={memory.id}>
                <strong>{memory.kind}:</strong> {memory.text}
              </li>
            ))}
          </ul>
        </div>

        {allDone ? (
          <div className="panel space-y-4 bg-[linear-gradient(135deg,#fff8ef,#f3d5c4)] p-8">
            <h2 className="font-display text-3xl text-[var(--deep-red)]">
              Now, would you like to meet yourself?
            </h2>
            <p className="text-[var(--charcoal-soft)]">
              Your personality is ready. Meet your twin on isoML.
            </p>
            <Link href="/bring-yourself-to-life" className="btn btn-primary">
              Bring Yourself to Life
            </Link>
          </div>
        ) : (
          <Link href="/journey" className="btn btn-secondary">
            Continue the journey
          </Link>
        )}
      </div>
    </section>
  );
}
