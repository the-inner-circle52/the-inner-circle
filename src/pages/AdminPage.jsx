import React, { useEffect, useMemo, useState } from 'react';
import { useContentList, useContentSync, useResetList } from '../ContentContext.jsx';

const SESSION_KEY = 'circle-admin-password';

const FIELD_SETS = {
  members: [
    { key: 'role', label: 'Role', type: 'text' },
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'initials', label: 'Initials', type: 'text' },
    { key: 'photo', label: 'Photo path', type: 'text' },
    { key: 'focus', label: 'Focus', type: 'text' },
    { key: 'bio', label: 'Bio', type: 'textarea' },
  ],
  projects: [
    { key: 'tag', label: 'Category', type: 'text' },
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'excerpt', label: 'Excerpt', type: 'text' },
    { key: 'full', label: 'Full text', type: 'textarea' },
  ],
  journal: [
    { key: 'tag', label: 'Note #', type: 'text' },
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'excerpt', label: 'Excerpt', type: 'text' },
    { key: 'full', label: 'Full text', type: 'textarea' },
  ],
  principles: [
    { key: 'n', label: 'No.', type: 'text' },
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'tag', label: 'One-liner', type: 'text' },
    { key: 'body', label: 'Body', type: 'textarea' },
  ],
  pillars: [
    { key: 'symbol', label: 'Symbol', type: 'text' },
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'tag', label: 'Tag', type: 'text' },
    { key: 'body', label: 'Body', type: 'textarea' },
  ],
};

function emptyOf(fields) {
  const o = {};
  fields.forEach((f) => { o[f.key] = ''; });
  return o;
}

function Login({ onUnlock }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', password: pw }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not verify the access key.');
      sessionStorage.setItem(SESSION_KEY, pw);
      onUnlock();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-gate">
      <form className={`admin-gate-card${error ? ' shake' : ''}`} onSubmit={submit}>
        <span className="admin-gate-eyebrow">RESTRICTED</span>
        <h1>The Circle / Admin</h1>
        <p>This area is for members of the Circle who maintain the site. Enter the access key to continue.</p>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Access key"
          autoFocus
        />
        <button type="submit" disabled={submitting}>{submitting ? 'CHECKING…' : <>ENTER <b>→</b></>}</button>
        {error && <small className="admin-gate-error" role="alert">{error}</small>}
      </form>
    </div>
  );
}

