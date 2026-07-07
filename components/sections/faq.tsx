"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Is AI replacing lawyers?",
    a: "No. Lawyers remain responsible for legal strategy and professional judgment. ISOML assists with organizing and researching information — it does not make legal decisions.",
  },
  {
    q: "How accurate is it?",
    a: "Responses should always be reviewed by qualified legal professionals. ISOML provides source-linked analysis with confidence indicators, but attorney review is always required.",
  },
  {
    q: "Does it make legal decisions?",
    a: "No. ISOML assists with analysis; it does not determine guilt, innocence, or sentencing. All outputs use language such as 'potential issue identified' and 'attorney review required.'",
  },
  {
    q: "What is the Justice Data Engine?",
    a: "The ISOML Justice Data Engine is a searchable, indexed legal database that organizes discovery, statutes, precedent, sentencing data, and case relationships into a structured graph. Every claim connects back to a source.",
  },
  {
    q: "Is this a finished product?",
    a: "ISOML is currently in beta development. Founding Design Partners receive early access and help shape the roadmap. We are transparent that this is a coming-soon product.",
  },
  {
    q: "How does ISOML Fair work?",
    a: "ISOML Fair provides visual analytics comparing sentencing outcomes across similar cases. It shows ranges, outliers, and trends — but clearly indicates that sentencing decisions remain the responsibility of courts and that analytics are informational only.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="section-padding bg-navy-light/20" aria-labelledby="faq-heading">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 id="faq-heading" className="text-3xl font-bold sm:text-4xl">
            Frequently Asked Questions
          </h2>
        </motion.div>

        <div className="mx-auto max-w-2xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{faq.q}</AccordionTrigger>
                <AccordionContent>{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
