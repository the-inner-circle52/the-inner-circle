import React, { useEffect, useState } from 'react';
import { members } from '../data.js';
import { useReveal } from '../hooks/useReveal.js';

const SLIDES = [
  {
    name: 'Aditya Sharma',
    role: 'FOUNDER',
    eyebrow: 'FOUNDER REVEAL',
    photo: '/assets/aditya-portrait-clean.jpg',
    initials: 'AS',
    quote: "“People build what's next.”",
    sub: "That's the circle.",
  },
  ...members.map((m, i) => ({
    name: m.name,
    role: m.role,
    eyebrow: `MEET THE CIRCLE · ${String(i + 1).padStart(2, '0')}`,
    photo: m.photo,
    initials: m.initials,
    quote: m.bio,
    sub: m.focus,
  })),
];

const INTERVAL = 7000;

export default function Founder() {
  const [slide, setSlide] = useState(0);
  const [copyRef, copyVisible] = useReveal();

  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), INTERVAL);
    return () => clearInterval(id);
  }, []);

  const cur = SLIDES[slide];
  const words = cur.name.toUpperCase().split(' ');
  const longest = Math.max(...words.map((w) => w.length));

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
        <div key={slide} className="founder-swap" aria-live="polite">
          <span className="eyebrow">{cur.eyebrow}</span>
          <div className="short-rule" />
          <h2 className={longest > 6 ? 'name-long' : ''}>
            {words.map((w) => (
              <span className="line-mask" key={w}><span className="line-inner">{w}</span></span>
            ))}
          </h2>
          <p className="role">{cur.role}<br />THE INNER CIRCLE | GECA</p>
          <div className="quote">{cur.quote}<br /><span>{cur.sub}</span></div>
        </div>
      </div>

      <div className="founder-side">
        <span>BUILD</span><span>CONNECT</span><span>EXPLORE</span><span>BELONG</span><span>LEAVE A MARK</span>
      </div>
      <div className="founder-bottom">
        <span>A SELECTIVE COMMUNITY FOR BUILDERS, THINKERS AND DOERS.</span>
        <span>{slide === 0 ? "FOUNDER'S ROOM / SEAT I" : `THE CIRCLE / SEAT ${String(slide + 1).padStart(2, '0')}`}</span>
      </div>
    </section>
  );
}