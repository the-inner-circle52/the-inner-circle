import React from 'react';
import { SECTIONS } from '../data.js';

const go = (e, id) => {
  e.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-col footer-brand-col">
          <div className="footer-brand">
            <img src="/assets/inner-circle-logo.png" alt="" />
            <span>THE INNER CIRCLE<small>GECA</small></span>
          </div>
          <p>A selective community for builders, thinkers and doers at Government Engineering College, Ajmer.</p>
        </div>

        <div className="footer-col">
          <h4>NAVIGATE</h4>
          <ul>
            {SECTIONS.map((s) => (
              <li key={s.id}><a href={`#${s.id}`} onClick={(e) => go(e, s.id)}>{s.label}</a></li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h4>THE CIRCLE</h4>
          <ul>
            <li><a href="#doctrine" onClick={(e) => go(e, 'doctrine')}>The Doctrine</a></li>
            <li><a href="#circle" onClick={(e) => go(e, 'circle')}>Our People</a></li>
            <li><a href="#journal" onClick={(e) => go(e, 'journal')}>Journal</a></li>
            <li><a href="#entry" onClick={(e) => go(e, 'entry')}>Apply</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>CONTACT</h4>
          <ul>
            <li><a href="mailto:innercircle@gecajmer.ac.in">innercircle@gecajmer.ac.in</a></li>
            <li>GECA · Ajmer · Rajasthan · India</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>GECA · AJMER · INDIA · © {year}</span>
        <span>THINK. BUILD. CHALLENGE.</span>
        <button
          className="footer-top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          BACK TO TOP <b>↑</b>
        </button>
      </div>
    </footer>
  );
}
