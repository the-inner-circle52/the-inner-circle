import React from 'react';

// A quiet field of drifting nodes + connecting lines, purely CSS-animated.
// Used to give otherwise-empty panels a sense of motion without photography.
export default function AnimatedPanel({ variant = 'light' }) {
  const dots = [
    { top: '22%', left: '18%', delay: '0s', size: 5 },
    { top: '38%', left: '62%', delay: '.6s', size: 3 },
    { top: '58%', left: '30%', delay: '1.2s', size: 4 },
    { top: '68%', left: '72%', delay: '1.8s', size: 6 },
    { top: '30%', left: '80%', delay: '2.4s', size: 3 },
    { top: '78%', left: '46%', delay: '3s', size: 4 },
    { top: '48%', left: '12%', delay: '3.6s', size: 3 },
  ];

  return (
    <div className={`animated-panel ${variant}`} aria-hidden="true">
      <svg className="animated-panel-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
        <line x1="18" y1="22" x2="62" y2="38" />
        <line x1="62" y1="38" x2="80" y2="30" />
        <line x1="30" y1="58" x2="62" y2="38" />
        <line x1="30" y1="58" x2="72" y2="68" />
        <line x1="12" y1="48" x2="30" y2="58" />
        <line x1="46" y1="78" x2="72" y2="68" />
      </svg>
      {dots.map((d, i) => (
        <span
          key={i}
          className="animated-panel-dot"
          style={{ top: d.top, left: d.left, width: d.size, height: d.size, animationDelay: d.delay }}
        />
      ))}
      <div className="animated-panel-ring" />
    </div>
  );
}
