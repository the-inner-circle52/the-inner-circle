import React, { useEffect, useState } from 'react';
import { SECTIONS } from '../data.js';

const NAV_LINKS = SECTIONS.filter((s) => ['home', 'manifesto', 'pillars', 'projects', 'people', 'journal'].includes(s.id));

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('home');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-38% 0px -50% 0px' });
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const go = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMenuOpen(false);
  };

  return (
    <>
      <header className={`nav${scrolled ? ' scrolled' : ''}`}>
        <a className="brand" href="#home" onClick={(e) => go(e, 'home')}>
          <img src="/assets/inner-circle-logo.png" alt="" />
          <span>THE INNER CIRCLE<small>GECA</small></span>
        </a>
        <nav className="nav-links">
          {NAV_LINKS.map((s) => (
            <a
              key={s.id}
              className={active === s.id ? 'active' : ''}
              href={`#${s.id}`}
              onClick={(e) => go(e, s.id)}
            >
              {s.label}
            </a>
          ))}
        </nav>
        <a className="apply" href="#entry" onClick={(e) => go(e, 'entry')}>APPLY <b>→</b></a>
        <button
          className="menu"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <i /><i />
        </button>
      </header>

      <div className={`mobile-menu${menuOpen ? ' open' : ''}`} aria-hidden={!menuOpen}>
        <div>
          <small>THE INNER CIRCLE / GECA</small>
          {SECTIONS.map((s, i) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              style={{ transitionDelay: `${0.05 + i * 0.05}s` }}
              onClick={(e) => go(e, s.id)}
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
