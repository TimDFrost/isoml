"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Check, Loader2, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PRICING_PLANS, type PlanKey } from "@/lib/stripe";

const benefits = [
  "Early beta access",
  "Influence roadmap",
  "Private demonstrations",
  "Discounted lifetime pricing",
  "Quarterly founder meetings",
  "Recognition on Founding Members page (optional)",
];

const planKeys: PlanKey[] = ["individual", "smallFirm", "enterprise"];

export function DesignPartner() {
  const [loading, setLoading] = useState<PlanKey | "waitlist" | null>(null);

  const handleCheckout = async (plan: PlanKey) => {
    setLoading(plan);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.message || "Checkout is being configured. Please contact us at contact@isoml.com");
      }
    } catch {
      alert("Unable to start checkout. Please contact contact@isoml.com");
    } finally {
      setLoading(null);
    }
  };

  const handleWaitlist = async () => {
    setLoading("waitlist");
    await new Promise((r) => setTimeout(r, 1000));
    alert("Thank you! You've been added to the waitlist. We'll be in touch soon.");
    setLoading(null);
  };

  return (
    <section id="partners" className="section-padding" aria-labelledby="partners-heading">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <Badge className="mb-4">
            <Users className="mr-1 h-3 w-3" />
            Limited to first 100 firms
          </Badge>
          <h2 id="partners-heading" className="text-3xl font-bold sm:text-4xl">
            Become a Founding Design Partner
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/60">
            Shape the future of legal intelligence. Early access, roadmap influence,
            beta onboarding, and discounted founding-member pricing.
          </p>
        </motion.div>

        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => (
            <div key={b} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <Check className="h-4 w-4 shrink-0 text-olive-light" />
              <span className="text-sm text-white/70">{b}</span>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {planKeys.map((key, i) => {
            const plan = PRICING_PLANS[key];
            const isPopular = key === "smallFirm";
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className={`relative h-full ${isPopular ? "border-olive/40 glow-olive" : ""}`}>
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge>Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">
                        ${(plan.price / 100).toLocaleString()}
                      </span>
                      <span className="text-white/40"> founding access</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="mb-6 space-y-2">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-white/60">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-olive-light" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-col gap-2">
                      <Button
                        className="w-full"
                        onClick={() => handleCheckout(key)}
                        disabled={loading !== null}
                      >
                        {loading === key ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Reserve Founding Access"
                        )}
                      </Button>
                      <Button variant="secondary" className="w-full" asChild>
                        <a href="mailto:contact@isoml.com?subject=ISOML%20Design%20Partner%20Application">
                          Apply
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Button
            variant="outline"
            size="lg"
            onClick={handleWaitlist}
            disabled={loading !== null}
          >
            {loading === "waitlist" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Join Waitlist"
            )}
          </Button>
          <p className="mt-4 text-xs text-white/40">
            Coming-soon beta · Payment secures founding partner status · Replace Stripe test keys in production
          </p>
        </div>
      </div>
    </section>
  );
}
