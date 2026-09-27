import React, { useState } from 'react';
import { pillars } from '../data.js';

export default function Pillars() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (i) => setActiveIndex((cur) => (cur === i ? null : i));

  return (
    <section className="pillars-strip" id="pillars">
      {pillars.map((p, i) => (
        <article
          key={p.title}
          className={activeIndex === i ? 'active' : ''}
          onClick={() => toggle(i)}
          role="button"
          tabIndex={0}
          aria-expanded={activeIndex === i}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(i); } }}
        >
          <div className="symbol">{p.symbol}</div>
          <div><b>{p.title}</b><small>{p.tag}</small></div>
          <span className="pillar-caret" aria-hidden="true">{activeIndex === i ? '−' : '+'}</span>
        </article>
      ))}
      <div className={`pillars-detail${activeIndex !== null ? ' open' : ''}`}>
        <div className="pillars-detail-inner">
          {activeIndex !== null && (
            <p><b>{pillars[activeIndex].title}.</b> {pillars[activeIndex].body}</p>
          )}
        </div>
      </div>
    </section>
  );
}
