import React from 'react';
import { useReveal } from '../hooks/useReveal.js';

// Dusk canyon: ember horizon, mesas and a still pool that mirrors them —
// drawn in the site's charcoal + amber palette.
const FORMS = (
  <>
    {/* distant ridge */}
    <path d="M-40 276 L60 254 L120 264 L210 238 L280 258 L360 246 L440 264 L520 252 L600 268 L700 260 L800 270 L900 258 L980 264 L1060 248 L1140 260 L1240 242 L1320 258 L1420 246 L1520 260 L1640 252 L1640 330 L-40 330 Z" fill="#2b1f17" />
    {/* mesa + buttes, left */}
    <path d="M90 330 L104 274 L120 266 L150 262 L176 266 L196 278 L214 330 Z" fill="#1f1611" />
    <path d="M296 330 L304 268 L311 230 L316 214 L326 207 L339 211 L345 226 L351 268 L362 330 Z" fill="#1a130f" />
    <path d="M350 330 L358 278 L366 256 L374 250 L385 256 L391 278 L400 330 Z" fill="#221812" />
    {/* mid mesa */}
    <path d="M846 330 L872 274 L896 258 L950 254 L992 262 L1012 280 L1036 330 Z" fill="#20160f" />
    <path d="M560 330 L580 290 L604 280 L640 278 L668 288 L690 330 Z" fill="#241a13" />
  </>
);

const CLIFF = (
  <>
    <path d="M1130 336 L1176 268 L1204 240 L1236 230 L1246 210 L1292 204 L1322 216 L1362 202 L1422 198 L1470 208 L1522 192 L1600 188 L1640 192 L1640 340 Z" fill="#120d0a" />
    <path d="M1176 268 L1204 240 L1236 230 L1246 210 L1292 204 L1322 216 L1362 202 L1422 198 L1470 208 L1522 192 L1600 188" fill="none" stroke="rgba(232,160,78,.38)" strokeWidth="1.4" />
    <path d="M-40 330 L-40 262 L20 240 L70 246 L96 270 L130 300 L150 336 Z" fill="#130e0b" />
  </>
);

const WATER = 'M0 358 C120 332 300 320 520 318 C700 316 900 316 1080 320 C1300 324 1480 336 1600 354 L1600 520 L0 520 Z';

export default function VisualBreak() {
  const [ref, visible] = useReveal({ threshold: 0.25 });
  return (
    <section ref={ref} className={`visual-break${visible ? ' in' : ''}`} aria-hidden="true">
      <svg className="vb-scene" viewBox="0 0 1600 520" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="vbSky" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="300">
            <stop offset="0" stopColor="#090807" />
            <stop offset=".5" stopColor="#15100c" />
            <stop offset=".76" stopColor="#2c190d" />
            <stop offset=".92" stopColor="#7a4318" />
            <stop offset="1" stopColor="#d08f42" />
          </linearGradient>
          <radialGradient id="vbGlow" gradientUnits="userSpaceOnUse" cx="800" cy="286" r="760" gradientTransform="translate(0 206) scale(1 .28)">
            <stop offset="0" stopColor="#ffc46e" stopOpacity=".62" />
            <stop offset=".4" stopColor="#e28c3c" stopOpacity=".24" />
            <stop offset="1" stopColor="#e28c3c" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="vbCloud" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#f0a24e" stopOpacity="0" />
            <stop offset=".5" stopColor="#f0a24e" stopOpacity=".55" />
            <stop offset="1" stopColor="#f0a24e" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="vbLand" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2c1e14" />
            <stop offset="1" stopColor="#16100c" />
          </linearGradient>
          <linearGradient id="vbWater" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#a86a2c" stopOpacity=".8" />
            <stop offset=".16" stopColor="#5a3418" />
            <stop offset=".5" stopColor="#1d130d" />
            <stop offset="1" stopColor="#0a0807" />
          </linearGradient>
          <linearGradient id="vbFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0a0807" stopOpacity="0" />
            <stop offset=".85" stopColor="#0a0807" stopOpacity=".92" />
          </linearGradient>
          <radialGradient id="vbWaterGlow" gradientUnits="userSpaceOnUse" cx="800" cy="336" r="620" gradientTransform="translate(0 242) scale(1 .18)">
            <stop offset="0" stopColor="#ffc46e" stopOpacity=".7" />
            <stop offset="1" stopColor="#e28c3c" stopOpacity="0" />
          </radialGradient>
          <clipPath id="vbClip"><path d={WATER} /></clipPath>
        </defs>

        <rect width="1600" height="520" fill="url(#vbSky)" />
        <rect className="vb-glow" width="1600" height="330" fill="url(#vbGlow)" />
        <g className="vb-clouds">
          <ellipse cx="380" cy="214" rx="300" ry="8" fill="url(#vbCloud)" opacity=".5" />
          <ellipse cx="1180" cy="196" rx="260" ry="7" fill="url(#vbCloud)" opacity=".42" />
          <ellipse cx="820" cy="236" rx="360" ry="6" fill="url(#vbCloud)" opacity=".55" />
          <ellipse cx="240" cy="252" rx="200" ry="5" fill="url(#vbCloud)" opacity=".4" />
        </g>

        {FORMS}
        <path d="M-40 312 C200 302 400 310 620 306 C820 302 1000 310 1200 304 C1400 298 1560 306 1640 302 L1640 366 L-40 366 Z" fill="url(#vbLand)" />
        {CLIFF}
        <path d={WATER} fill="url(#vbWater)" />

        <g clipPath="url(#vbClip)">
          <g className="vb-reflect" transform="translate(0 636) scale(1 -1)">
            {FORMS}
            {CLIFF}
          </g>
          <rect x="0" y="318" width="1600" height="202" fill="url(#vbFade)" />
          <ellipse cx="800" cy="336" rx="640" ry="30" fill="url(#vbWaterGlow)" />
          <g className="vb-ripples" stroke="rgba(255,205,140,.3)" strokeWidth="1" fill="none">
            <path d="M420 372 H760" /><path d="M900 390 H1240" /><path d="M560 418 H860" /><path d="M1000 440 H1300" /><path d="M300 452 H600" />
          </g>
        </g>
        <path d="M0 358 C120 332 300 320 520 318 C700 316 900 316 1080 320 C1300 324 1480 336 1600 354" fill="none" stroke="rgba(240,170,90,.4)" strokeWidth="1.4" />
      </svg>
      <span>
        <span className="line-mask"><span className="line-inner">IDEAS FIND PEOPLE HERE.</span></span>
      </span>
    </section>
  );
}