import Link from "next/link";

const isomlUrl = process.env.NEXT_PUBLIC_ISOML_URL || "http://localhost:3000";

export default function BringYourselfToLifePage() {
  return (
    <section className="py-16">
      <div className="container-page max-w-2xl space-y-6">
        <p className="eyebrow">Commercial handoff</p>
        <h1 className="font-display text-4xl text-[var(--charcoal)]">
          Bring Yourself to Life
        </h1>
        <p className="text-lg text-[var(--charcoal-soft)]">
          Yables stays free. isoML sells AI-twin activation, Reachy Mini × You, and
          related services. Only a non-sensitive handoff reference is prepared here —
          never an automatic dump of your private profile.
        </p>
        <div className="panel space-y-3 p-6 text-sm text-[var(--charcoal-soft)]">
          <p>1. Continue to isoML to review product and price.</p>
          <p>2. Complete Stripe Checkout (server-verified webhook grants entitlement).</p>
          <p>3. Explicitly approve which approved profile data may transfer.</p>
          <p>4. isoML imports only after entitlement + consent.</p>
        </div>
        <a href={`${isomlUrl}/checkout/reachy-mini-x-you?from=yables`} className="btn btn-primary">
          Continue to isoML
        </a>
        <Link href="/profile" className="btn btn-secondary">
          Back to Your Profile
        </Link>
      </div>
    </section>
  );
}
