import React, { useMemo, useState } from 'react';
import { useContentList, useResetList } from '../ContentContext.jsx';

const SESSION_KEY = 'circle-admin-session';
// NOTE: this is a soft client-side gate for a static site with no backend —
// it keeps casual visitors out of /AshtheBuilder, it is not real auth.
// Change this before sharing the link with anyone else.
const PASSWORD = 'innercircle2026';

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
  const [error, setError] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (pw === PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, '1');
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
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
        <button type="submit">ENTER <b>→</b></button>
        {error && <small className="admin-gate-error">That key doesn't open this door.</small>}
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

  const flashSaved = () => { setSavedFlash(true); setTimeout(() => setSavedFlash(false), 1200); };

  const addItem = (e) => {
    e.preventDefault();
    if (!draft[fields[1]?.key] && !draft[fields[0]?.key]) return;
    setItems([...items, draft]);
    setDraft(emptyOf(fields));
    flashSaved();
  };

  const removeItem = (i) => { setItems(items.filter((_, idx) => idx !== i)); flashSaved(); };

  const moveItem = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    setItems(next);
    flashSaved();
  };

  const startEdit = (i) => { setEditingIndex(i); setEditDraft({ ...items[i] }); };
  const saveEdit = () => {
    setItems(items.map((it, idx) => (idx === editingIndex ? editDraft : it)));
    setEditingIndex(null);
    setEditDraft(null);
    flashSaved();
  };

  const copyJSON = () => navigator.clipboard?.writeText(JSON.stringify(items, null, 2));

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <h2>{kind}</h2>
        <div className="admin-panel-head-actions">
          {savedFlash && <span className="admin-saved-flash">Saved — live on the site now</span>}
          <button className="admin-ghost-btn" onClick={() => confirm('Reset this section back to its built-in defaults? This discards any edits made here.') && resetList()} type="button">RESET DEFAULTS</button>
          <button className="admin-copy-btn" onClick={copyJSON} type="button">COPY AS JSON</button>
        </div>
      </div>
      <p className="admin-hint">
        Changes here save to this browser automatically and update the live site immediately —
        including in another tab already open to the home page. They are NOT shared with other
        people's browsers (there's no server), so use "Copy as JSON" and paste into
        <code> src/data.js</code> to ship a change to everyone permanently.
      </p>

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
                  <button type="button" onClick={saveEdit}>SAVE</button>
                  <button type="button" className="ghost" onClick={() => setEditingIndex(null)}>CANCEL</button>
                </div>
              </>
            ) : (
              <>
                <div className="admin-row-order">
                  <button type="button" disabled={i === 0} onClick={() => moveItem(i, -1)} aria-label="Move up">↑</button>
                  <button type="button" disabled={i === items.length - 1} onClick={() => moveItem(i, 1)} aria-label="Move down">↓</button>
                </div>
                <div className="admin-row-summary">
                  <b>{it[fields[1]?.key] || it[fields[0]?.key]}</b>
                  <small>{it[fields[0]?.key]}</small>
                </div>
                <div className="admin-row-actions">
                  <button type="button" onClick={() => startEdit(i)}>EDIT</button>
                  <button type="button" className="ghost" onClick={() => removeItem(i)}>DELETE</button>
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
        <button type="submit">+ ADD {kind.slice(0, -1).toUpperCase()}</button>
      </form>
    </div>
  );
}

function ManifestoEditor() {
  const [paragraphs, setParagraphs] = useContentList('manifesto');
  const resetList = useResetList('manifesto');
  const update = (i, val) => setParagraphs(paragraphs.map((p, idx) => (idx === i ? val : p)));
  const remove = (i) => setParagraphs(paragraphs.filter((_, idx) => idx !== i));
  const copyJSON = () => navigator.clipboard?.writeText(JSON.stringify(paragraphs, null, 2));

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <h2>manifesto</h2>
        <div className="admin-panel-head-actions">
          <button className="admin-ghost-btn" onClick={() => confirm('Reset to the built-in manifesto text?') && resetList()} type="button">RESET DEFAULTS</button>
          <button className="admin-copy-btn" onClick={copyJSON} type="button">COPY AS JSON</button>
        </div>
      </div>
      <p className="admin-hint">
        One paragraph per box, in order — this is what "READ THE FULL MANIFESTO" shows on the
        live site, updated immediately. Paste the copied array into the <code>manifesto</code> export
        in <code>src/data.js</code> to make it permanent.
      </p>
      {paragraphs.map((p, i) => (
        <div className="admin-manifesto-row" key={i}>
          <textarea value={p} onChange={(e) => update(i, e.target.value)} />
          <button type="button" className="ghost" onClick={() => remove(i)}>DELETE</button>
        </div>
      ))}
      <button type="button" onClick={() => setParagraphs([...paragraphs, ''])}>+ ADD PARAGRAPH</button>
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
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(SESSION_KEY) === '1');
  const [tab, setTab] = useState('overview');

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
        {tab === 'overview' && (
          <div className="admin-panel">
            <h2>overview</h2>
            <p className="admin-hint">
              A live snapshot of what's currently on the site. Edits made in any tab of this
              dashboard apply to the real site straight away — open the home page in another tab
              to watch it update.
            </p>
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