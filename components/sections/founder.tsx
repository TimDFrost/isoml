"use client";

import { motion } from "framer-motion";
import { User } from "lucide-react";

export function Founder() {
  return (
    <section id="founder" className="section-padding bg-navy-light/20" aria-labelledby="founder-heading">
      <div className="container-max">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-8 sm:flex-row sm:items-start"
          >
            <div className="flex h-40 w-40 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-olive/20 to-navy-light">
              <User className="h-20 w-20 text-white/20" aria-hidden="true" />
              <span className="sr-only">Tim Frost headshot placeholder</span>
            </div>

            <div>
              <h2 id="founder-heading" className="text-3xl font-bold">
                Tim Frost
              </h2>
              <p className="mt-1 text-olive-light">Founder, Oh Ya Inc.</p>

              <div className="mt-6 space-y-3 text-white/60">
                <p>Former U.S. Army Cavalry Scout.</p>
                <p>Builder. Entrepreneur.</p>
                <p>
                  Passionate about AI, legal technology, and improving access to
                  transparent legal analysis.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {["Builder", "Entrepreneur", "Veteran", "Legal Tech"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/50"
                  >
                    {tag}
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
