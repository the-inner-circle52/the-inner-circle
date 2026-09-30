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

export const VIEW = { W, H };

export const LAYERS = SPEC.map((s, i) => {
  const base = hex(s.color);
  return {
    id: `rg${i}`,
    d: ridge(s),
    top: s.color,
    bottom: toHex(mix(base, CREAM, i < 4 ? 0.5 : 0.18)),
    opacity: s.opacity,
  };
});