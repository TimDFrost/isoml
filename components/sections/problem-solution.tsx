"use client";

import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Eye } from "lucide-react";

const problems = [
  "Legal data is everywhere.",
  "Truth is buried in discovery.",
  "Sentencing is often difficult to compare.",
  "Similar cases can produce very different outcomes.",
  "Legal teams spend enormous time organizing information before they can even begin strategic analysis.",
];

const reveals = [
  "Evidence gaps",
  "Element alignment",
  "Contradictions",
  "Comparable precedent",
  "Sentencing disparities",
  "Fairness concerns",
  "Case-critical patterns",
];

export function ProblemSolution() {
  return (
    <section className="section-padding" aria-labelledby="problem-heading">
      <div className="container-max">
        <div className="grid gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4 flex items-center gap-2 text-red-400">
              <AlertTriangle className="h-5 w-5" aria-hidden="true" />
              <span className="text-sm font-medium uppercase tracking-wider">The Problem</span>
            </div>
            <h2 id="problem-heading" className="text-3xl font-bold sm:text-4xl">
              Legal data is fragmented
            </h2>
            <ul className="mt-8 space-y-4">
              {problems.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-white/60">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400/60" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4 flex items-center gap-2 text-olive-light">
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
              <span className="text-sm font-medium uppercase tracking-wider">The Solution</span>
            </div>
            <h2 className="text-3xl font-bold sm:text-4xl">
              One searchable justice intelligence layer
            </h2>
            <p className="mt-6 text-lg text-white/60">
              ISOML indexes discovery, statutes, precedent, and sentencing data
              into one searchable justice intelligence layer powered by the{" "}
              <strong className="text-white/80">ISOML Justice Data Engine</strong>.
            </p>

            <div className="mt-8">
              <div className="mb-4 flex items-center gap-2 text-white/80">
                <Eye className="h-4 w-4 text-olive-light" aria-hidden="true" />
                <span className="text-sm font-semibold">What ISOML Reveals</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {reveals.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-olive/20 bg-olive/10 px-3 py-1 text-sm text-olive-light"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
