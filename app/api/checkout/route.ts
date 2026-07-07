import { NextResponse } from "next/server";
import { stripe, PRICING_PLANS, type PlanKey } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const { plan } = (await request.json()) as { plan: PlanKey };

    if (!plan || !PRICING_PLANS[plan]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const selectedPlan = PRICING_PLANS[plan];
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey || secretKey.includes("placeholder")) {
      return NextResponse.json({
        message:
          "Stripe checkout is being configured. Please contact contact@isoml.com to reserve your founding partner spot.",
        plan: selectedPlan.name,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `ISOML Founding Partner — ${selectedPlan.name}`,
              description: selectedPlan.description,
            },
            unit_amount: selectedPlan.price,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://isoml.com"}/?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://isoml.com"}/#partners`,
      metadata: {
        plan,
        product: "founding_partner",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
