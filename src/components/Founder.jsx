import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useContentList } from '../ContentContext.jsx';
import { useReveal } from '../hooks/useReveal.js';

const INTERVAL = 7000;
const DRAG_THRESHOLD = 60; // px of horizontal drag before it counts as a swipe

export default function Founder() {
  const [members] = useContentList('members');
  const [slide, setSlide] = useState(0);
  const [copyRef, copyVisible] = useReveal();
  const [dragX, setDragX] = useState(0);
  const dragState = useRef({ active: false, startX: 0 });

  const slides = useMemo(() => [
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
  ], [members]);

  useEffect(() => {
    setSlide((s) => (s >= slides.length ? 0 : s));
  }, [slides.length]);

  // Restarting this timer on every slide change (not just a plain interval)
  // means a manual drag always gets a full, undisturbed 7s before the next
  // auto-advance, instead of fighting with whatever the timer was mid-way through.
  useEffect(() => {
    const id = setTimeout(() => setSlide((s) => (s + 1) % slides.length), INTERVAL);
    return () => clearTimeout(id);
  }, [slide, slides.length]);

  const goTo = (i) => setSlide(((i % slides.length) + slides.length) % slides.length);
  const next = () => goTo(slide + 1);
  const prev = () => goTo(slide - 1);

  // Left/right drag (mouse or touch, via pointer events) to swap photos —
  // no visible button, just grab and drag the image itself.
  const onPointerDown = (e) => {
    dragState.current = { active: true, startX: e.clientX };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!dragState.current.active) return;
    setDragX(e.clientX - dragState.current.startX);
  };
  const endDrag = () => {
    if (!dragState.current.active) return;
    dragState.current.active = false;
    if (dragX <= -DRAG_THRESHOLD) next();
    else if (dragX >= DRAG_THRESHOLD) prev();
    setDragX(0);
  };

  const cur = slides[slide] || slides[0];
  const words = cur.name.toUpperCase().split(' ');
  const longest = Math.max(...words.map((w) => w.length));

  return (
    <section className="founder section" id="people">
      <div
        className="founder-image founder-drag"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
      >
        {slides.map((s, i) => (
          <div
            key={s.name + i}
            className={`founder-slide${i === slide ? ' active' : ''}${dragX !== 0 && i === slide ? ' dragging' : ''}`}
            style={i === slide ? { transform: `translateX(${dragX}px)` } : undefined}
          >
            {s.photo ? (
              <img src={s.photo} alt={`${s.name}, ${s.role}`} draggable={false} />
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