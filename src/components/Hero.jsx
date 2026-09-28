import React from 'react';

// Layered misty ridgelines for the hero. Deterministic (no Math.random) so the
// shapes are identical on every render.
const W = 1600;
const H = 700;
const CREAM = [239, 233, 218];

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const toHex = (rgb) => '#' + rgb.map((v) => v.toString(16).padStart(2, '0')).join('');

// far -> near. base = ridge height in viewBox units, tilt lowers the LEFT side
// so the copy on the left stays airy while the right side gets the big ranges.
const SPEC = [
  { color: '#e0d8c6', base: 350, amp: 60, tilt: 60, f: [230, 100, 34], p: [0.4, 1.7, 0.2], opacity: 0.85 },
  { color: '#cfc6b0', base: 400, amp: 70, tilt: 75, f: [270, 120, 38], p: [2.1, 0.6, 1.4], opacity: 0.92 },
  { color: '#b7ad95', base: 452, amp: 76, tilt: 80, f: [310, 135, 42], p: [4.0, 2.2, 0.9], opacity: 0.96 },
  { color: '#978c75', base: 506, amp: 74, tilt: 80, f: [350, 150, 46], p: [1.2, 3.1, 2.4], opacity: 1 },
  { color: '#6d6555', base: 560, amp: 66, tilt: 70, f: [390, 165, 50], p: [5.2, 0.3, 1.1], opacity: 1 },
  { color: '#3b372e', base: 618, amp: 48, tilt: 50, f: [430, 185, 56], p: [3.3, 1.9, 2.7], opacity: 1 },
];

// ridged noise: turns smooth sine crests into mountain-like peaks
const peak = (v) => 1 - 2 * Math.abs(Math.sin(v));

function ridge(s) {
  const pts = [];
  for (let x = -80; x <= W + 80; x += 12) {
    const wave =
      0.5 * peak(x / s.f[0] + s.p[0]) +
      0.32 * Math.sin(x / s.f[1] + s.p[1]) +
      0.18 * peak(x / s.f[2] + s.p[2]);
    const y = s.base + s.tilt * Math.pow(1 - Math.min(Math.max(x / W, 0), 1), 1.3) - s.amp * wave;
    pts.push(`${x},${y.toFixed(1)}`);
  }
  return `M${pts.join(' L')} L${W + 80},${H + 20} L-80,${H + 20} Z`;
}

const VIEW = { W, H };

const LAYERS = SPEC.map((s, i) => {
  const base = hex(s.color);
  return {
    id: `rg${i}`,
    d: ridge(s),
    top: s.color,
    bottom: toHex(mix(base, CREAM, i < 4 ? 0.5 : 0.18)),
    opacity: s.opacity,
  };
});


