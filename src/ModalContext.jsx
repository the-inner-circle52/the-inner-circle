import React, { createContext, useCallback, useContext, useRef, useState } from 'react';

const ModalCtx = createContext(null);

export function ModalProvider({ children }) {
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);
  const lastFocused = useRef(null);

  const openModal = useCallback((payload) => {
    lastFocused.current = document.activeElement;
    setData(payload);
    setOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
    if (lastFocused.current && lastFocused.current.focus) {
      lastFocused.current.focus();
    }
  }, []);

  return (
    <ModalCtx.Provider value={{ data, open, openModal, closeModal }}>
      {children}
    </ModalCtx.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalCtx);
  if (!ctx) throw new Error('useModal must be used within ModalProvider');
  return ctx;
}
