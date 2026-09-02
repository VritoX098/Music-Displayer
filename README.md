# Music-Displayer — Bishow Gyawali

A small, static site for publishing code-created music (made with Strudel). This is a self-contained HTML/CSS/Vanilla JavaScript site that lists tracks, provides a persistent player, links to Strudel pages and external audio, and renders social links.

Live demo: open `index.html` in a browser or serve the site locally (see "How to run").

## Stack
- Language(s): HTML, CSS, JavaScript (Vanilla)
- Framework / runtime: Static site (no build step required)
- Notable libraries/services: Strudel (used as an external live-coding environment), no JS dependencies


## What this site does
- Presents a small collection of tracks with title, description, genre, year.
- Renders a persistent audio player with play/pause, seek, volume, and auto-advance.
- Shows per-track links to Strudel code and external listening pages.
- Renders social links for the artist.

## How to run (quick)
Easiest: open `index.html` in your browser (works for local testing, but for local audio files most browsers require serving over HTTP).

Recommended (serve from a local static server):

- Python 3:
  - python -m http.server 8000
  - open http://localhost:8000

- Node (serve):
  - npm install -g serve
  - serve .

- Or use any static hosting (GitHub Pages, Netlify, Vercel).

## How to customize content
All site content is driven by the `tracks` array and `socialLinks` object in `script.js`.

- Add or edit tracks:
  - Open `script.js`.
  - Edit entries in the `tracks` array. Each track object has:
    - `title` (string)
    - `description` (string)
    - `genre` (string)
    - `year` (string)
    - `audioFile` (string) — path to a local audio file inside `Songs/` (e.g. `Songs/MyTrack.mp3`) or a relative/absolute URL
    - `audioUrl` (string) — external listening link (Bandcamp, SoundCloud, CDN, etc.)
    - `strudelUrl` (string) — link to the Strudel page with the track code
  - To add more tracks, append new objects to the array.

- Add audio files:
  - Put audio files in the `Songs/` directory.
  - Update the `audioFile` property to point at the filename (relative to the site root).
  - Note: For local audio files to play in browsers you must serve files via HTTP (see "How to run").

- Update social links:
  - Edit the `socialLinks` object in `script.js` to change or add profile links.

- Site title, hero copy, About text:
  - Edit `index.html` to change visible text such as the wordmark, hero subtitle, and the About section.

- Footer year:
  - The copyright year is set dynamically by `script.js`. Edit `index.html` if you want to change wording.

## Deployment
- GitHub Pages:
  - Push the repository to GitHub.
  - In repository Settings → Pages, set the source to the `main` branch (or `gh-pages` branch) and choose the root folder.
- Netlify / Vercel:
  - Connect the repo and deploy as a static site — no build step required.

## Accessibility & behavior notes
- The player uses a single shared `<audio>` element and updates UI from native audio events.
- There are focus-visible outlines and a "skip to content" link for keyboard users.
- The track reveal animation respects `prefers-reduced-motion`.

## Troubleshooting
- If local audio doesn’t play when opening `index.html` directly, run a simple server (see "How to run") — most browsers block file:// audio for cross-origin/security reasons.
- If autoplay is blocked, user interaction (play button, selecting a track) will enable playback.

## Contributing
- Fixes, improvements and content updates are welcome. For code changes please open an issue or PR.
- If you want me to add this README directly to the repository, I can commit it for you.

## Credits & license
- Built for Bishow Gyawali. Tracks are authored/performed with Strudel (https://strudel.cc).
- No license file is included in this repo. Add a LICENSE file if you want to clarify reuse terms.
