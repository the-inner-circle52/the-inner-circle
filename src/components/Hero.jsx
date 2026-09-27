import React from 'react';

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-image" />
      <div className="hero-light" />
      <div className="hero-frame" />

      <div className="hero-star" aria-hidden="true">
        <div className="hero-star-sphere" />
        <div className="hero-star-core" />
        <img className="hero-star-mark" src="/assets/inner-circle-logo.png" alt="" />
      </div>

      <div className="hero-copy">
        <p className="eyebrow">IDEAS&nbsp;&nbsp;·&nbsp;&nbsp;PEOPLE&nbsp;&nbsp;·&nbsp;&nbsp;PROJECTS&nbsp;&nbsp;·&nbsp;&nbsp;IMPACT</p>
        <h1>
          <span className="line-mask"><span className="line-inner">THE</span></span>
          <span className="line-mask"><span className="line-inner">INNER CIRCLE</span></span>
        </h1>
        <div className="hero-brandline"><span /><b>GECA</b><span /></div>
        <p className="hero-tagline">A SELECTIVE COMMUNITY FOR BUILDERS, THINKERS AND DOERS.</p>
        <p className="hero-description">Ideas find people here.<br />People build what's next.</p>
        <a className="outline" href="#manifesto" onClick={(e) => { e.preventDefault(); document.getElementById('manifesto')?.scrollIntoView({ behavior: 'smooth' }); }}>
          EXPLORE <b>→</b>
        </a>
      </div>

      <div className="hero-side">
        <span>CREATE</span><span>COLLABORATE</span><span>EXPLORE</span><span>BELONG</span><span>LEAVE A MARK</span><i />
      </div>
      <div className="hero-bottom">
        <span>EST. 2026</span><span>THE NEXT CHAPTER IS BEING BUILT</span><span>SCROLL ↓</span>
      </div>
    </section>
  );
}
