import React, { useMemo, useState } from 'react';
import {
  members as initialMembers,
  projects as initialProjects,
  journal as initialJournal,
  principles as initialPrinciples,
  pillars as initialPillars,
  manifesto as initialManifesto,
} from '../data.js';

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

function EditableTable({ kind, items, setItems }) {
  const fields = FIELD_SETS[kind];
  const [draft, setDraft] = useState(emptyOf(fields));
  const [editingIndex, setEditingIndex] = useState(null);
  const [editDraft, setEditDraft] = useState(null);

  const addItem = (e) => {
    e.preventDefault();
    if (!draft[fields[1]?.key] && !draft[fields[0]?.key]) return;
    setItems([...items, draft]);
    setDraft(emptyOf(fields));
  };

  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));

  const startEdit = (i) => { setEditingIndex(i); setEditDraft({ ...items[i] }); };
  const saveEdit = () => {
    setItems(items.map((it, idx) => (idx === editingIndex ? editDraft : it)));
    setEditingIndex(null);
    setEditDraft(null);
  };

  const copyJSON = () => {
    const json = JSON.stringify(items, null, 2);
    navigator.clipboard?.writeText(json);
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <h2>{kind}</h2>
        <button className="admin-copy-btn" onClick={copyJSON} type="button">COPY AS JSON</button>
      </div>
      <p className="admin-hint">
        Changes here live only in this browser tab — there's no backend to save to.
        Use "Copy as JSON" and paste the array into <code>src/data.js</code> to make it permanent.
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

function ManifestoEditor({ paragraphs, setParagraphs }) {
  const update = (i, val) => setParagraphs(paragraphs.map((p, idx) => (idx === i ? val : p)));
  const remove = (i) => setParagraphs(paragraphs.filter((_, idx) => idx !== i));
  const copyJSON = () => navigator.clipboard?.writeText(JSON.stringify(paragraphs, null, 2));

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <h2>manifesto</h2>
        <button className="admin-copy-btn" onClick={copyJSON} type="button">COPY AS JSON</button>
      </div>
      <p className="admin-hint">One paragraph per box, in order. Paste the copied array into the <code>manifesto</code> export in <code>src/data.js</code>.</p>
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

  const [members, setMembers] = useState(initialMembers);
  const [projects, setProjects] = useState(initialProjects);
  const [journal, setJournal] = useState(initialJournal);
  const [principles, setPrinciples] = useState(initialPrinciples);
  const [pillars, setPillars] = useState(initialPillars);
  const [manifestoParas, setManifestoParas] = useState(initialManifesto);

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
            <p className="admin-hint">A quick snapshot of what's currently on the site (in this browser session).</p>
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
        {tab === 'members' && <EditableTable kind="members" items={members} setItems={setMembers} />}
        {tab === 'projects' && <EditableTable kind="projects" items={projects} setItems={setProjects} />}
        {tab === 'journal' && <EditableTable kind="journal" items={journal} setItems={setJournal} />}
        {tab === 'principles' && <EditableTable kind="principles" items={principles} setItems={setPrinciples} />}
        {tab === 'pillars' && <EditableTable kind="pillars" items={pillars} setItems={setPillars} />}
        {tab === 'manifesto' && <ManifestoEditor paragraphs={manifestoParas} setParagraphs={setManifestoParas} />}
      </main>
    </div>
  );
}