import React from 'react';

export default function Intro({ hide }) {
  return (
    <div className={`intro${hide ? ' hide' : ''}`} id="intro">
      <div>
        <img src="/assets/inner-circle-logo.png" alt="The Inner Circle" />
        <span />
        <p>YOU HAVE FOUND THE CIRCLE.</p>
      </div>
    </div>
  );
}
