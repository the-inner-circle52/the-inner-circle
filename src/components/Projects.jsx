import React from 'react';
import { projects } from '../data.js';
import { useModal } from '../ModalContext.jsx';
import { useReveal } from '../hooks/useReveal.js';

function ProjectCard({ p }) {
  const { openModal } = useModal();
  const [ref, visible] = useReveal();

  const show = () => openModal({
    eyebrow: p.tag,
    title: p.title,
    subtitle: '',
    body: p.full,
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
      <span>{p.tag}</span>
      <h3>{p.title}</h3>
      <p>{p.excerpt}</p>
    </article>
  );
}

export default function Projects() {
  const [headRef, headVisible] = useReveal();
  return (
    <section className="projects section" id="projects">
      <div ref={headRef} className={`section-head reveal${headVisible ? ' visible' : ''}`}>
        <span className="eyebrow">03 / PROJECTS</span>
        <h2><span className="line-mask"><span className="line-inner">WHAT THE</span></span><span className="line-mask"><span className="line-inner">CIRCLE HAS <em>BUILT.</em></span></span></h2>
        <p>Real things, shipped by members — some for hackathons, some just because the idea wouldn't leave anyone alone.</p>
      </div>
      <div className="projects-grid">
        {projects.map((p) => <ProjectCard key={p.title} p={p} />)}
      </div>
    </section>
  );
}
