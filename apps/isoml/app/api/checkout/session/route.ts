import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let body: { sku?: string; userId?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const secret = process.env.STRIPE_SECRET_KEY?.trim();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  if (!secret || secret.includes("placeholder")) {
    return NextResponse.json({
      mode: "adapter",
      message:
        "Stripe is not configured. No fake payment success. Set STRIPE_SECRET_KEY and webhook endpoint to grant entitlements via /api/stripe/webhook.",
      sku: body.sku,
      userId: body.userId,
    });
  }

  // Live Stripe session creation intentionally left as a thin stub until price IDs are set in admin config.
  return NextResponse.json({
    mode: "needs-price-config",
    message:
      "Stripe key present, but product price IDs must be configured in the admin dashboard before creating Checkout Sessions.",
    returnUrl: `${baseUrl}/checkout/success`,
  });
}
