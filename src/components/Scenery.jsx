import React from 'react';

// A quiet golden-hour ridge line with a foreground foliage silhouette —
// same drawing technique as the hero landscape, recolored to fit whichever
// panel it sits in ('light' = cream/amber, 'dark' = charcoal/ember).
const peak = (v) => 1 - 2 * Math.abs(Math.sin(v));

function ridge(seed, base, amp) {
  const pts = [];
  for (let x = -10; x <= 110; x += 4) {
    const w = 0.55 * peak(x / 26 + seed) + 0.3 * Math.sin(x / 14 + seed * 1.7) + 0.15 * peak(x / 9 + seed * 2.3);
    pts.push(`${x},${(base - amp * w).toFixed(1)}`);
  }
  return `M${pts.join(' L')} L110,100 L-10,100 Z`;
}

const PALETTES = {
  light: {
    sky: ['#f3ecd9', '#f6e3bd', '#eec98a'],
    sun: '#fff6dd',
    ridges: ['#c9b990', '#a89268', '#7d6c4a', '#544632'],
    leaf: '#332c20',
  },
  dark: {
    sky: ['#241d12', '#3a2612', '#7a4318'],
    sun: '#ffdca0',
    ridges: ['#5a4326', '#3c2c19', '#241a10', '#120d08'],
    leaf: '#0c0906',
  },
};

export default function Scenery({ variant = 'light' }) {
  const p = PALETTES[variant];
  const id = variant;
  return (
    <svg className={`scenery scenery-${variant}`} viewBox="0 0 100 100" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.sky[0]} />
          <stop offset="0.55" stopColor={p.sky[1]} />
          <stop offset="1" stopColor={p.sky[2]} />
        </linearGradient>
        <radialGradient id={`sun-${id}`} cx="50%" cy="46%" r="50%">
          <stop offset="0" stopColor={p.sun} stopOpacity=".95" />
          <stop offset="1" stopColor={p.sun} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="100" height="100" fill={`url(#sky-${id})`} />
      <circle className="scenery-sun" cx="52" cy="46" r="30" fill={`url(#sun-${id})`} />
      <circle cx="52" cy="46" r="7.5" fill={p.sun} opacity=".9" />
      {p.ridges.map((c, i) => (
        <path key={c} className={`scenery-ridge scenery-ridge-${i}`} d={ridge(i * 1.6 + 0.4, 58 + i * 11, 10 + i * 2)} fill={c} />
      ))}
      {/* foreground foliage silhouette, bottom-left corner */}
      <g className="scenery-foliage" fill={p.leaf}>
        <path d="M-2 100 C-2 78 6 62 16 50 C10 66 8 82 10 100 Z" />
        <path d="M-2 100 C4 86 14 74 26 66 C18 80 14 92 14 100 Z" />
        <path d="M-2 92 C10 88 22 84 30 76 C22 86 16 94 14 100 L-2 100 Z" />
      </g>
    </svg>
  );
}