export default function Hero() {
  return (
    <section className="hero" id="home">
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <symbol id="hl" viewBox="-24 -24 48 48">
            <path d="M0 -22 L5 -12 L11 -15 L9 -5 L20 -8 L14 2 L19 6 L8 8 L9 14 L2 11 L1 22 L-1 22 L-2 11 L-9 14 L-8 8 L-19 6 L-14 2 L-20 -8 L-9 -5 L-11 -15 L-5 -12 Z" strokeLinejoin="round" stroke="currentColor" strokeWidth="1.5" />
          </symbol>
        </defs>
      </svg>
      <div className="hero-image" />
      <div className="hero-light" />
      <div className="hero-frame" />

      <div className="hero-star" aria-hidden="true">
        <div className="hero-star-sphere" />
        <div className="hero-star-core" />
      </div>

      <svg className="hero-landscape" viewBox={`0 0 ${VIEW.W} ${VIEW.H}`} preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <defs>
          {LAYERS.map((l) => (
            <linearGradient key={l.id} id={l.id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={l.top} />
              <stop offset="1" stopColor={l.bottom} />
            </linearGradient>
          ))}
        </defs>
        {LAYERS.map((l, i) => (
          <g key={l.id} className={`ridge ridge-${i}`} style={{ opacity: l.opacity }}>
            <path d={l.d} fill={`url(#${l.id})`} />
          </g>
        ))}
      </svg>
      <div className="hero-veil" />

      <svg className="hero-branch" viewBox="0 0 520 420" aria-hidden="true">
        <g stroke="#1f1d18" strokeLinecap="round" fill="none">
          <path d="M540 14 C450 30 380 70 300 130 C270 152 245 182 222 224" strokeWidth="5" />
          <path d="M450 44 C425 72 408 110 400 160" strokeWidth="3" />
          <path d="M370 92 C345 100 318 128 300 168" strokeWidth="3" />
          <path d="M500 26 C500 70 484 108 458 146" strokeWidth="3" />
        </g>
        <g fill="#1f1d18" color="#1f1d18">
          {[[300,130,-20,1.3],[262,166,30,1.1],[228,214,-10,1.4],[400,160,15,1.2],[402,120,-40,1],[318,168,20,1.1],[345,102,-30,1],[458,146,10,1.2],[486,104,-25,1],[430,64,40,1.1],[380,92,-15,1.2],[350,120,55,.9],[500,60,20,1]].map(([x,y,r,s],i)=>(
            <use key={i} href="#hl" x="-24" y="-24" width="48" height="48" transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} />
          ))}
        </g>
      </svg>

      <svg className="hero-plant" viewBox="0 0 220 240" aria-hidden="true">
        <g stroke="#1f1d18" strokeLinecap="round" fill="none">
          <path d="M150 250 C150 200 165 150 190 100" strokeWidth="3" />
          <path d="M190 250 C195 210 205 175 214 140" strokeWidth="3" />
          <path d="M110 250 C118 205 138 170 160 145" strokeWidth="2.5" />
        </g>
        <g fill="#1f1d18" color="#1f1d18">
          {[[190,100,10,1.2],[172,124,-30,1],[160,152,25,1],[208,130,-15,1.1],[214,140,20,.9],[140,168,-40,.9],[160,145,15,1],[182,170,35,.9]].map(([x,y,r,s],i)=>(
            <use key={i} href="#hl" x="-24" y="-24" width="48" height="48" transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} />
          ))}
        </g>
      </svg>

      <div className="hero-leaves" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <svg key={i} className={`fall-leaf fall-leaf-${i}`} viewBox="-24 -24 48 48"><use href="#hl" x="-24" y="-24" width="48" height="48" /></svg>
        ))}
      </div>

      <div className="hero-copy">
        <p className="eyebrow">IDEAS&nbsp;&nbsp;·&nbsp;&nbsp;PEOPLE&nbsp;&nbsp;·&nbsp;&nbsp;PROJECTS&nbsp;&nbsp;·&nbsp;&nbsp;IMPACT</p>
        <h1>
          <span className="line-mask"><span className="line-inner">THE</span></span>
          <span className="line-mask"><span className="line-inner">INNER CIRCLE</span></span>
        </h1>
        <div className="hero-brandline"><span /><b>GECA</b><span /></div>
        <p className="hero-tagline">A SELECTIVE COMMUNITY FOR BUILDERS, THINKERS AND DOERS.</p>
        <p className="hero-description">Ideas find people here.<br />People build what's next.</p>
        <a className="outline" href="#manifesto" onClick={(e) => { e.preventDefault(); document.getElementById('manifesto')?.scrollIntoView({ behavior: 'smooth' }); }}>
          EXPLORE <b>→</b>
        </a>
      </div>

      <div className="hero-side">
        <span>CREATE</span><span>COLLABORATE</span><span>EXPLORE</span><span>BELONG</span><span>LEAVE A MARK</span><i />
      </div>
      <div className="hero-bottom">
        <span>EST. 2026</span><span>THE NEXT CHAPTER IS BEING BUILT</span><span>SCROLL ↓</span>
      </div>
    </section>
  );
}