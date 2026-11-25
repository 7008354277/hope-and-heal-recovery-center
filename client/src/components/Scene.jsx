// Illustrated rehabilitation center at sunrise. Replace with a real photo any time (see site.heroPhoto).
export function Scene({ className = '' }) {
  return (
    <svg className={`scene ${className}`} viewBox="0 0 800 480" preserveAspectRatio="xMidYMax meet" role="img" aria-label="Illustration of the recovery center building at sunrise">
      <defs>
        <radialGradient id="hhGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#f7c548" /><stop offset=".55" stopColor="#e8a317" /><stop offset="1" stopColor="#e8a317" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g className="scene-sun"><circle cx="400" cy="262" r="200" fill="url(#hhGlow)" /></g>
      <g className="scene-cloud c1" fill="#fff" opacity=".85"><ellipse cx="130" cy="110" rx="60" ry="16" /><ellipse cx="170" cy="100" rx="40" ry="14" /></g>
      <g className="scene-cloud c2" fill="#fff" opacity=".7"><ellipse cx="640" cy="70" rx="55" ry="14" /><ellipse cx="610" cy="62" rx="34" ry="12" /></g>
      <path d="M0 335 C120 275 240 305 360 288 C480 272 600 242 800 305 L800 480 L0 480Z" fill="#d9cde6" />
      <path d="M0 372 C140 322 260 352 400 337 C540 322 680 332 800 352 L800 480 L0 480Z" fill="#b9ba8c" />

      {/* trees */}
      <g className="scene-tree" style={{ transformOrigin: '110px 392px' }}><rect x="106" y="340" width="8" height="52" fill="#5d4a3a" /><circle cx="110" cy="320" r="38" fill="#6f7a52" /><circle cx="90" cy="338" r="24" fill="#8a9461" /><circle cx="132" cy="336" r="26" fill="#7d8858" /></g>
      <g className="scene-tree t2" style={{ transformOrigin: '170px 392px' }}><rect x="167" y="360" width="6" height="32" fill="#5d4a3a" /><circle cx="170" cy="348" r="24" fill="#8a9461" /></g>
      <g className="scene-tree t3" style={{ transformOrigin: '690px 392px' }}><rect x="686" y="338" width="8" height="54" fill="#5d4a3a" /><circle cx="690" cy="316" r="40" fill="#6f7a52" /><circle cx="670" cy="336" r="25" fill="#8a9461" /><circle cx="714" cy="334" r="26" fill="#7d8858" /></g>
      <g className="scene-tree t4" style={{ transformOrigin: '630px 392px' }}><rect x="627" y="362" width="6" height="30" fill="#5d4a3a" /><circle cx="630" cy="350" r="22" fill="#8a9461" /></g>

      {/* building */}
      <g>
        <polygon points="205,318 260,282 315,318" fill="#22345f" /><rect x="215" y="316" width="90" height="68" fill="#f3e9f6" />
        <polygon points="485,318 540,282 595,318" fill="#22345f" /><rect x="495" y="316" width="90" height="68" fill="#f3e9f6" />
        <polygon points="288,288 400,224 512,288" fill="#14213f" /><rect x="300" y="286" width="200" height="98" fill="#fbf9fc" />
        <rect x="300" y="286" width="200" height="6" fill="#e8a317" />
        <g fill="#f7c548" className="scene-windows">
          <rect x="322" y="304" width="20" height="28" rx="2" /><rect x="352" y="304" width="20" height="28" rx="2" /><rect x="428" y="304" width="20" height="28" rx="2" /><rect x="458" y="304" width="20" height="28" rx="2" />
          <rect x="322" y="344" width="20" height="28" rx="2" /><rect x="352" y="344" width="20" height="28" rx="2" /><rect x="428" y="344" width="20" height="28" rx="2" /><rect x="458" y="344" width="20" height="28" rx="2" />
          <rect x="236" y="336" width="18" height="24" rx="2" /><rect x="266" y="336" width="18" height="24" rx="2" /><rect x="516" y="336" width="18" height="24" rx="2" /><rect x="546" y="336" width="18" height="24" rx="2" />
        </g>
        <path d="M378 384 V344 a22 22 0 0 1 44 0 V384Z" fill="#14213f" /><path d="M385 384 V346 a15 15 0 0 1 30 0 V384Z" fill="#e8a317" />
        <rect x="370" y="246" width="60" height="24" rx="5" fill="#e8a317" />
        <text x="400" y="263.5" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontWeight="700" fontSize="16" fill="#14213f">HH</text>
      </g>

      {/* ground, path, shrubs */}
      <path d="M0 392 C200 374 600 374 800 392 L800 480 L0 480Z" fill="#14213f" />
      <path d="M372 384 L428 384 L486 480 L314 480Z" fill="#f3e9f6" opacity=".92" />
      <circle cx="340" cy="388" r="14" fill="#6f7a52" /><circle cx="318" cy="392" r="11" fill="#8a9461" /><circle cx="460" cy="388" r="14" fill="#6f7a52" /><circle cx="482" cy="392" r="11" fill="#8a9461" />
    </svg>
  );
}

// Soft layered hills used as a horizon line under page headers.
export function Horizon({ dark = false }) {
  return (
    <svg className={`horizon ${dark ? 'dark' : ''}`} viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true">
      <path className="h1" d="M0 70 C150 20 300 80 480 50 C660 20 800 70 1000 40 C1100 25 1160 40 1200 50 V120 H0Z" />
      <path className="h2" d="M0 90 C200 55 360 100 560 80 C760 60 940 95 1200 70 V120 H0Z" />
      <path className="h3" d="M0 108 C300 90 700 112 1200 96 V120 H0Z" />
    </svg>
  );
}
