"use client";

import { motion } from "framer-motion";
import { Eye, Zap, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const reasons = [
  {
    icon: Eye,
    title: "Transparency",
    description:
      "Understand why a conclusion is supported. Every insight links back to source documents with confidence indicators.",
  },
  {
    icon: Zap,
    title: "Speed",
    description:
      "Reduce hours spent manually reviewing discovery. AI agents organize, index, and surface connections automatically.",
  },
  {
    icon: Target,
    title: "Better Preparation",
    description:
      "Surface connections lawyers may otherwise miss — contradictions, gaps, comparable precedent, and sentencing patterns.",
  },
];

export function WhyIsoml() {
  return (
    <section className="section-padding" aria-labelledby="why-heading">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 id="why-heading" className="text-3xl font-bold sm:text-4xl">
            Why ISOML
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {reasons.map((reason, i) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-olive/15">
                    <reason.icon className="h-7 w-7 text-olive-light" />
                  </div>
                  <CardTitle>{reason.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-white/60">
                    {reason.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
