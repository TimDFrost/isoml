"use client";

import { motion } from "framer-motion";
import { Scale } from "lucide-react";

export function Mission() {
  return (
    <section id="mission" className="section-padding bg-navy-light/30" aria-labelledby="mission-heading">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-6 inline-flex items-center justify-center rounded-full bg-olive/10 p-3">
            <Scale className="h-6 w-6 text-olive-light" aria-hidden="true" />
          </div>

          <h2 id="mission-heading" className="text-3xl font-bold sm:text-4xl">
            Mission
          </h2>

          <div className="mt-8 space-y-6 text-lg leading-relaxed text-white/60">
            <p>
              The legal system produces enormous amounts of information.
            </p>
            <p className="text-xl font-medium text-white/80">
              Finding truth should not depend on who can read the fastest.
            </p>
            <p>
              ISOML exists to help legal professionals organize information,
              identify relationships, and build transparent legal analysis.
            </p>
            <p className="rounded-xl border border-olive/20 bg-olive/5 px-6 py-4 text-olive-light">
              Human judgment always remains central.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
