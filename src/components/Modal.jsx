import React, { useEffect, useRef } from 'react';
import { useModal } from '../ModalContext.jsx';

export default function Modal() {
  const { data, open, closeModal } = useModal();
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (open) {
      document.body.classList.add('lock');
      closeBtnRef.current?.focus();
    } else {
      document.body.classList.remove('lock');
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && open) closeModal(); };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [open, closeModal]);

  return (
    <div className={`modal${open ? ' open' : ''}`} aria-hidden={!open}>
      <div className="modal-backdrop" onClick={closeModal} />
      <div className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
        <button ref={closeBtnRef} className="modal-close" onClick={closeModal} aria-label="Close">✕</button>
        <div className="modal-ring" aria-hidden="true" />
        <span className="modal-eyebrow">{data?.eyebrow}</span>
        <h3 id="modalTitle">{data?.title}</h3>
        {data?.subtitle && <p className="modal-subtitle">{data.subtitle}</p>}
        <p className="modal-body">{data?.body}</p>
      </div>
    </div>
  );
}
