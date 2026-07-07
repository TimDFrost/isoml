"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const alignmentTypes = [
  { label: "Aligned evidence", variant: "success" as const, count: 24 },
  { label: "Missing evidence", variant: "warning" as const, count: 7 },
  { label: "Contradictory evidence", variant: "danger" as const, count: 3 },
  { label: "Weak support", variant: "secondary" as const, count: 5 },
  { label: "Strong support", variant: "success" as const, count: 18 },
  { label: "Procedural gaps", variant: "warning" as const, count: 2 },
  { label: "Sentencing inconsistencies", variant: "danger" as const, count: 4 },
  { label: "Fairness concerns", variant: "warning" as const, count: 1 },
];

const comparisons = [
  "Evidence",
  "Statutory elements",
  "Witness statements",
  "Police reports",
  "Precedent cases",
  "Sentencing ranges",
  "Actual sentencing outcomes",
  "Comparable fact patterns",
];

export function GapAnalysis() {
  return (
    <section className="section-padding" aria-labelledby="gap-heading">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 id="gap-heading" className="text-3xl font-bold sm:text-4xl">
            Gap &amp; Alignment Analysis
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/60">
            Compare evidence, statutes, witnesses, precedent, and sentencing outcomes
            in a single dashboard view.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="glass-card p-6">
            <h3 className="mb-4 text-sm font-semibold text-white/80">Compares</h3>
            <div className="grid grid-cols-2 gap-2">
              {comparisons.map((c) => (
                <div key={c} className="rounded-lg bg-white/5 px-3 py-2 text-xs text-white/60">
                  {c}
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="mb-4 text-sm font-semibold text-white/80">Visual Signals</h3>
            <div className="space-y-2">
              {alignmentTypes.map((a) => (
                <div key={a.label} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
                  <Badge variant={a.variant}>{a.label}</Badge>
                  <span className="text-sm font-medium text-white/60">{a.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 rounded-xl border border-white/10 bg-white/5 p-6"
        >
          <p className="text-center text-sm text-white/50">
            Language used: &quot;Potential issue identified&quot; · &quot;Evidence appears to support&quot; ·
            &quot;Evidence appears inconsistent with&quot; · &quot;Comparable cases suggest&quot; ·
            &quot;Attorney review required&quot;
          </p>
        </motion.div>
      </div>
    </section>
  );
}
