"use client";

import { motion } from "framer-motion";
import {
  Database,
  GitBranch,
  Search,
  BarChart3,
  Table2,
  Shield,
  AlertCircle,
  Scale,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function SearchMockup() {
  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-navy/50 px-4 py-3">
        <Search className="h-4 w-4 text-olive-light" />
        <span className="text-sm text-white/50">
          Show burglary cases with weak evidence on intent...
        </span>
      </div>
      <div className="mt-3 space-y-2">
        {[
          { case: "State v. Morrison", match: "Intent element — weak support", conf: "72%" },
          { case: "People v. Chen", match: "Burglary § 459 — gap identified", conf: "68%" },
          { case: "Commonwealth v. Reyes", match: "Comparable fact pattern", conf: "81%" },
        ].map((r) => (
          <div key={r.case} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-xs">
            <div>
              <span className="font-medium text-white/80">{r.case}</span>
              <p className="text-white/40">{r.match}</p>
            </div>
            <Badge variant="secondary">{r.conf}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

function CaseGraphMockup() {
  const nodes = ["Defendant", "Charges", "Evidence", "Witnesses", "Precedent", "Sentence"];
  return (
    <div className="glass-card p-4">
      <svg viewBox="0 0 400 200" className="w-full">
        {nodes.map((n, i) => {
          const x = 60 + (i % 3) * 130;
          const y = 50 + Math.floor(i / 3) * 100;
          return (
            <g key={n}>
              <circle cx={x} cy={y} r="24" fill="#556b2f" fillOpacity="0.2" stroke="#6b8a3a" strokeWidth="1" />
              <text x={x} y={y + 4} textAnchor="middle" className="fill-white/70 text-[9px]">{n}</text>
            </g>
          );
        })}
        <line x1="84" y1="50" x2="190" y2="50" stroke="#556b2f" strokeOpacity="0.4" />
        <line x1="190" y1="50" x2="296" y2="50" stroke="#556b2f" strokeOpacity="0.4" />
        <line x1="84" y1="150" x2="190" y2="150" stroke="#556b2f" strokeOpacity="0.4" />
        <line x1="60" y1="74" x2="60" y2="126" stroke="#556b2f" strokeOpacity="0.4" />
      </svg>
      <p className="mt-2 text-center text-xs text-white/40">Case graph · Every claim linked to source</p>
    </div>
  );
}

function SentencingChart() {
  const bars = [40, 65, 55, 80, 45, 70, 90, 50, 60, 75];
  const highlight = 5;
  return (
    <div className="glass-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium text-white/60">Comparable Sentences (months)</span>
        <Badge variant="warning">Above range</Badge>
      </div>
      <div className="flex h-32 items-end gap-1">
        {bars.map((h, i) => (
          <div
            key={i}
            className={`flex-1 rounded-t ${i === highlight ? "bg-amber-500/60" : "bg-olive/40"}`}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <p className="mt-3 text-xs text-amber-400/80">
        Compared with similar cases, this sentence appears above the observed range.
      </p>
      <p className="text-xs text-white/40">Attorney review required · Informational only</p>
    </div>
  );
}

function ElementsTable() {
  const rows = [
    { element: "Unlawful entry", support: "strong", evidence: "Security footage, witness stmt." },
    { element: "Intent to commit theft", support: "weak", evidence: "No direct evidence — gap identified" },
    { element: "Entry of structure", support: "aligned", evidence: "Police report, photos" },
  ];
  const supportColor = { strong: "success", weak: "warning", aligned: "default" } as const;
  return (
    <div className="glass-card overflow-hidden">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-white/10 bg-white/5">
            <th className="px-3 py-2 text-left font-medium text-white/60">Element</th>
            <th className="px-3 py-2 text-left font-medium text-white/60">Status</th>
            <th className="px-3 py-2 text-left font-medium text-white/60">Evidence</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.element} className="border-b border-white/5">
              <td className="px-3 py-2 text-white/80">{row.element}</td>
              <td className="px-3 py-2">
                <Badge variant={supportColor[row.support as keyof typeof supportColor]}>
                  {row.support}
                </Badge>
              </td>
              <td className="px-3 py-2 text-white/50">{row.evidence}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FairnessDashboard() {
  return (
    <div className="glass-card p-4">
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Median sentence", value: "36 mo", sub: "Comparable cases" },
          { label: "This case", value: "72 mo", sub: "Above observed range" },
          { label: "Variance index", value: "High", sub: "Charge-associated" },
          { label: "Plea effect", value: "-18 mo", sub: "Avg. reduction" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg bg-white/5 p-3">
            <p className="text-[10px] text-white/40">{s.label}</p>
            <p className="text-lg font-semibold text-white">{s.value}</p>
            <p className="text-[10px] text-white/30">{s.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContradictionDetector() {
  return (
    <div className="glass-card p-4">
      <div className="mb-3 flex items-center gap-2">
        <AlertCircle className="h-4 w-4 text-amber-400" />
        <span className="text-xs font-medium text-amber-400">Potential inconsistency identified</span>
      </div>
      <div className="space-y-2 text-xs">
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-2">
          <p className="font-medium text-white/70">Police Report § 3.2</p>
          <p className="text-white/50">&quot;Suspect fled on foot eastbound&quot;</p>
        </div>
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2">
          <p className="font-medium text-white/70">Body Camera · 14:32:08</p>
          <p className="text-white/50">&quot;Suspect visible walking westbound&quot;</p>
        </div>
      </div>
      <p className="mt-2 text-[10px] text-white/40">Evidence appears inconsistent with · Attorney review required</p>
    </div>
  );
}

function PrecedentPanel() {
  return (
    <div className="glass-card p-4">
      <p className="mb-3 text-xs font-medium text-white/60">Precedent Comparison</p>
      {[
        { case: "State v. Harrison (2019)", sim: "87%", type: "Similar" },
        { case: "People v. Nakamura (2021)", sim: "72%", type: "Distinguishable" },
        { case: "US v. Delgado (2018)", sim: "91%", type: "Similar" },
      ].map((c) => (
        <div key={c.case} className="mb-2 flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-xs">
          <div>
            <p className="text-white/80">{c.case}</p>
            <p className="text-white/40">{c.type} · {c.sim} match</p>
          </div>
          <Scale className="h-3 w-3 text-olive-light" />
        </div>
      ))}
    </div>
  );
}

export function JusticeDataEngine() {
  return (
    <section id="justice-engine" className="section-padding bg-navy-light/20" aria-labelledby="engine-heading">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <Badge className="mb-4">
            <Database className="mr-1 h-3 w-3" />
            Core Product
          </Badge>
          <h2 id="engine-heading" className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            The ISOML Justice Data Engine
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/60">
            Make clear the legal data that can make or break a case. ISOML helps
            legal professionals see gaps, alignments, contradictions, fairness
            concerns, sentencing disparities, and case-critical evidence patterns.
          </p>
        </motion.div>

        <Tabs defaultValue="search" className="w-full">
          <TabsList className="mb-6 flex w-full flex-wrap justify-center gap-1">
            <TabsTrigger value="search"><Search className="mr-1 h-3 w-3" />Search</TabsTrigger>
            <TabsTrigger value="graph"><GitBranch className="mr-1 h-3 w-3" />Case Graph</TabsTrigger>
            <TabsTrigger value="sentencing"><BarChart3 className="mr-1 h-3 w-3" />Sentencing</TabsTrigger>
            <TabsTrigger value="elements"><Table2 className="mr-1 h-3 w-3" />Elements</TabsTrigger>
            <TabsTrigger value="fairness"><Shield className="mr-1 h-3 w-3" />Fairness</TabsTrigger>
            <TabsTrigger value="contradiction"><AlertCircle className="mr-1 h-3 w-3" />Contradictions</TabsTrigger>
            <TabsTrigger value="precedent"><Scale className="mr-1 h-3 w-3" />Precedent</TabsTrigger>
          </TabsList>

          <TabsContent value="search"><SearchMockup /></TabsContent>
          <TabsContent value="graph"><CaseGraphMockup /></TabsContent>
          <TabsContent value="sentencing"><SentencingChart /></TabsContent>
          <TabsContent value="elements"><ElementsTable /></TabsContent>
          <TabsContent value="fairness"><FairnessDashboard /></TabsContent>
          <TabsContent value="contradiction"><ContradictionDetector /></TabsContent>
          <TabsContent value="precedent"><PrecedentPanel /></TabsContent>
        </Tabs>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 rounded-2xl border border-olive/20 bg-olive/5 p-6 text-center"
        >
          <p className="text-sm text-white/60">
            ISOML is not &quot;AI lawyer.&quot; ISOML is a{" "}
            <strong className="text-olive-light">legal intelligence platform</strong>, a{" "}
            <strong className="text-olive-light">justice data engine</strong>, and a{" "}
            <strong className="text-olive-light">fairness analytics platform</strong>.
            Every claim connects back to a source. No black-box legal conclusions.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
