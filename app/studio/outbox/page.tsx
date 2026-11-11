"use client";

import { useState } from "react";
import { useStudio } from "@/components/studio/StudioProvider";
import { createOutboxDraft } from "@/lib/studio-storage";
import type { OutboxMode } from "@/lib/types";

export default function StudioOutboxPage() {
  const { state, setState, persist, setStatus } = useStudio();
  const [channel, setChannel] = useState<"social" | "text" | "work">("text");
  const [recipient, setRecipient] = useState("");
  const [body, setBody] = useState("");

  const addDraft = () => {
    if (!recipient.trim() || !body.trim()) {
      setStatus("Recipient and draft body are required.");
      return;
    }
    setState((prev) => ({
      ...prev,
      outbox: [
        createOutboxDraft({
          channel,
          recipient: recipient.trim(),
          body: body.trim(),
        }),
        ...prev.outbox,
      ],
    }));
    setRecipient("");
    setBody("");
    setStatus("Draft created. Default mode remains Draft only — no auto-send.");
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Outbox & automation</p>
        <h1 className="mt-2 font-display text-3xl text-[var(--ink)]">
          Drafts first. Authorization never implied.
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--ink-soft)]">
          Create social posts, text replies, and routine work messages. Modes:
          Draft only (default), Ask before sending, Handle under my rules.
        </p>
      </div>

      <div className="panel space-y-4 p-5">
        <h2 className="font-display text-xl">Automation mode</h2>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["draft-only", "Draft only"],
              ["ask-before-sending", "Ask before sending"],
              ["handle-under-rules", "Handle under my rules"],
            ] as Array<[OutboxMode, string]>
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={`btn px-4 py-2 text-sm ${
                state.outboxMode === value ? "btn-primary" : "btn-secondary"
              }`}
              onClick={() =>
                setState((prev) => ({ ...prev, outboxMode: value }))
              }
            >
              {label}
            </button>
          ))}
        </div>
        <p className="text-sm text-[var(--ink-muted)]">
          No implied auto-authorization of email, social, or messaging accounts.
          Recipient restrictions and escalation stay under your control.
        </p>
      </div>

      <div className="panel space-y-4 p-5">
        <h2 className="font-display text-xl">New draft</h2>
        <label>
          <span className="label">Channel</span>
          <select
            className="field"
            value={channel}
            onChange={(e) =>
              setChannel(e.target.value as "social" | "text" | "work")
            }
          >
            <option value="social">social</option>
            <option value="text">text</option>
            <option value="work">work</option>
          </select>
        </label>
        <label>
          <span className="label">Recipient / audience</span>
          <input
            className="field"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="name, channel, or restricted list"
          />
        </label>
        <label>
          <span className="label">Draft body</span>
          <textarea
            className="field min-h-28"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </label>
        <button type="button" className="btn btn-primary" onClick={addDraft}>
          Save draft
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-xl">Activity log</h2>
          <button
            type="button"
            className="btn btn-secondary px-3 py-2 text-sm"
            onClick={() => {
              setState((prev) => ({
                ...prev,
                outbox: prev.outbox.map((item) => ({
                  ...item,
                  status: "paused",
                })),
              }));
              setStatus("All outbox items paused.");
            }}
          >
            Pause all
          </button>
        </div>
        {state.outbox.length === 0 ? (
          <div className="panel p-6 text-[var(--ink-muted)]">
            No drafts yet. Next action: create a draft-only message above.
          </div>
        ) : (
          state.outbox.map((item) => (
            <div key={item.id} className="panel space-y-2 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium">
                  {item.channel} → {item.recipient}
                </p>
                <span className="badge-soft">{item.status}</span>
              </div>
              <p className="text-sm text-[var(--ink-soft)]">{item.body}</p>
              <p className="text-xs text-[var(--ink-muted)]">
                {new Date(item.createdAt).toLocaleString()} · mode {state.outboxMode}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn btn-secondary px-3 py-2 text-sm"
                  onClick={() =>
                    setState((prev) => ({
                      ...prev,
                      outbox: prev.outbox.map((row) =>
                        row.id === item.id
                          ? { ...row, status: "awaiting-approval" }
                          : row,
                      ),
                    }))
                  }
                >
                  Escalate for approval
                </button>
                <button
                  type="button"
                  className="btn btn-ghost px-3 py-2 text-sm"
                  onClick={() =>
                    setState((prev) => ({
                      ...prev,
                      outbox: prev.outbox.filter((row) => row.id !== item.id),
                    }))
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <button type="button" className="btn btn-secondary" onClick={persist}>
        Save outbox locally
      </button>
    </div>
  );
}
