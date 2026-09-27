import React from 'react';
import { journal } from '../data.js';
import { useModal } from '../ModalContext.jsx';
import { useReveal } from '../hooks/useReveal.js';

function NoteCard({ n }) {
  const { openModal } = useModal();
  const [ref, visible] = useReveal();

  const show = () => openModal({
    eyebrow: n.tag,
    title: n.title,
    subtitle: '',
    body: n.full,
  });

  return (
    <article
      ref={ref}
      className={`reveal${visible ? ' visible' : ''}`}
      onClick={show}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(); } }}
    >
      <span>{n.tag}</span>
      <h3>{n.title}</h3>
      <p>{n.excerpt}</p>
    </article>
  );
}

export default function Journal() {
  const [headRef, headVisible] = useReveal();
  return (
    <section className="journal section" id="journal">
      <div ref={headRef} className={`section-head reveal${headVisible ? ' visible' : ''}`}>
        <span className="eyebrow">07 / JOURNAL</span>
        <h2>
          <span className="line-mask"><span className="line-inner">THOUGHTS</span></span>
          <span className="line-mask"><span className="line-inner">FROM THE <em>CIRCLE.</em></span></span>
        </h2>
      </div>
      <div className="journal-grid">
        {journal.map((n) => <NoteCard key={n.tag} n={n} />)}
      </div>
    </section>
  );
}