function EditableTable({ kind }) {
  const [items, setItems] = useContentList(kind);
  const resetList = useResetList(kind);
  const fields = FIELD_SETS[kind];
  const [draft, setDraft] = useState(emptyOf(fields));
  const [editingIndex, setEditingIndex] = useState(null);
  const [editDraft, setEditDraft] = useState(null);
  const [savedFlash, setSavedFlash] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);

  const flashSaved = () => { setSavedFlash(true); setTimeout(() => setSavedFlash(false), 1200); };
  const save = async (next) => {
    setSaving(true);
    setSaveError('');
    try {
      await setItems(next);
      flashSaved();
      return true;
    } catch (error) {
      setSaveError(error.message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const addItem = async (e) => {
    e.preventDefault();
    if (!draft[fields[1]?.key] && !draft[fields[0]?.key]) return;
    if (await save([...items, draft])) setDraft(emptyOf(fields));
  };

  const removeItem = (i) => save(items.filter((_, idx) => idx !== i));

  const moveItem = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    save(next);
  };

  const startEdit = (i) => { setEditingIndex(i); setEditDraft({ ...items[i] }); };
  const saveEdit = async () => {
    if (await save(items.map((it, idx) => (idx === editingIndex ? editDraft : it)))) {
      setEditingIndex(null);
      setEditDraft(null);
    }
  };

  const copyJSON = () => navigator.clipboard?.writeText(JSON.stringify(items, null, 2));
  const reset = async () => {
    if (!confirm('Reset this section back to its built-in defaults? This discards any edits made here.')) return;
    setSaving(true);
    setSaveError('');
    try {
      await resetList();
      flashSaved();
    } catch (error) {
      setSaveError(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <h2>{kind}</h2>
        <div className="admin-panel-head-actions">
          {savedFlash && <span className="admin-saved-flash">Saved — live on the site now</span>}
          <button className="admin-ghost-btn" onClick={reset} disabled={saving} type="button">RESET DEFAULTS</button>
          <button className="admin-copy-btn" onClick={copyJSON} type="button">COPY AS JSON</button>
        </div>
      </div>
      <p className="admin-hint">
        Changes are published to the shared website and appear for every visitor. Other open
        pages refresh automatically.
      </p>
      {saveError && <p className="admin-save-error" role="alert">{saveError}</p>}

      <div className="admin-table">
        {items.map((it, i) => (
          <div className="admin-row" key={i}>
            {editingIndex === i ? (
              <>
                <div className="admin-row-fields">
                  {fields.map((f) => (
                    <label key={f.key}>
                      <span>{f.label}</span>
                      {f.type === 'textarea' ? (
                        <textarea
                          value={editDraft[f.key] || ''}
                          onChange={(e) => setEditDraft({ ...editDraft, [f.key]: e.target.value })}
                        />
                      ) : (
                        <input
                          value={editDraft[f.key] || ''}
                          onChange={(e) => setEditDraft({ ...editDraft, [f.key]: e.target.value })}
                        />
                      )}
                    </label>
                  ))}
                </div>
                <div className="admin-row-actions">
                  <button type="button" onClick={saveEdit} disabled={saving}>SAVE</button>
                  <button type="button" className="ghost" onClick={() => setEditingIndex(null)} disabled={saving}>CANCEL</button>
                </div>
              </>
            ) : (
              <>
                <div className="admin-row-order">
                  <button type="button" disabled={saving || i === 0} onClick={() => moveItem(i, -1)} aria-label="Move up">↑</button>
                  <button type="button" disabled={saving || i === items.length - 1} onClick={() => moveItem(i, 1)} aria-label="Move down">↓</button>
                </div>
                <div className="admin-row-summary">
                  <b>{it[fields[1]?.key] || it[fields[0]?.key]}</b>
                  <small>{it[fields[0]?.key]}</small>
                </div>
                <div className="admin-row-actions">
                  <button type="button" onClick={() => startEdit(i)} disabled={saving}>EDIT</button>
                  <button type="button" className="ghost" onClick={() => removeItem(i)} disabled={saving}>DELETE</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <form className="admin-add-form" onSubmit={addItem}>
        <h3>Add new</h3>
        <div className="admin-row-fields">
          {fields.map((f) => (
            <label key={f.key}>
              <span>{f.label}</span>
              {f.type === 'textarea' ? (
                <textarea value={draft[f.key]} onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })} />
              ) : (
                <input value={draft[f.key]} onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })} />
              )}
            </label>
          ))}
        </div>
        <button type="submit" disabled={saving}>+ ADD {kind.slice(0, -1).toUpperCase()}</button>
      </form>
    </div>
  );
}

function ManifestoEditor() {
  const [paragraphs, setParagraphs] = useContentList('manifesto');
  const resetList = useResetList('manifesto');
  const [draft, setDraft] = useState(paragraphs);
  const [saveError, setSaveError] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  useEffect(() => setDraft(paragraphs), [paragraphs]);
  const update = (i, val) => setDraft(draft.map((p, idx) => (idx === i ? val : p)));
  const remove = (i) => setDraft(draft.filter((_, idx) => idx !== i));
  const copyJSON = () => navigator.clipboard?.writeText(JSON.stringify(paragraphs, null, 2));
  const save = async (next) => {
    setSaving(true);
    setSaveError('');
    setSaved(false);
    try {
      await setParagraphs(next);
      setSaved(true);
      setTimeout(() => setSaved(false), 1200);
    } catch (error) {
      setSaveError(error.message);
    } finally {
      setSaving(false);
    }
  };
  const reset = async () => {
    if (!confirm('Reset to the built-in manifesto text?')) return;
    setSaving(true);
    setSaveError('');
    try {
      await resetList();
    } catch (error) {
      setSaveError(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <h2>manifesto</h2>
        <div className="admin-panel-head-actions">
          {saved && <span className="admin-saved-flash">Saved — live on the site now</span>}
          <button className="admin-ghost-btn" onClick={reset} disabled={saving} type="button">RESET DEFAULTS</button>
          <button className="admin-copy-btn" onClick={copyJSON} type="button">COPY AS JSON</button>
        </div>
      </div>
      <p className="admin-hint">
        Edit the paragraphs, then save to publish them for every visitor.
      </p>
      {saveError && <p className="admin-save-error" role="alert">{saveError}</p>}
      {draft.map((p, i) => (
        <div className="admin-manifesto-row" key={i}>
          <textarea value={p} onChange={(e) => update(i, e.target.value)} />
          <button type="button" className="ghost" onClick={() => remove(i)} disabled={saving}>DELETE</button>
        </div>
      ))}
      <button type="button" onClick={() => setDraft([...draft, ''])} disabled={saving}>+ ADD PARAGRAPH</button>
      <button type="button" onClick={() => save(draft)} disabled={saving}>{saving ? 'SAVING…' : 'SAVE MANIFESTO'}</button>
    </div>
  );
}

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'members', label: 'Members' },
  { id: 'projects', label: 'Projects' },
  { id: 'journal', label: 'Journal' },
  { id: 'principles', label: 'Doctrine' },
  { id: 'pillars', label: 'Pillars' },
  { id: 'manifesto', label: 'Manifesto' },
];

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(() => Boolean(sessionStorage.getItem(SESSION_KEY)));
  const [tab, setTab] = useState('overview');
  const { loading, error, publishLocal } = useContentSync();
  const [publishMessage, setPublishMessage] = useState('');
  const [publishError, setPublishError] = useState('');

  const [members] = useContentList('members');
  const [projects] = useContentList('projects');
  const [journal] = useContentList('journal');
  const [principles] = useContentList('principles');

  const stats = useMemo(() => ([
    { label: 'Members', value: members.length },
    { label: 'Projects', value: projects.length },
    { label: 'Journal notes', value: journal.length },
    { label: 'Doctrine principles', value: principles.length },
  ]), [members, projects, journal, principles]);

  if (!unlocked) return <Login onUnlock={() => setUnlocked(true)} />;

  const logout = () => { sessionStorage.removeItem(SESSION_KEY); setUnlocked(false); };
  const migrateLocalChanges = async () => {
    if (!confirm('Publish this browser’s previously saved edits to the shared website? This replaces the current shared content.')) return;
    setPublishMessage('');
    setPublishError('');
    try {
      await publishLocal();
      setPublishMessage('Browser-saved edits published to the shared website.');
    } catch (err) {
      setPublishError(err.message);
    }
  };

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <div className="admin-side-brand">
          <img src="/assets/inner-circle-logo.png" alt="" />
          <span>THE CIRCLE<small>ADMIN</small></span>
        </div>
        <nav>
          {TABS.map((t) => (
            <button
              key={t.id}
              className={tab === t.id ? 'active' : ''}
              onClick={() => setTab(t.id)}
              type="button"
            >
              {t.label}
            </button>
          ))}
        </nav>
        <div className="admin-side-foot">
          <a href="/" className="admin-back">← BACK TO SITE</a>
          <button className="admin-logout" onClick={logout} type="button">LOG OUT</button>
        </div>
      </aside>

      <main className="admin-main">
        {loading && <p className="admin-hint" role="status">Connecting to shared website content…</p>}
        {error && <p className="admin-save-error" role="alert">Shared content unavailable: {error}</p>}
        {tab === 'overview' && (
          <div className="admin-panel">
            <h2>overview</h2>
            <p className="admin-hint">
              Edits are stored centrally and shared with every visitor. Open pages check for
              published changes automatically.
            </p>
            <button type="button" onClick={migrateLocalChanges}>PUBLISH THIS BROWSER’S PREVIOUS EDITS</button>
            {publishMessage && <p className="admin-saved-flash" role="status">{publishMessage}</p>}
            {publishError && <p className="admin-save-error" role="alert">{publishError}</p>}
            <div className="admin-stats">
              {stats.map((s) => (
                <div key={s.label} className="admin-stat">
                  <b>{s.value}</b>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab === 'members' && <EditableTable kind="members" />}
        {tab === 'projects' && <EditableTable kind="projects" />}
        {tab === 'journal' && <EditableTable kind="journal" />}
        {tab === 'principles' && <EditableTable kind="principles" />}
        {tab === 'pillars' && <EditableTable kind="pillars" />}
        {tab === 'manifesto' && <ManifestoEditor />}
      </main>
    </div>
  );
}