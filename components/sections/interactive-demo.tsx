"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Upload,
  FileText,
  Users,
  Clock,
  Scale,
  BookOpen,
  GitBranch,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const steps = [
  { id: "upload", label: "Uploading discovery...", icon: Upload, duration: 1500 },
  { id: "evidence", label: "Organizing evidence", icon: FileText, duration: 1200 },
  { id: "witnesses", label: "Indexing witnesses", icon: Users, duration: 1000 },
  { id: "timeline", label: "Building timeline", icon: Clock, duration: 1000 },
  { id: "statutes", label: "Mapping statutes", icon: Scale, duration: 1200 },
  { id: "caselaw", label: "Researching case law", icon: BookOpen, duration: 1000 },
  { id: "graph", label: "Generating knowledge graph", icon: GitBranch, duration: 1500 },
];

export function InteractiveDemo() {
  const [running, setRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [complete, setComplete] = useState(false);

  const runDemo = async () => {
    setRunning(true);
    setComplete(false);
    setCurrentStep(0);

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      await new Promise((r) => setTimeout(r, steps[i].duration));
    }

    setComplete(true);
    setRunning(false);
  };

  return (
    <section id="demo" className="section-padding bg-navy-light/20" aria-labelledby="demo-heading">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <Badge variant="secondary" className="mb-4">Interactive Demo</Badge>
          <h2 id="demo-heading" className="text-3xl font-bold sm:text-4xl">
            See ISOML in action
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/60">
            Upload discovery and watch AI agents organize your case. Everything below is simulated.
          </p>
        </motion.div>

        <div className="mx-auto max-w-3xl">
          <div className="glass-card overflow-hidden">
            <div className="border-b border-white/10 bg-white/5 px-6 py-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500/60" />
                <div className="h-3 w-3 rounded-full bg-amber-500/60" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/60" />
                <span className="ml-2 text-xs text-white/40">ISOML Discover · Demo Mode</span>
              </div>
            </div>

            <div className="p-6">
              {!running && currentStep === -1 && !complete && (
                <div className="flex flex-col items-center py-12 text-center">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-dashed border-white/20 bg-white/5">
                    <Upload className="h-8 w-8 text-white/40" />
                  </div>
                  <p className="mb-2 text-lg font-medium">Drop discovery files here</p>
                  <p className="mb-6 text-sm text-white/40">
                    PDF, video, audio, photos, transcripts, phone extractions
                  </p>
                  <Button onClick={runDemo} size="lg">
                    <Upload className="mr-2 h-4 w-4" />
                    Simulate Upload &amp; Analysis
                  </Button>
                </div>
              )}

              {(running || complete) && (
                <div className="space-y-3">
                  {steps.map((step, i) => {
                    const isActive = i === currentStep && running;
                    const isDone = i < currentStep || complete;
                    const isPending = i > currentStep && !complete;

                    return (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`flex items-center gap-4 rounded-xl px-4 py-3 transition-colors ${
                          isActive ? "bg-olive/10 border border-olive/20" :
                          isDone ? "bg-white/5" : "opacity-40"
                        }`}
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
                          {isDone ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                          ) : isActive ? (
                            <Loader2 className="h-4 w-4 animate-spin text-olive-light" />
                          ) : (
                            <step.icon className="h-4 w-4 text-white/40" />
                          )}
                        </div>
                        <span className={`text-sm ${isActive ? "text-olive-light font-medium" : "text-white/60"}`}>
                          {isActive ? step.label : step.label.replace("...", "")}
                        </span>
                        {isDone && (
                          <Badge variant="success" className="ml-auto text-[10px]">Done</Badge>
                        )}
                        {isPending && (
                          <span className="ml-auto text-[10px] text-white/30">Pending</span>
                        )}
                      </motion.div>
                    );
                  })}

                  {complete && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center"
                    >
                      <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-emerald-400" />
                      <p className="font-medium text-emerald-400">Analysis complete</p>
                      <p className="mt-1 text-sm text-white/50">
                        847 documents indexed · 23 witnesses identified · 156 timeline events · Knowledge graph ready
                      </p>
                      <Button
                        variant="secondary"
                        className="mt-4"
                        onClick={() => { setCurrentStep(-1); setComplete(false); }}
                      >
                        Run again
                      </Button>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
