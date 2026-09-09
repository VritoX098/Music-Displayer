# Bishow's Code Sounds

> A personal music portfolio website for Bishow Gyawali — a cute, premium, monochrome home for music made with code.

This static site showcases two original tracks created with [Strudel](https://strudel.cc). It features a custom-built audio player, links to the live Strudel code for each track, and a minimal, sophisticated design that puts the music first.

The site is **self-contained** — just HTML, CSS, and vanilla JavaScript. No frameworks, no build step, no heavy libraries.

---

## Features

- **Two-track editorial listing** – each track includes a title, description, genre, year, and a visual CSS-based "artwork" composition
- **Persistent audio player** – play/pause, seek, volume, current time, and auto-advance to the next track
- **Strudel integration** – each track links directly to its Strudel code page (the code itself is never displayed on the site)
- **External listening links** – one-click access to the audio on Bandcamp, SoundCloud, or a CDN
- **Social links** – Facebook, Instagram, YouTube, and GitHub (easily customisable)
- **Responsive & accessible** – mobile-first, keyboard-navigable, with support for `prefers-reduced-motion`

---

## How to run

1. Clone or download the repository
2. Serve the site over HTTP (required for local audio files)

**With Python 3:**

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`

**With Node.js:**

```bash
npx serve
```

**Or use any static server** (GitHub Pages, Netlify, Vercel, etc.)

> **Important:** Opening `index.html` directly from the filesystem (`file://`) will **not** play local audio files due to browser security restrictions. Always serve the site over HTTP.

---

## Tracks

The site currently includes two tracks. All track data is stored in the `tracks` array inside `script.js`.

| # | Title (placeholder) | Genre | Year | Audio file |
|---|---------------------|-------|------|------------|
| 1 | TRACK TITLE ONE | Drum | 2026 | `Songs/First-Song.wav` |
| 2 | TRACK TITLE TWO | Clam | 2026 | `Songs/Second-Song.wav` |

Each track also has:
- An **external audio URL** (for listening elsewhere)
- A **Strudel URL** (opens the code in a new tab)

> **Note:** The song titles, descriptions, and genre labels are **placeholders** – they are kept easy to change in the code.

---

## How to customise

All site content is driven by a few variables in `script.js`.

### Add or edit tracks

Open `script.js` and locate the `tracks` array. Each object has these properties:

```javascript
{
  title: "Your title",              // string
  description: "A short blurb",     // string
  genre: "Genre",                   // string
  year: "2026",                     // string
  audioFile: "Songs/YourFile.wav",  // path (relative to site root)
  audioUrl: "https://...",          // external listening link
  strudelUrl: "https://strudel.cc/#..." // link to Strudel code
}
```

To add a new track, append a new object to the array. The player will automatically display it.

### Update social links

In `script.js`, find the `socialLinks` object:

```javascript
const socialLinks = {
  facebook: "https://www.facebook.com/bishwo.gyawali.2025",
  instagram: "https://www.instagram.com/bishow_gyawali/",
  youtube: "https://www.youtube.com/@pramiskunwar",
  github: "https://github.com/VritoX098"
};
```

Edit the URLs as needed.

### Change the hero text or About copy

Open `index.html` and look for the corresponding sections. The hero subtitle, About paragraph, and footer are all written directly in the HTML.

### Modify the visual design

The design system lives in `style.css` using **CSS custom properties** (variables) near the top of the file. Change colours, spacing, or typography there.

---

## Deployment

### GitHub Pages

1. Push the repository to GitHub
2. Go to Settings → Pages
3. Set the source to the `main` branch (or `gh-pages`) and the root folder

### Netlify / Vercel

Simply connect the repository and deploy as a static site – no build command needed.

---

## Accessibility & Behaviour

- A single `<audio>` element powers the player; the UI reacts to native audio events
- Focus-visible outlines are provided for keyboard users
- A "skip to content" link is available at the top of the page
- The track reveal animation respects `prefers-reduced-motion`
- ARIA labels are used on interactive controls

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Local audio doesn't play when opening `index.html` directly | Serve the site over HTTP (see "How to run") |
| Autoplay is blocked by the browser | User interaction (clicking Play or selecting a track) will start playback |
| Changes to `script.js` don't appear | Clear your browser cache or do a hard refresh |

---

## Contributing

Fixes, improvements, and content updates are welcome. Please open an issue or pull request for any code changes.

---

## Credits & License

Built for **Bishow Gyawali** – music created with [Strudel](https://strudel.cc).

This project is provided as-is. No license file is included; add one if you wish to clarify reuse terms.
```
