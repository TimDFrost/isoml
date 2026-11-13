"use client";

import { useState } from "react";
import { useStudio } from "@/components/studio/StudioProvider";
import {
  MAX_UPLOAD_BYTES,
  MAX_UPLOAD_CHARS,
  createSource,
} from "@/lib/studio-storage";
import type { DataSourceType } from "@/lib/types";

const types: DataSourceType[] = [
  "journal",
  "writing",
  "resume",
  "messages",
  "preferences",
  "other",
];

const integrations = [
  { name: "Email export", status: "Planned" },
  { name: "Calendar notes", status: "Not connected" },
  { name: "Chat archives", status: "Planned" },
];

export default function StudioDataPage() {
  const { state, setState, persist, setStatus } = useStudio();
  const [title, setTitle] = useState("");
  const [type, setType] = useState<DataSourceType>("writing");
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");

  const addManual = () => {
    if (!title.trim() || !preview.trim()) {
      setError("Title and content are required.");
      return;
    }
    if (preview.length > MAX_UPLOAD_CHARS) {
      setError(`Content exceeds ${MAX_UPLOAD_CHARS} character limit.`);
      return;
    }
    setState((prev) => ({
      ...prev,
      sources: [
        createSource({ title: title.trim(), type, preview: preview.trim() }),
        ...prev.sources,
      ],
    }));
    setTitle("");
    setPreview("");
    setError("");
    setStatus("Source added locally. Approve it before twin use.");
  };

  const onFile = async (file: File | null) => {
    if (!file) return;
    if (file.size > MAX_UPLOAD_BYTES) {
      setError(`File exceeds ${Math.round(MAX_UPLOAD_BYTES / 1000)}KB preview limit.`);
      return;
    }
    if (!file.type.startsWith("text/") && !file.name.endsWith(".md") && !file.name.endsWith(".txt") && !file.name.endsWith(".json")) {
      setError("Only text-like files are accepted in this preview (.txt, .md, .json, text/*).");
      return;
    }
    const text = await file.text();
    if (/password\s*=|BEGIN PRIVATE KEY|api[_-]?key/i.test(text)) {
      setError("File looks like it may contain secrets. Remove credentials before upload.");
      return;
    }
    setState((prev) => ({
      ...prev,
      sources: [
        createSource({
          title: file.name,
          type: "other",
          preview: text.slice(0, MAX_UPLOAD_CHARS),
          origin: "file-upload",
        }),
        ...prev.sources,
      ],
    }));
    setError("");
    setStatus("File ingested as untrusted local content. Review before approval.");
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">My Data</p>
        <h1 className="mt-2 font-display text-3xl text-[var(--ink)]">Sources & permissions</h1>
        <p className="mt-3 max-w-2xl text-[var(--ink-soft)]">
          Manual text and selected file uploads. No passwords. No claim of universal
          access to your accounts.
        </p>
      </div>

      <div className="panel space-y-4 p-5">
        <h2 className="font-display text-xl">Add material</h2>
        <label>
          <span className="label">Title</span>
          <input className="field" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label>
          <span className="label">Type</span>
          <select className="field" value={type} onChange={(e) => setType(e.target.value as DataSourceType)}>
            {types.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="label">Content</span>
          <textarea
            className="field min-h-32"
            value={preview}
            onChange={(e) => setPreview(e.target.value)}
            placeholder="Paste journals, stories, writing samples, preferences…"
          />
        </label>
        <label className="block">
          <span className="label">Or upload a text file</span>
          <input
            type="file"
            accept=".txt,.md,.json,text/*"
            onChange={(e) => void onFile(e.target.files?.[0] || null)}
          />
        </label>
        {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn btn-primary" onClick={addManual}>
            Add source
          </button>
          <button type="button" className="btn btn-secondary" onClick={persist}>
            Save locally
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {state.sources.length === 0 ? (
          <div className="panel p-6 text-[var(--ink-muted)]">
            No sources yet. Next action: paste a writing sample or upload a text file.
          </div>
        ) : (
          state.sources.map((source) => (
            <div key={source.id} className="panel space-y-3 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-xl text-[var(--ink)]">{source.title}</h3>
                  <p className="mt-1 text-sm text-[var(--ink-muted)]">
                    {source.type} · {source.origin} ·{" "}
                    {new Date(source.date).toLocaleString()} · {source.status}
                  </p>
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={source.approvedForTwin}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        sources: prev.sources.map((item) =>
                          item.id === source.id
                            ? { ...item, approvedForTwin: e.target.checked }
                            : item,
                        ),
                      }))
                    }
                  />
                  Approved for twin
                </label>
              </div>
              <p className="text-sm text-[var(--ink-soft)]">{source.permissions}</p>
              <p className="rounded-[var(--radius-md)] bg-[var(--surface-soft)] p-3 text-sm text-[var(--ink-muted)]">
                {source.preview.slice(0, 280)}
                {source.preview.length > 280 ? "…" : ""}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn btn-secondary px-3 py-2 text-sm"
                  onClick={() => {
                    const blob = new Blob([source.preview], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${source.title || "source"}.txt`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  Export
                </button>
                <button
                  type="button"
                  className="btn btn-ghost px-3 py-2 text-sm"
                  onClick={() =>
                    setState((prev) => ({
                      ...prev,
                      sources: prev.sources.filter((item) => item.id !== source.id),
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

      <div className="panel p-5">
        <h2 className="font-display text-xl">Future integrations</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {integrations.map((item) => (
            <div key={item.name} className="rounded-[var(--radius-md)] border border-[var(--line)] p-4">
              <p className="font-medium">{item.name}</p>
              <p className="mt-2">
                <span className="badge-soft badge-warn">{item.status}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
