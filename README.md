# The Inner Circle | GECA — React version

A full React (Vite) conversion of the static site, with the new features
requested: a glowing logo-mark "star" in the hero, an animated scroll
progress indicator, expandable pillars, a full manifesto, an auto-rotating
member photo carousel, clickable doctrine principles, three new team
members with a charcoal hover state, animated filler panels, click-to-read
modals for people/journal/pillars/doctrine, and a complete multi-column
footer.

## Run it

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

`npm run build` outputs a static `dist/` folder you can host anywhere
(Netlify, Vercel, GitHub Pages, your own server).

Vercel deployments include a rewrite to `index.html` so direct visits to
client-side routes such as `/AshtheBuilder` load the React app.

## Shared admin content

Admin edits are stored in Supabase so they appear to every visitor, rather than
only in the browser that made the edit.

1. In the Supabase SQL Editor, run [`supabase/schema.sql`](./supabase/schema.sql).
2. In the Vercel project settings, add these environment variables for the
   production deployment:
   - `SUPABASE_URL` — the project URL from Supabase project settings.
   - `SUPABASE_SERVICE_ROLE_KEY` — the server-side `service_role` JWT or
     `sb_secret_...` key, not the publishable/anon key.
3. Redeploy the Vercel project so the API receives the new environment values.

Keep the Supabase service role key private: add it only as a Vercel environment
variable, never as a `VITE_` variable or in client-side code. The database table
has row-level security enabled and is accessed through the Vercel API. The
admin page also offers an explicit option to publish edits previously saved in
that browser; this replaces the current shared content.

## Project structure

```
api/
  content.js               – Vercel API for shared website content
supabase/
  schema.sql               – shared content table and row-level security
src/
  App.jsx                 – composes the whole page
  ModalContext.jsx         – shared info-modal state (React context)
  data.js                  – all site copy: pillars, doctrine, people, journal, manifesto
  styles.css               – full stylesheet (ported + extended)
  hooks/
    useReveal.js           – scroll-reveal-on-enter hook
    useSectionProgress.js  – active section + scroll-progress hook
  components/
    Intro, Header, SectionProgress, Hero, VisualBreak, Pillars,
    Manifesto, Founder, Doctrine, People, Journal, Entry, Footer,
    Modal, AnimatedPanel
public/
  assets/                  – logo + founder portrait (only two raster images left)
```
