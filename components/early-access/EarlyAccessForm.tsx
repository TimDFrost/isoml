"use client";

import { useState } from "react";

export function EarlyAccessForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("Reachy Mini × You");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setStatus("");
    try {
      const response = await fetch("/api/early-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, interest }),
      });
      const data = (await response.json()) as { message?: string; error?: string };
      setStatus(data.message || data.error || "Submitted.");
      if (response.ok) {
        setName("");
        setEmail("");
      }
    } catch {
      setStatus("Could not submit right now. Try again later.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="panel space-y-4 p-6" onSubmit={(event) => void submit(event)}>
      <label>
        <span className="label">Name</span>
        <input
          className="field"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label>
        <span className="label">Email</span>
        <input
          className="field"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>
        <span className="label">Interest</span>
        <input
          className="field"
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
        />
      </label>
      <button type="submit" className="btn btn-primary" disabled={busy}>
        {busy ? "Sending…" : "Request early access"}
      </button>
      {status ? (
        <p className="text-sm text-[var(--violet-deep)]" role="status">
          {status}
        </p>
      ) : null}
    </form>
  );
}
