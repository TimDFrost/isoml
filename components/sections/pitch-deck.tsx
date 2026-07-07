"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const slides = [
  {
    title: "Problem",
    content:
      "The legal process is messy, expensive, fragmented, and difficult to understand. Discovery, statutes, precedent, sentencing history, and court outcomes are scattered across disconnected systems.",
    highlight: "Legal data is everywhere. Truth is buried.",
  },
  {
    title: "Vision",
    content:
      "ISOML organizes legal data into a clear, searchable, explainable structure. The objective is not to replace lawyers — it is to reveal the evidence, law, statistics, and patterns that help people make better legal decisions.",
    highlight: "In Search of Modern Law",
  },
  {
    title: "Market",
    content:
      "Criminal defense attorneys, public defenders, prosecutors, civil rights lawyers, appellate lawyers, innocence organizations, legal researchers, policy teams, and law schools.",
    highlight: "$12B+ legal tech market",
  },
  {
    title: "Technology",
    content:
      "The ISOML Justice Data Engine indexes discovery, maps evidence to statutory elements, compares precedent, and reveals sentencing patterns. AI agents with source-linked outputs. No black-box conclusions.",
    highlight: "Justice Data Engine",
  },
  {
    title: "Roadmap",
    content:
      "Q3 2026: Beta launch with founding partners. Q4 2026: Elements & Precedent modules. Q1 2027: Fair sentencing dashboard. Q2 2027: Multi-jurisdiction expansion.",
    highlight: "Beta launching 2026",
  },
  {
    title: "Business Model",
    content:
      "SaaS subscription for legal professionals. Founding Design Partner program with discounted lifetime pricing. Enterprise custom deployments for large firms and organizations.",
    highlight: "Founding partner pricing",
  },
  {
    title: "Founding Partner Program",
    content:
      "Limited to first 100 firms. Early beta access, roadmap influence, private demonstrations, discounted lifetime pricing, quarterly founder meetings, and optional recognition.",
    highlight: "100 spots available",
  },
];

export function PitchDeck() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((c) => (c + 1) % slides.length);
  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);

  const handleDownload = () => {
    const content = slides.map((s, i) => `Slide ${i + 1}: ${s.title}\n${s.highlight}\n${s.content}\n`).join("\n---\n\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ISOML-Pitch-Deck-Preview.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="pitch-deck" className="section-padding" aria-labelledby="deck-heading">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 text-center"
        >
          <h2 id="deck-heading" className="text-3xl font-bold sm:text-4xl">
            Pitch Deck
          </h2>
          <p className="mt-2 text-white/50">Preview our investor presentation</p>
        </motion.div>

        <div className="mx-auto max-w-3xl">
          <div className="glass-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-6 py-3">
              <span className="text-xs text-white/40">
                Slide {current + 1} of {slides.length}
              </span>
              <Button variant="ghost" size="sm" onClick={handleDownload}>
                <Download className="mr-1 h-3 w-3" />
                Download Preview
              </Button>
            </div>

            <div className="flex min-h-[320px] flex-col justify-center p-8 sm:p-12">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="mb-2 text-sm font-medium uppercase tracking-wider text-olive-light">
                  {slides[current].title}
                </p>
                <h3 className="mb-6 text-2xl font-bold sm:text-3xl">
                  {slides[current].highlight}
                </h3>
                <p className="text-lg leading-relaxed text-white/60">
                  {slides[current].content}
                </p>
              </motion.div>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 px-6 py-4">
              <Button variant="ghost" size="sm" onClick={prev} aria-label="Previous slide">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex gap-1.5">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === current ? "w-6 bg-olive-light" : "w-2 bg-white/20"
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
              <Button variant="ghost" size="sm" onClick={next} aria-label="Next slide">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
