import React from 'react';
import { useContentList } from '../ContentContext.jsx';
import { useModal } from '../ModalContext.jsx';
import { useReveal } from '../hooks/useReveal.js';

function MemberCard({ m }) {
  const { openModal } = useModal();
  const [ref, visible] = useReveal();

  const show = () => openModal({
    eyebrow: m.role,
    title: m.name,
    subtitle: m.focus,
    body: m.bio,
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
      <span>{m.role}</span>
      <h3>{m.name}</h3>
      <p>{m.focus}</p>
    </article>
  );
}

export default function People() {
  const [members] = useContentList('members');
  const [headRef, headVisible] = useReveal();
  return (
    <section className="people-list section" id="circle">
      <div ref={headRef} className={`section-head reveal${headVisible ? ' visible' : ''}`}>
        <span className="eyebrow">06 / THE CIRCLE</span>
        <h2><span className="line-mask"><span className="line-inner">THE PEOPLE.</span></span></h2>
        <p>Roles describe what people contribute, not where they sit in a committee chart.</p>
      </div>
      <div className="people-grid">
        {members.map((m) => <MemberCard key={m.name} m={m} />)}
      </div>
    </section>
  );
}