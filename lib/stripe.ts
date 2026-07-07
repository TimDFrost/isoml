import Stripe from "stripe";

export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || "sk_test_placeholder_replace_with_real_key",
  {
    apiVersion: "2026-06-24.dahlia",
    typescript: true,
  }
);

export const PRICING_PLANS = {
  individual: {
    name: "Individual Attorney",
    price: 29900,
    description: "Solo practitioner founding access",
    features: [
      "Early beta access",
      "1 user seat",
      "Discovery organization",
      "Elements mapping",
      "Precedent research",
      "Founding member pricing locked for life",
    ],
  },
  smallFirm: {
    name: "Small Firm",
    price: 99900,
    description: "Up to 10 attorneys",
    features: [
      "Everything in Individual",
      "Up to 10 user seats",
      "Timeline & Fair dashboards",
      "Priority onboarding",
      "Quarterly founder meetings",
      "Roadmap influence sessions",
    ],
  },
  enterprise: {
    name: "Enterprise",
    price: 249900,
    description: "Large firms & organizations",
    features: [
      "Everything in Small Firm",
      "Unlimited seats",
      "Custom integrations",
      "Private demonstrations",
      "Dedicated success manager",
      "On-premise deployment options",
    ],
  },
} as const;

export type PlanKey = keyof typeof PRICING_PLANS;
