import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  pillars as defaultPillars,
  principles as defaultPrinciples,
  members as defaultMembers,
  journal as defaultJournal,
  manifesto as defaultManifesto,
  projects as defaultProjects,
} from './data.js';

const STORAGE_KEY = 'circle-content-v1';

const DEFAULTS = {
  pillars: defaultPillars,
  principles: defaultPrinciples,
  members: defaultMembers,
  journal: defaultJournal,
  manifesto: defaultManifesto,
  projects: defaultProjects,
};

function loadAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULTS };
    const parsed = JSON.parse(raw);
    // Merge over defaults so a new key added later (e.g. a new content type
    // shipped in an update) still shows up even if someone has old data saved.
    return { ...DEFAULTS, ...parsed };
  } catch {
    return { ...DEFAULTS };
  }
}

const ContentCtx = createContext(null);

export function ContentProvider({ children }) {
  const [content, setContent] = useState(loadAll);

  // Cross-tab live sync: if the admin panel is open in another tab and saves
  // a change, this tab picks it up automatically without a manual refresh.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) setContent(loadAll());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const persist = useCallback((next) => {
    setContent(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const setList = useCallback((key, items) => {
    persist({ ...content, [key]: items });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, persist]);

  const resetList = useCallback((key) => {
    persist({ ...content, [key]: DEFAULTS[key] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, persist]);

  const value = useMemo(() => ({ content, setList, resetList }), [content, setList, resetList]);

  return <ContentCtx.Provider value={value}>{children}</ContentCtx.Provider>;
}

export function useContentList(key) {
  const ctx = useContext(ContentCtx);
  if (!ctx) throw new Error('useContentList must be used within ContentProvider');
  const items = ctx.content[key];
  const setItems = useCallback((next) => ctx.setList(key, next), [ctx, key]);
  return [items, setItems];
}

export function useResetList(key) {
  const ctx = useContext(ContentCtx);
  if (!ctx) throw new Error('useResetList must be used within ContentProvider');
  return () => ctx.resetList(key);
}