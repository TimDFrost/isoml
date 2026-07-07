"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { KnowledgeGraph } from "@/components/animations/knowledge-graph";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-16" aria-labelledby="hero-heading">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-olive/10 blur-[120px]" />

      <div className="container-max relative section-padding">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Badge variant="secondary" className="mb-6">
              Coming Soon · Beta Access Opening
            </Badge>

            <h1
              id="hero-heading"
              className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
            >
              <span className="text-gradient">In Search of</span>
              <br />
              <span className="text-gradient-olive">Modern Law</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/60">
              AI agents that help legal professionals organize discovery, connect
              evidence to statutory elements, research precedent, and build
              transparent legal analysis.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button size="lg" asChild>
                <Link href="#partners">
                  Request Early Access
                  <ArrowRight className="ml-1" />
                </Link>
              </Button>
              <Button variant="secondary" size="lg" asChild>
                <Link href="#partners">Become a Founding Design Partner</Link>
              </Button>
              <Button variant="ghost" size="lg" asChild>
                <Link href="#demo">
                  <Play className="mr-1 h-4 w-4" />
                  Watch the Vision
                </Link>
              </Button>
            </div>

            <p className="mt-6 text-xs text-white/40">
              A product of Oh Ya Inc. · Human judgment always remains central.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="animate-float"
          >
            <KnowledgeGraph />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
