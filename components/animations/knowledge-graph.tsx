"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

const nodes = [
  { id: "evidence", label: "Evidence", x: 80, y: 200, color: "#6b8a3a" },
  { id: "statutes", label: "Statutes", x: 220, y: 80, color: "#556b2f" },
  { id: "caselaw", label: "Case Law", x: 380, y: 120, color: "#6b8a3a" },
  { id: "arguments", label: "Arguments", x: 520, y: 200, color: "#556b2f" },
  { id: "sentencing", label: "Sentencing", x: 400, y: 300, color: "#6b8a3a" },
];

const edges = [
  ["evidence", "statutes"],
  ["statutes", "caselaw"],
  ["caselaw", "arguments"],
  ["arguments", "sentencing"],
  ["evidence", "arguments"],
  ["statutes", "sentencing"],
];

export function KnowledgeGraph() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const paths = svg.querySelectorAll(".graph-edge");
    paths.forEach((path, i) => {
      const length = (path as SVGPathElement).getTotalLength();
      (path as SVGPathElement).style.strokeDasharray = `${length}`;
      (path as SVGPathElement).style.strokeDashoffset = `${length}`;
      (path as SVGPathElement).style.animation = `dash 2s ease forwards ${i * 0.3}s`;
    });
  }, []);

  const getNode = (id: string) => nodes.find((n) => n.id === id)!;

  const getPath = (from: string, to: string) => {
    const a = getNode(from);
    const b = getNode(to);
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2 - 30;
    return `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`;
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl glass-card glow-olive">
      <div className="absolute inset-0 grid-pattern opacity-50" />
      <svg
        ref={svgRef}
        viewBox="0 0 600 380"
        className="relative w-full"
        aria-label="Animated knowledge graph connecting evidence, statutes, case law, arguments, and sentencing"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#556b2f" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#6b8a3a" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#556b2f" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {edges.map(([from, to]) => (
          <path
            key={`${from}-${to}`}
            className="graph-edge"
            d={getPath(from, to)}
            fill="none"
            stroke="url(#edgeGrad)"
            strokeWidth="2"
            style={{ strokeDashoffset: 1000 }}
          />
        ))}

        {nodes.map((node, i) => (
          <g key={node.id}>
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="28"
              fill={node.color}
              fillOpacity="0.15"
              stroke={node.color}
              strokeWidth="1.5"
              filter="url(#glow)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
            />
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="6"
              fill={node.color}
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ delay: i * 0.15 + 0.5, duration: 2, repeat: Infinity }}
            />
            <text
              x={node.x}
              y={node.y + 48}
              textAnchor="middle"
              className="fill-white text-[13px] font-medium"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
      <div className="absolute bottom-4 left-4 rounded-lg bg-navy/80 px-3 py-1.5 text-xs text-white/60 backdrop-blur-sm">
        Justice Data Engine · Live Graph
      </div>
    </div>
  );
}
