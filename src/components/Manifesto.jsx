import React from 'react';
import Scenery from './Scenery.jsx';
import { useContentList } from '../ContentContext.jsx';
import { useModal } from '../ModalContext.jsx';
import { useReveal } from '../hooks/useReveal.js';

export default function Manifesto() {
  const [manifesto] = useContentList('manifesto');
  const { openModal } = useModal();
  const [leftRef, leftVisible] = useReveal();
  const [rightRef, rightVisible] = useReveal();
  const [imgRef, imgVisible] = useReveal();

  const openManifesto = (e) => {
    e.preventDefault();
    openModal({
      eyebrow: '02 / MANIFESTO',
      title: 'Our Manifesto',
      subtitle: '',
      body: manifesto.join('\n\n'),
    });
  };

  return (
    <section className="intro-grid section" id="manifesto">
      <div ref={imgRef} className="section-image">
        <div className={`reveal-clip${imgVisible ? ' visible' : ''}`}>
          <Scenery variant="light" />
          <div className="motif-ring" aria-hidden="true" />
          <div className="image-label">PEOPLE<br />IDEAS<br />PROJECTS<br />IMPACT</div>
        </div>
      </div>

      <div ref={leftRef} className={`manifesto-copy reveal${leftVisible ? ' visible' : ''}`}>
        <span className="eyebrow">02 / MANIFESTO</span>
        <h2>
          <span className="line-mask"><span className="line-inner">MORE THAN</span></span>
          <span className="line-mask"><span className="line-inner">A COLLEGE</span></span>
          <span className="line-mask"><span className="line-inner">COMMUNITY</span></span>
        </h2>
        <div className="short-rule" />
        <p>The Inner Circle at GECA brings together people who are curious, ambitious and willing to build. We believe in deep work, real collaboration and a culture of exploration.</p>
        <a className="text-link" href="#manifesto-full" onClick={openManifesto}>READ THE FULL MANIFESTO <b>→</b></a>
      </div>

      <div ref={rightRef} className={`manifesto-copy right reveal${rightVisible ? ' visible' : ''}`}>
        <span className="eyebrow">THE NEXT CHAPTER</span>
        <h2>
          <span className="line-mask"><span className="line-inner">A CIRCLE</span></span>
          <span className="line-mask"><span className="line-inner">FOR WHAT</span></span>
          <span className="line-mask"><span className="line-inner">COMES NEXT</span></span>
        </h2>
        <div className="short-rule" />
        <p>Selectively invite. Deeply collaborate. Create lasting impact.</p>
        <a className="dark-button" href="#entry" onClick={(e) => { e.preventDefault(); document.getElementById('entry')?.scrollIntoView({ behavior: 'smooth' }); }}>
          LEARN MORE <b>→</b>
        </a>
      </div>
    </section>
  );
}