"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const examples = [
  "Show burglary cases with weak evidence on intent.",
  "Find cases where body camera footage contradicted the police report.",
  "Compare sentencing outcomes for similar drug possession cases.",
  "Find precedent involving unlawful search of a vehicle.",
  "Show cases where mandatory minimums created unusually harsh outcomes.",
  "Which evidence supports element three of this offense?",
  "Where does the discovery contradict the charging document?",
  "Find comparable cases with lower sentences.",
];

export function SearchExperience() {
  return (
    <section className="section-padding bg-navy-light/20" aria-labelledby="search-heading">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 id="search-heading" className="text-3xl font-bold sm:text-4xl">
            Powerful Search
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/60">
            Query the Justice Data Engine in natural language. Every result links to source documents.
          </p>
        </motion.div>

        <div className="mx-auto max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-olive-light" />
            <Input
              placeholder="Search cases, evidence, statutes, sentencing patterns..."
              className="h-14 pl-12 text-base"
              aria-label="Search the Justice Data Engine"
            />
          </div>

          <div className="mt-6">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-white/40">
              Try these searches
            </p>
            <div className="flex flex-wrap gap-2">
              {examples.map((ex) => (
                <button
                  key={ex}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-left text-xs text-white/50 transition-colors hover:border-olive/30 hover:bg-olive/10 hover:text-olive-light"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
