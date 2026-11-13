"use client";

import Link from "next/link";
import { useStudio } from "@/components/studio/StudioProvider";

export default function StudioOverviewPage() {
  const { state } = useStudio();
  const approvedSources = state.sources.filter((s) => s.approvedForTwin).length;
  const interviewDone = state.interviews.filter((i) => i.status === "approved").length;
  const insightsPending = state.insights.filter((i) => i.decision === "pending").length;

  const cards = [
    {
      title: "Onboarding progress",
      value: `${Math.min(
        100,
        Math.round(
          ((Number(Boolean(state.twin.displayName)) +
            Number(approvedSources > 0) +
            Number(interviewDone > 0) +
            Number(state.twin.approvedMemories.length > 0) +
            Number(state.robot.selectedPersonality ? 1 : 0)) /
            5) *
            100,
        ),
      )}%`,
      next: "Add a display name in Twin Builder, approve a source, and complete an interview.",
      href: "/studio/builder",
    },
    {
      title: "Approved sources",
      value: String(approvedSources),
      next:
        approvedSources === 0
          ? "Upload or paste material in My Data, then mark it approved for twin."
          : "Review permissions and keep only approved material live.",
      href: "/studio/data",
    },
    {
      title: "Interview progress",
      value: `${interviewDone}/${state.interviews.length}`,
      next: "Answer, edit, skip, or approve lessons in Interview.",
      href: "/studio/interview",
    },
    {
      title: "Twin config",
      value: state.twin.displayName || "Untitled",
      next: "Configure tone, boundaries, and robot expression preferences.",
      href: "/studio/builder",
    },
    {
      title: "Robot connection",
      value: state.robot.connection,
      next: "Hardware adapter is not connected. Open Reachy Mini for honest setup status.",
      href: "/studio/reachy",
    },
    {
      title: "Insights awaiting review",
      value: String(insightsPending),
      next: "Approve, correct, or reject proposed insights before they stick.",
      href: "/studio/insights",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Overview</p>
        <h1 className="mt-2 font-display text-3xl text-[var(--ink)] sm:text-4xl">
          Your twin workspace
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--ink-soft)]">
          Track onboarding, approved sources, interviews, twin config, and robot
          status. Empty states include a clear next action.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <div key={card.title} className="panel flex flex-col p-5">
            <p className="text-sm text-[var(--ink-muted)]">{card.title}</p>
            <p className="mt-2 font-display text-2xl text-[var(--ink)]">{card.value}</p>
            <p className="mt-3 flex-1 text-sm text-[var(--ink-soft)]">{card.next}</p>
            <Link href={card.href} className="btn btn-secondary mt-4 px-4 py-2 text-sm">
              Continue
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
