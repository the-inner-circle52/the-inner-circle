import React from 'react';
import Scenery from './Scenery.jsx';
import { useReveal } from '../hooks/useReveal.js';

export default function Entry() {
  const [copyRef, copyVisible] = useReveal();
  const [imgRef, imgVisible] = useReveal();

  return (
    <section className="entry section" id="entry">
      <div ref={imgRef} className="entry-image">
        <div className={`reveal-clip${imgVisible ? ' visible' : ''}`}>
          <Scenery variant="dark" />
          <div className="motif-ring" aria-hidden="true" />
        </div>
      </div>
      <div ref={copyRef} className={`entry-copy reveal${copyVisible ? ' visible' : ''}`}>
        <span className="eyebrow">THE NEXT MOVE</span>
        <h2>
          <span className="line-mask"><span className="line-inner">FIND YOUR</span></span>
          <span className="line-mask"><span className="line-inner"><em>WAY IN.</em></span></span>
        </h2>
        <p>Everyone can enter the Outer Circle. Few reach the Inner Circle. The first step is not a form. It is a reason to be noticed.</p>
        <a className="dark-button" href="mailto:innercircle@gecajmer.ac.in?subject=The%20Inner%20Circle">
          CONTACT THE CIRCLE <b>→</b>
        </a>
      </div>
    </section>
  );
}