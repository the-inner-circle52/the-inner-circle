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

function mergeContent(content) {
  return { ...DEFAULTS, ...content };
}

async function fetchSharedContent() {
  const response = await fetch('/api/content', { cache: 'no-store' });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'Could not load shared website content.');
  return result.content;
}

const ContentCtx = createContext(null);

export function ContentProvider({ children }) {
  const [content, setContent] = useState(() => ({ ...DEFAULTS }));
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState('');

  // Refresh open pages periodically so changes saved by another visitor arrive
  // without requiring a manual reload.
  useEffect(() => {
    let active = true;
    let refreshing = false;
    const refresh = async () => {
      if (refreshing) return;
      refreshing = true;
      try {
        const shared = await fetchSharedContent();
        if (!active) return;
        if (shared) setContent(mergeContent(shared));
        setSyncError('');
      } catch (error) {
        if (active) setSyncError(error.message);
      } finally {
        refreshing = false;
        if (active) setLoading(false);
      }
    };
    refresh();
    const interval = window.setInterval(refresh, 15000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  const persist = useCallback((next) => {
    return (async () => {
      const password = sessionStorage.getItem('circle-admin-password');
      if (!password) throw new Error('Your admin session has expired. Log in again to save changes.');
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save', password, content: next }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not publish website content.');
      setContent(next);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (error) {
        console.error('Shared content was saved, but the local cache could not be updated.', error);
      }
      setSyncError('');
    })();
  }, []);

  const setList = useCallback((key, items) => {
    return persist({ ...content, [key]: items });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, persist]);

  const resetList = useCallback((key) => {
    return persist({ ...content, [key]: DEFAULTS[key] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, persist]);

  const publishLocal = useCallback(async () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) throw new Error('No browser-saved edits were found to publish.');
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error('The browser-saved edits are invalid JSON and cannot be published.');
    }
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('The browser-saved edits have an invalid format.');
    }
    await persist(mergeContent(parsed));
  }, [persist]);

  const value = useMemo(
    () => ({ content, setList, resetList, loading, syncError, publishLocal }),
    [content, setList, resetList, loading, syncError, publishLocal],
  );

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

export function useContentSync() {
  const ctx = useContext(ContentCtx);
  if (!ctx) throw new Error('useContentSync must be used within ContentProvider');
  return { loading: ctx.loading, error: ctx.syncError, publishLocal: ctx.publishLocal };
}