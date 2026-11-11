export function TeachTwinVisual({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 640 520"
      role="img"
      aria-label="A person teaching a small Reachy Mini-inspired robot"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#eef2ff" />
          <stop offset="55%" stopColor="#f7f8fb" />
          <stop offset="100%" stopColor="#e8f1ff" />
        </linearGradient>
        <linearGradient id="bot" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8b82f0" />
          <stop offset="100%" stopColor="#2b7fff" />
        </linearGradient>
        <linearGradient id="glow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6b5ce7" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#2b7fff" stopOpacity="0.08" />
        </linearGradient>
      </defs>

      <rect width="640" height="520" rx="36" fill="url(#sky)" />
      <ellipse cx="320" cy="430" rx="220" ry="28" fill="#12141a" opacity="0.06" />

      {/* soft ambient */}
      <circle cx="470" cy="120" r="90" fill="url(#glow)" />
      <circle cx="140" cy="90" r="60" fill="#2b7fff" opacity="0.08" />

      {/* person */}
      <g transform="translate(120 120)">
        <ellipse cx="90" cy="250" rx="70" ry="18" fill="#12141a" opacity="0.05" />
        <path
          d="M40 250c8-78 28-128 50-128s42 50 50 128"
          fill="#12141a"
          opacity="0.88"
        />
        <circle cx="90" cy="86" r="36" fill="#2a2f3c" />
        <path
          d="M54 92c8-28 68-28 76 0"
          fill="none"
          stroke="#6b5ce7"
          strokeWidth="8"
          strokeLinecap="round"
          opacity="0.55"
        />
        <path
          d="M58 168c24-18 44-18 68 0"
          fill="none"
          stroke="#2b7fff"
          strokeWidth="10"
          strokeLinecap="round"
          opacity="0.7"
        />
        {/* teaching gesture */}
        <path
          d="M148 170c34-8 68-4 96 18"
          fill="none"
          stroke="#12141a"
          strokeWidth="10"
          strokeLinecap="round"
          opacity="0.75"
        />
        <circle cx="248" cy="190" r="10" fill="#6b5ce7" />
      </g>

      {/* robot */}
      <g transform="translate(340 190)">
        <ellipse cx="90" cy="220" rx="78" ry="16" fill="#12141a" opacity="0.07" />
        <rect x="40" y="70" width="100" height="120" rx="28" fill="url(#bot)" />
        <rect x="58" y="92" width="64" height="36" rx="18" fill="#0f172a" opacity="0.85" />
        <circle cx="78" cy="110" r="7" fill="#9ae6ff" className="animate-pulse-ring" />
        <circle cx="102" cy="110" r="7" fill="#c4b5fd" />
        <rect x="72" y="140" width="36" height="10" rx="5" fill="white" opacity="0.55" />
        <rect x="18" y="96" width="22" height="10" rx="5" fill="#6b5ce7" />
        <rect x="140" y="96" width="22" height="10" rx="5" fill="#2b7fff" />
        <path
          d="M90 70 V42"
          stroke="#5246c7"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <circle cx="90" cy="30" r="14" fill="#ffffff" stroke="#6b5ce7" strokeWidth="4" />
        {/* antenna blink */}
        <circle cx="90" cy="30" r="5" fill="#2b7fff" />
        {/* legs */}
        <rect x="58" y="188" width="20" height="28" rx="8" fill="#5246c7" />
        <rect x="102" y="188" width="20" height="28" rx="8" fill="#1f6fe0" />
      </g>

      {/* floating lesson chips */}
      <g opacity="0.9">
        <rect x="420" y="74" width="140" height="34" rx="17" fill="white" stroke="#d7dceb" />
        <text x="442" y="96" fontSize="14" fill="#3a3f4d" fontFamily="system-ui,sans-serif">
          stories · voice
        </text>
        <rect x="68" y="360" width="170" height="34" rx="17" fill="white" stroke="#d7dceb" />
        <text x="88" y="382" fontSize="14" fill="#3a3f4d" fontFamily="system-ui,sans-serif">
          preferences · boundaries
        </text>
      </g>
    </svg>
  );
}
