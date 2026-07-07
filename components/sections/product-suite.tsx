"use client";

import { motion } from "framer-motion";
import {
  FolderSearch,
  Layers,
  BookOpen,
  Clock,
  Scale,
  FileText,
  Video,
  Camera,
  Mic,
  Phone,
  Image,
  FileAudio,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const products = [
  {
    id: "discover",
    name: "ISOML Discover",
    tagline: "AI-assisted discovery organization",
    icon: FolderSearch,
    description: "Upload and automatically index all discovery materials.",
    uploads: [
      { icon: FileText, label: "PDF" },
      { icon: Video, label: "Video" },
      { icon: Camera, label: "Body camera" },
      { icon: Mic, label: "Audio" },
      { icon: Phone, label: "Phone extractions" },
      { icon: Image, label: "Photos" },
      { icon: FileAudio, label: "Transcripts" },
    ],
    features: ["Automatically indexes everything", "Full-text search across all media", "Metadata extraction"],
  },
  {
    id: "elements",
    name: "ISOML Elements",
    tagline: "Maps evidence to statutory elements",
    icon: Layers,
    description: "Visual alignment of evidence against each statutory element.",
    features: [
      "Evidence supporting each element",
      "Evidence contradicting an element",
      "Potential gaps identified",
      "Citations with source links",
    ],
  },
  {
    id: "precedent",
    name: "ISOML Precedent",
    tagline: "Research assistant for case law",
    icon: BookOpen,
    description: "Compare and contrast cases with verified citations.",
    features: [
      "Case law, statutes, rules",
      "Historical opinions",
      "Compare and contrast cases",
      "Never fabricate citations",
    ],
  },
  {
    id: "timeline",
    name: "ISOML Timeline",
    tagline: "Interactive case timeline",
    icon: Clock,
    description: "Chronological view of every event in a case.",
    features: [
      "Events & evidence",
      "Witnesses & court filings",
      "Motion practice",
      "Trial & appeal tracking",
    ],
  },
  {
    id: "fair",
    name: "ISOML Fair",
    tagline: "See sentencing clearly",
    icon: Scale,
    description: "Research dashboard exploring sentencing consistency.",
    features: [
      "Visual analytics",
      "Comparable cases",
      "Sentencing ranges",
      "Historical trends",
    ],
    disclaimer: "Sentencing decisions remain the responsibility of courts. Analytics are informational.",
  },
];

export function ProductSuite() {
  return (
    <section id="products" className="section-padding" aria-labelledby="products-heading">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 id="products-heading" className="text-3xl font-bold sm:text-4xl">
            Product Suite
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/60">
            A complete legal intelligence platform built on the Justice Data Engine.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={product.id === "fair" ? "md:col-span-2 lg:col-span-1" : ""}
            >
              <Card className="group h-full transition-all hover:border-olive/30 hover:shadow-olive/10">
                <CardHeader>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-olive/15 transition-colors group-hover:bg-olive/25">
                    <product.icon className="h-6 w-6 text-olive-light" />
                  </div>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>{product.tagline}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-white/50">{product.description}</p>

                  {product.uploads && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {product.uploads.map((u) => (
                        <Badge key={u.label} variant="secondary" className="gap-1">
                          <u.icon className="h-3 w-3" />
                          {u.label}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <ul className="space-y-2">
                    {product.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-white/60">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-olive-light" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {product.disclaimer && (
                    <p className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-400/80">
                      {product.disclaimer}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
