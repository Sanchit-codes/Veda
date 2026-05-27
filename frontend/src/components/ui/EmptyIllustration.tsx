export default function EmptyIllustration({ size = 300 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 300 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle */}
      <circle cx="150" cy="150" r="120" fill="#e8e4f0" />

      {/* Paper */}
      <rect x="88" y="72" width="84" height="112" rx="10" fill="white" filter="url(#shadow)" />
      {/* Paper lines */}
      <rect x="102" y="90" width="36" height="7" rx="3.5" fill="#011625" />
      <rect x="102" y="107" width="56" height="5" rx="2.5" fill="#d4d4d4" />
      <rect x="102" y="120" width="56" height="5" rx="2.5" fill="#d4d4d4" />
      <rect x="102" y="133" width="56" height="5" rx="2.5" fill="#d4d4d4" />
      <rect x="102" y="146" width="56" height="5" rx="2.5" fill="#d4d4d4" />

      {/* Cloud top-right */}
      <ellipse cx="213" cy="90" rx="24" ry="14" fill="white" fillOpacity="0.9" />
      <ellipse cx="200" cy="95" rx="18" ry="12" fill="white" fillOpacity="0.9" />
      <ellipse cx="220" cy="98" rx="16" ry="10" fill="white" fillOpacity="0.9" />

      {/* Magnifying glass */}
      <circle cx="185" cy="183" r="46" fill="rgba(180,170,210,0.35)" />
      <circle cx="185" cy="183" r="36" fill="white" fillOpacity="0.6" stroke="#ccc6d9" strokeWidth="3" />
      <line x1="209" y1="207" x2="230" y2="228" stroke="#9e94b8" strokeWidth="8" strokeLinecap="round" />

      {/* X inside magnifier */}
      <path d="M173 171L197 195M197 171L173 195" stroke="#ff4040" strokeWidth="7" strokeLinecap="round" />

      {/* Doodle sparkles */}
      <path d="M78 230 L82 220 L86 230 L82 240 Z" fill="#ccc6d9" opacity="0.6" />
      <path d="M220 140 L224 132 L228 140 L224 148 Z" fill="#ccc6d9" opacity="0.5" />
      {/* Pen doodle */}
      <path d="M96 82 Q90 72 82 80 Q76 66 86 60" stroke="#9e94b8" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="rgba(146,146,146,0.25)" />
        </filter>
      </defs>
    </svg>
  );
}
