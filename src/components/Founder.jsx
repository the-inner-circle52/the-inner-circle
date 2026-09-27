import React, { useEffect, useState } from 'react';
import { members } from '../data.js';
import { useReveal } from '../hooks/useReveal.js';

const SLIDES = [
  { name: 'Aditya Sharma', role: 'FOUNDER', photo: '/assets/aditya-portrait-clean.jpg', initials: 'AS' },
  ...members.map((m) => ({ name: m.name, role: m.role, initials: m.initials })),
];

const INTERVAL = 3200;

export default function Founder() {
  const [slide, setSlide] = useState(0);
  const [copyRef, copyVisible] = useReveal();

  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), INTERVAL);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="founder section" id="people">
      <div className="founder-image">
        {SLIDES.map((s, i) => (
          <div key={s.name} className={`founder-slide${i === slide ? ' active' : ''}`}>
            {s.photo ? (
              <img src={s.photo} alt={`${s.name}, ${s.role}`} />
            ) : (
              <div className="founder-slide-avatar"><span>{s.initials}</span></div>
            )}
            <div className="founder-slide-caption"><b>{s.name}</b><small>{s.role}</small></div>
          </div>
        ))}
      </div>
      <div className="founder-orbit" aria-hidden="true" />
      <div className="founder-overlay" />
      <div className="founder-top"><span>THE INNER CIRCLE</span><small>IDEAS · PEOPLE · PROJECTS · IMPACT</small></div>

      <div ref={copyRef} className={`founder-copy reveal${copyVisible ? ' visible' : ''}`}>
        <span className="eyebrow">FOUNDER REVEAL</span>
        <div className="short-rule" />
        <h2>
          <span className="line-mask"><span className="line-inner">ADITYA</span></span>
          <span className="line-mask"><span className="line-inner">SHARMA</span></span>
        </h2>
        <p className="role">FOUNDER<br />THE INNER CIRCLE | GECA</p>
        <div className="quote">“People build what's next.”<br /><span>That's the circle.</span></div>
      </div>

      <div className="founder-side">
        <span>BUILD</span><span>CONNECT</span><span>EXPLORE</span><span>BELONG</span><span>LEAVE A MARK</span>
      </div>
      <div className="founder-bottom">
        <span>A SELECTIVE COMMUNITY FOR BUILDERS, THINKERS AND DOERS.</span>
        <span>FOUNDER'S ROOM / SEAT I</span>
      </div>
    </section>
  );
}
