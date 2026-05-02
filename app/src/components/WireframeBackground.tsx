export default function WireframeBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <svg
        viewBox="0 0 1200 600"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140vw] h-auto opacity-[0.08]"
        style={{ animation: 'wireframePulse 4s ease-in-out infinite' }}
      >
        <defs>
          <linearGradient id="wireGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#00D9FF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#00D9FF" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        {/* Semi-truck wireframe silhouette */}
        <g stroke="url(#wireGrad)" strokeWidth="1" fill="none">
          {/* Cab */}
          <path d="M 100 300 L 100 200 L 180 180 L 220 180 L 250 200 L 250 300 Z" />
          <path d="M 100 200 L 80 220 L 80 280 L 100 300" />
          <path d="M 180 180 L 180 160 L 220 160 L 220 180" />
          <path d="M 120 200 L 120 280 L 140 280 L 140 200" />
          <path d="M 160 200 L 160 280 L 200 280 L 200 200" />
          <path d="M 220 200 L 220 280 L 240 280 L 240 200" />
          {/* Hood/Engine */}
          <path d="M 250 300 L 250 220 L 350 210 L 400 210 L 420 230 L 420 300 Z" />
          <path d="M 280 230 L 280 280 L 320 280 L 320 230" />
          <path d="M 340 230 L 340 280 L 380 280 L 380 230" />
          <path d="M 400 230 L 400 280 L 410 280 L 410 230" />
          {/* Frame rails */}
          <path d="M 80 300 L 800 300" />
          <path d="M 80 320 L 800 320" />
          {/* Rear wheels */}
          <circle cx="520" cy="340" r="45" />
          <circle cx="520" cy="340" r="30" />
          <circle cx="520" cy="340" r="15" />
          <circle cx="620" cy="340" r="45" />
          <circle cx="620" cy="340" r="30" />
          <circle cx="620" cy="340" r="15" />
          <circle cx="720" cy="340" r="45" />
          <circle cx="720" cy="340" r="30" />
          <circle cx="720" cy="340" r="15" />
          {/* Front wheel */}
          <circle cx="180" cy="340" r="45" />
          <circle cx="180" cy="340" r="30" />
          <circle cx="180" cy="340" r="15" />
          {/* Sleeper cab detail */}
          <path d="M 80 220 L 40 240 L 40 280 L 80 280" />
          <path d="M 40 240 L 20 250 L 20 270 L 40 280" />
          {/* Exhaust stack */}
          <path d="M 60 240 L 50 180 L 55 175 L 65 185 L 70 240" />
          {/* Trailer hitch */}
          <path d="M 780 300 L 800 290 L 800 330 L 780 320" />
          {/* Fuel tanks */}
          <path d="M 260 320 L 260 360 L 340 360 L 340 320 Z" />
          <path d="M 270 330 L 270 350 L 330 350 L 330 330 Z" />
          {/* Detail lines */}
          <path d="M 100 250 L 240 250" />
          <path d="M 260 250 L 400 250" />
          <path d="M 150 180 L 150 160" />
          <path d="M 200 180 L 200 160" />
          <path d="M 300 210 L 300 230" />
          <path d="M 350 210 L 350 230" />
        </g>
        {/* Animated dots at joints */}
        <circle cx="180" cy="340" r="3" fill="#00D9FF" opacity="0.5">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="520" cy="340" r="3" fill="#00D9FF" opacity="0.5">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite" begin="1s" />
        </circle>
        <circle cx="620" cy="340" r="3" fill="#00D9FF" opacity="0.5">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite" begin="2s" />
        </circle>
        <circle cx="720" cy="340" r="3" fill="#00D9FF" opacity="0.5">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite" begin="0.5s" />
        </circle>
      </svg>
      <style>{`
        @keyframes wireframePulse {
          0%, 100% { opacity: 0.06; }
          50% { opacity: 0.12; }
        }
      `}</style>
    </div>
  );
}
