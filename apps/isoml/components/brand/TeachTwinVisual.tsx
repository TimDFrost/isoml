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
          <stop offset="0%" stopColor="#0d1530" />
          <stop offset="55%" stopColor="#10182c" />
          <stop offset="100%" stopColor="#0a2030" />
        </linearGradient>
        <linearGradient id="bot" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8eef7" />
          <stop offset="100%" stopColor="#8d9bb0" />
        </linearGradient>
        <linearGradient id="glow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2de2e6" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#ff4fd8" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      <rect width="640" height="520" rx="36" fill="url(#sky)" />
      <ellipse cx="320" cy="430" rx="220" ry="28" fill="#000" opacity="0.28" />
      <circle cx="470" cy="120" r="90" fill="url(#glow)" />
      <circle cx="140" cy="90" r="60" fill="#ffd166" opacity="0.08" />

      <g transform="translate(120 120)">
        <ellipse cx="90" cy="250" rx="70" ry="18" fill="#000" opacity="0.22" />
        <path
          d="M40 250c8-78 28-128 50-128s42 50 50 128"
          fill="#c3ccd9"
          opacity="0.92"
        />
        <circle cx="90" cy="86" r="36" fill="#e8eef7" />
        <path
          d="M54 92c8-28 68-28 76 0"
          fill="none"
          stroke="#2de2e6"
          strokeWidth="8"
          strokeLinecap="round"
          opacity="0.7"
        />
        <path
          d="M58 168c24-18 44-18 68 0"
          fill="none"
          stroke="#ff4fd8"
          strokeWidth="10"
          strokeLinecap="round"
          opacity="0.65"
        />
        <path
          d="M148 170c34-8 68-4 96 18"
          fill="none"
          stroke="#e8eef7"
          strokeWidth="10"
          strokeLinecap="round"
          opacity="0.8"
        />
        <circle cx="248" cy="190" r="10" fill="#3dff8a" />
      </g>

      <g transform="translate(340 190)">
        <ellipse cx="90" cy="220" rx="78" ry="16" fill="#000" opacity="0.28" />
        <rect x="40" y="70" width="100" height="120" rx="28" fill="url(#bot)" />
        <rect x="58" y="92" width="64" height="36" rx="18" fill="#060914" opacity="0.9" />
        <circle cx="78" cy="110" r="7" fill="#2de2e6" className="animate-pulse-ring" />
        <circle cx="102" cy="110" r="7" fill="#ff4fd8" />
        <rect x="72" y="140" width="36" height="10" rx="5" fill="#060914" opacity="0.45" />
        <rect x="18" y="96" width="22" height="10" rx="5" fill="#ff3b5c" />
        <rect x="140" y="96" width="22" height="10" rx="5" fill="#ffd166" />
        <path d="M90 70 V42" stroke="#b7c2d4" strokeWidth="8" strokeLinecap="round" />
        <circle cx="90" cy="30" r="14" fill="#e8eef7" stroke="#2de2e6" strokeWidth="4" />
        <circle cx="90" cy="30" r="5" fill="#ff4fd8" />
        <rect x="58" y="188" width="20" height="28" rx="8" fill="#8d9bb0" />
        <rect x="102" y="188" width="20" height="28" rx="8" fill="#b7c2d4" />
      </g>

      <g opacity="0.95">
        <rect x="420" y="74" width="140" height="34" rx="17" fill="#151f38" stroke="#2a3555" />
        <text x="442" y="96" fontSize="14" fill="#c3ccd9" fontFamily="system-ui,sans-serif">
          stories · voice
        </text>
        <rect x="68" y="360" width="170" height="34" rx="17" fill="#151f38" stroke="#2a3555" />
        <text x="88" y="382" fontSize="14" fill="#c3ccd9" fontFamily="system-ui,sans-serif">
          preferences · boundaries
        </text>
      </g>
    </svg>
  );
}
