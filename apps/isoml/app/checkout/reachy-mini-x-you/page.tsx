"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function CheckoutInner() {
  const params = useSearchParams();
  const fromYables = params.get("from") === "yables";
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const startCheckout = async () => {
    setBusy(true);
    setStatus("");
    try {
      const response = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sku: "reachy-mini-x-you",
          userId: "local-guest",
        }),
      });
      const data = (await response.json()) as {
        url?: string;
        mode?: string;
        message?: string;
        error?: string;
      };
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setStatus(data.message || data.error || "Checkout adapter responded without a URL.");
    } catch {
      setStatus("Checkout request failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="section">
      <div className="container-page max-w-2xl space-y-6">
        <p className="eyebrow">isoML commerce</p>
        <h1 className="font-display text-4xl text-[var(--chrome)]">
          Reachy Mini × You
        </h1>
        <p className="text-[var(--ink-soft)]">
          Personalized AI-twin activation for a compatible Reachy Mini. Hardware may be
          sold separately or waitlisted — this checkout sells the software entitlement
          path when Stripe is configured.
        </p>
        {fromYables ? (
          <p className="badge-soft">Arrived from Yables · profile transfer still requires payment + consent</p>
        ) : null}
        <div className="panel space-y-3 p-6 text-sm text-[var(--ink-soft)]">
          <p>Price is admin-configurable. No invented supplier prices here.</p>
          <p>Payment proof = Stripe webhook entitlement only (never a browser redirect).</p>
          <p>After payment you will still explicitly approve any Yables profile import.</p>
        </div>
        <button type="button" className="btn btn-primary" disabled={busy} onClick={() => void startCheckout()}>
          {busy ? "Starting…" : "Continue to checkout"}
        </button>
        <Link href="/studio/reachy" className="btn btn-secondary">
          Hardware setup boundary
        </Link>
        {status ? <p className="text-sm text-[var(--jewel-teal)]">{status}</p> : null}
      </div>
    </section>
  );
}

export default function ReachyCheckoutPage() {
  return (
    <Suspense fallback={<div className="container-page section text-[var(--ink-muted)]">Loading checkout…</div>}>
      <CheckoutInner />
    </Suspense>
  );
}
