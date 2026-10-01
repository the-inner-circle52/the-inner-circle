import React from 'react';
import { useContentList } from '../ContentContext.jsx';
import { useModal } from '../ModalContext.jsx';
import { useReveal } from '../hooks/useReveal.js';

export default function Doctrine() {
  const [principles] = useContentList('principles');
  const { openModal } = useModal();
  const [leftRef, leftVisible] = useReveal();
  const [gridRef, gridVisible] = useReveal();

  const show = (p) => openModal({
    eyebrow: `PRINCIPLE ${p.n}`,
    title: p.title,
    subtitle: p.tag,
    body: p.body,
  });

  return (
    <section className="manifesto-dark section" id="doctrine">
      <div ref={leftRef} className={`reveal${leftVisible ? ' visible' : ''}`}>
        <span className="eyebrow">05 / THE DOCTRINE</span>
        <h2>
          <span className="line-mask"><span className="line-inner">WHAT WE</span></span>
          <span className="line-mask"><span className="line-inner"><em>PROTECT.</em></span></span>
        </h2>
        <p>Curiosity. Craft. Execution. Disagreement. Contribution. Continuity.</p>
      </div>
      <div ref={gridRef} className={`principles reveal${gridVisible ? ' visible' : ''}`}>
        {principles.map((p) => (
          <div
            key={p.n}
            onClick={() => show(p)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(p); } }}
          >
            <b>{p.n}</b>
            <span>{p.title}</span>
            <small>{p.tag}</small>
          </div>
        ))}
      </div>
    </section>
  );
}