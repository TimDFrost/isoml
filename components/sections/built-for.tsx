"use client";

import { motion } from "framer-motion";
import {
  Briefcase,
  Shield,
  Gavel,
  Scale,
  BookOpen,
  Heart,
  Search,
  Building2,
  GraduationCap,
} from "lucide-react";

const audiences = [
  { icon: Briefcase, label: "Criminal defense attorneys" },
  { icon: Shield, label: "Public defenders" },
  { icon: Gavel, label: "Prosecutors" },
  { icon: Scale, label: "Civil rights lawyers" },
  { icon: BookOpen, label: "Appellate lawyers" },
  { icon: Heart, label: "Innocence organizations" },
  { icon: Search, label: "Legal researchers" },
  { icon: Building2, label: "Policy teams" },
  { icon: GraduationCap, label: "Law schools" },
];

export function BuiltFor() {
  return (
    <section className="section-padding" aria-labelledby="built-for-heading">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 id="built-for-heading" className="text-3xl font-bold sm:text-4xl">
            Built for Legal Professionals
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
          {audiences.map((a, i) => (
            <motion.div
              key={a.label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:border-olive/20 hover:bg-olive/5"
            >
              <a.icon className="h-5 w-5 shrink-0 text-olive-light" aria-hidden="true" />
              <span className="text-sm text-white/70">{a.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
