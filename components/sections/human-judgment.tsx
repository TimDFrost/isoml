"use client";

import { motion } from "framer-motion";
import { UserCheck } from "lucide-react";

const principles = [
  "ISOML does not decide guilt.",
  "ISOML does not replace attorneys.",
  "ISOML does not issue legal advice to consumers.",
  "ISOML helps qualified professionals see the legal data more clearly.",
];

export function HumanJudgment() {
  return (
    <section className="section-padding bg-olive/5" aria-labelledby="judgment-heading">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-6 inline-flex items-center justify-center rounded-full bg-olive/15 p-3">
            <UserCheck className="h-6 w-6 text-olive-light" aria-hidden="true" />
          </div>

          <h2 id="judgment-heading" className="text-3xl font-bold sm:text-4xl">
            Human Judgment First
          </h2>

          <ul className="mt-8 space-y-4">
            {principles.map((p) => (
              <li
                key={p}
                className="rounded-xl border border-white/10 bg-white/5 px-6 py-4 text-lg text-white/70"
              >
                {p}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
