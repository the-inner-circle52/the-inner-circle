import React from 'react';
import { SECTIONS } from '../data.js';
import { useSectionProgress } from '../hooks/useSectionProgress.js';

const TRACK_HEIGHT = 120;

export default function SectionProgress() {
  const ids = SECTIONS.map((s) => s.id);
  const { activeIndex, progress } = useSectionProgress(ids);

  return (
    <div className="section-progress" aria-hidden="true">
      <b>{String(activeIndex + 1).padStart(2, '0')}</b>
      <div className="track">
        <div
          className="fill"
          style={{ height: `${progress * TRACK_HEIGHT}px` }}
        />
      </div>
      <small>{String(SECTIONS.length).padStart(2, '0')}</small>
    </div>
  );
}
