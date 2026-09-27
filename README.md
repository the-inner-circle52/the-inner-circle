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

## Project structure

```
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

## Notes on content

- **Manifesto**: `src/data.js` → `manifesto` array. Click "READ THE FULL
  MANIFESTO" on the site, or edit the array directly.
- **Team bios**: `src/data.js` → `members` array (role, name, focus, bio,
  initials for the placeholder avatar). Three new members were added:
  Sumit Kakani, Himanshi Dikshit, Piyush Lalwani — I invented their role
  titles and one-line bios to match the existing pattern; edit freely.
- **Photo carousel**: `src/components/Founder.jsx` cycles through the
  founder's real photo plus a generated initial-avatar for every member
  in `data.js`, every ~3.2s. Swap in real photos by adding a `photo: '/assets/...'`
  field per member (drop the file in `public/assets/`).
- **Journal / doctrine detail text**: also in `data.js`, expand as needed.

## What didn't carry over 1:1 from the static version

To keep this within scope, a few purely cosmetic micro-interactions from
the original vanilla JS (the mouse-follow ambient glow orb, magnetic
button pull, and continuous scroll-linked image parallax) were left out
of the conversion. Everything else — reveal-on-scroll, the hero drift/
sweep animation, the line-mask heading wipes, image curtain-reveals, and
all layout/animation — carried over.
