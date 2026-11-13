import { NextResponse } from "next/server";
import { grantEntitlement } from "@ohya/billing";

/**
 * Stripe webhook adapter.
 * In production, verify the Stripe signature before granting entitlements.
 * Never grant entitlements from client-side redirects.
 */
export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  const raw = await request.text();

  if (!webhookSecret) {
    return NextResponse.json(
      {
        error:
          "STRIPE_WEBHOOK_SECRET not configured. Refusing to grant entitlements.",
      },
      { status: 503 },
    );
  }

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  // Signature verification requires the official Stripe SDK + raw body.
  // Until wired, acknowledge receipt but do not invent a paid entitlement.
  void raw;
  return NextResponse.json({
    received: true,
    granted: false,
    note: "Webhook endpoint ready. Wire Stripe signature verification before calling grantEntitlement().",
    exampleGrantApi: "grantEntitlement({ userId, sku: 'reachy-mini-x-you', source: 'stripe-webhook' })",
  });
}

/** Dev-only helper route documentation — not a payment bypass. */
export async function GET() {
  return NextResponse.json({
    ok: true,
    grantEntitlementName: grantEntitlement.name,
    rule: "Entitlements only after verified Stripe events.",
  });
}
