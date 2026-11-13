"use client";

import { useState } from "react";
import { useStudio } from "@/components/studio/StudioProvider";
import type { ChatMessage } from "@/lib/types";

const starters = [
  "How would you greet a close friend?",
  "What should you refuse to talk about?",
  "Summarize how I usually make decisions.",
];

const corrections = [
  { label: "That sounds like me.", lasting: true },
  { label: "I wouldn’t say that.", lasting: true },
  { label: "Use a different tone.", lasting: false },
  { label: "That fact is wrong.", lasting: true },
] as const;

export default function StudioPlaygroundPage() {
  const { state, setState, setStatus } = useStudio();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "sys",
      role: "assistant",
      content:
        "Playground ready. Replies follow approved twin material only. Gaps are acknowledged rather than invented.",
      at: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [scope, setScope] = useState<"response" | "lasting">("response");
  const [lastAssistant, setLastAssistant] = useState("");

  const send = async (text?: string) => {
    const trimmed = (text ?? input).trim();
    if (!trimmed || busy) return;
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setBusy(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, profile: state.twin }),
      });
      const data = (await response.json()) as {
        reply?: string;
        error?: string;
        disclosure?: string;
      };
      const reply =
        data.reply ||
        data.error ||
        "I don't have enough approved material for that yet.";
      setLastAssistant(reply);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: reply,
          at: new Date().toISOString(),
        },
      ]);
      if (data.disclosure) setStatus(data.disclosure);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "I hit a temporary error. I still won't invent autobiography outside the approved profile.",
          at: new Date().toISOString(),
        },
      ]);
    } finally {
      setBusy(false);
    }
  };

  const applyCorrection = (label: string, lastingDefault: boolean) => {
    const lasting = scope === "lasting" || lastingDefault;
    if (lasting) {
      if (label.includes("tone")) {
        setState((prev) => ({
          ...prev,
          twin: {
            ...prev.twin,
            tone: prev.twin.tone === "witty" ? "warm" : "direct",
          },
        }));
      }
      if (label.includes("fact") || label.includes("wouldn’t")) {
        setState((prev) => ({
          ...prev,
          twin: {
            ...prev.twin,
            topicsToAvoid: Array.from(
              new Set([
                ...prev.twin.topicsToAvoid,
                `Avoid repeating: ${lastAssistant.slice(0, 80) || "last reply"}`,
              ]),
            ),
          },
        }));
      }
      if (label.includes("sounds like me") && lastAssistant) {
        setState((prev) => ({
          ...prev,
          twin: {
            ...prev.twin,
            approvedMemories: Array.from(
              new Set([...prev.twin.approvedMemories, lastAssistant.slice(0, 140)]),
            ).slice(0, 20),
          },
        }));
      }
      setStatus("Correction applied as a lasting preference in this local draft.");
    } else {
      setStatus("Correction noted for this response only — not written into lasting prefs.");
    }
  };

  const approvedSources = state.sources.filter((source) => source.approvedForTwin);

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Twin Playground</p>
        <h1 className="mt-2 font-display text-3xl text-[var(--ink)]">Test the twin</h1>
        <p className="mt-3 max-w-2xl text-[var(--ink-soft)]">
          Chat, correct, and choose whether feedback applies to this response or
          becomes a lasting preference.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="panel flex min-h-[460px] flex-col p-5">
          <div className="flex flex-wrap gap-2">
            {starters.map((starter) => (
              <button
                key={starter}
                type="button"
                className="btn btn-secondary px-3 py-2 text-sm"
                onClick={() => void send(starter)}
              >
                {starter}
              </button>
            ))}
          </div>
          <div className="mt-4 flex-1 space-y-3 overflow-y-auto rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-soft)] p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[92%] rounded-[var(--radius-md)] px-3 py-2 text-sm ${
                  message.role === "user"
                    ? "ml-auto bg-[linear-gradient(135deg,var(--violet),var(--electric))] text-white"
                    : "bg-white text-[var(--ink)]"
                }`}
              >
                {message.content}
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <input
              className="field"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void send();
              }}
              placeholder="Talk with your twin"
            />
            <button
              type="button"
              className="btn btn-primary"
              disabled={busy}
              onClick={() => void send()}
            >
              {busy ? "…" : "Send"}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="panel space-y-3 p-5">
            <h2 className="font-display text-xl">Corrections</h2>
            <label className="block text-sm">
              Scope
              <select
                className="field mt-1"
                value={scope}
                onChange={(e) => setScope(e.target.value as "response" | "lasting")}
              >
                <option value="response">This response</option>
                <option value="lasting">Lasting preference</option>
              </select>
            </label>
            <div className="flex flex-col gap-2">
              {corrections.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className="btn btn-secondary justify-start px-3 py-2 text-sm"
                  onClick={() => applyCorrection(item.label, item.lasting)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="panel space-y-3 p-5">
            <h2 className="font-display text-xl">Source panel</h2>
            {approvedSources.length === 0 ? (
              <p className="text-sm text-[var(--ink-muted)]">
                No approved sources yet — the twin should acknowledge gaps.
              </p>
            ) : (
              <ul className="space-y-2 text-sm text-[var(--ink-soft)]">
                {approvedSources.map((source) => (
                  <li key={source.id}>• {source.title}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
