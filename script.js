/* ==========================================================================
   Bishow Gyawali — script.js
   Track data · social links · a tiny vanilla audio player
   ========================================================================== */

/* --------------------------------------------------------------------------
   ✏️  CONFIG — everything you'll want to edit lives here
   -------------------------------------------------------------------------- */

/**
 * TRACKS
 * Add a new object to this array to add a song. Order = display order.
 *
 *  title        → ✏️ REPLACE placeholder titles
 *  description  → ✏️ REPLACE placeholder descriptions
 *  genre        → ✏️ REPLACE placeholder genre labels
 *  year         → release year
 *  audio        → list of sources, tried in order (local first, then external)
 *  externalUrl  → shown as "external audio ↗"
 *  strudelUrl   → shown as "view strudel code ↗" (code itself is never displayed)
 *  art          → "orbit" | "dots" | "arcs"  (CSS composition used instead of artwork)
 */
const TRACKS = [
  {
    title: "TRACK TITLE ONE",            // ✏️ REPLACE
    description: "My first song",        // ✏️ REPLACE
    genre: "Drum",                       // ✏️ REPLACE
    year: 2026,
    audio: [
      "Songs/First-Song.wav",
      "https://cdn.hackclub.com/01a04e36-f704-71b0-82c3-d607f317fa8f/aria-song_audio.mp4",
    ],
    externalUrl: "https://cdn.hackclub.com/01a04e36-f704-71b0-82c3-d607f317fa8f/aria-song_audio.mp4",
    strudelUrl: "https://strudel.cc/#c2V0Y3BtKDExNS80KQoKYXJyYW5nZSgKICBbNSwgCiAgICBub3RlKCI8W2MyIGMzXSo0IFtiYjEgYmIyYSo0IFtmMiBmM10qNCBbZWIyIGViM10qND4iKQogICAgICAuc291bmQoImdtX3N5bnRoX2Jhc3NfMSIpCiAgICAgIC5scGYoODAwKS5fcGlhbm9yb2xsKHsgbGFiZWxzOiAxIH0pCiAgXSwKCiAgWzIwLCBzdGFjaygKICAgIHNvdW5kKCJiZCBiZCBzZCBoaCBiZCBjcCBzZCBoaCIpLAogICAgc291bmQoIm1ldGFsIH4gamF6eiBqYXp6OjEiKSwKICAgIG4oIjAgMSA0IDIiKS5zb3VuZCgiamF6eiIpLAogICAgc291bmQoYAogICAgICA8YmQqNCwgbHQqMiwgYmQqMiwgYmQqNCwgbHQqMiwgYmQqMj4KICAgICAgPGJkKjIsIGx0LCBtdCwgYmQqMiwgbHQsIGJkKjIsIGx0LCBtdCwgYmQqMiwgbHQ%2BCiAgICAgIDxiZCo0LCBsdCo0LCBiZCo0LCBsdCo0PgogICAgICA8YmQqMiwgbHQqMiwgbXQqMiwgYmQqMiwgYmQqMiwgbHQqMiwgbXQqMiwgYmQqMj4KICAgIGApLmJhbmsoIlJvbGFuZFRSODA4IiksCiAgICBzKCJoaCoxNiIpLmdhaW4oIlsuMjUgMV0qNCIpLAogICAgc291bmQoImJkKjQsIFstIGNwXSoyLCBbLSBoaF0qNCIpLmJhbmsoIlJvbGFuZFRSOTA5IiksCiAgICBzb3VuZCgiYmQgc2QsIC0gLSAtIGhoIC0gaGggLSAtLCAtIHBlcmMgLSBwZXJjOjEqMiIpCiAgICAgIC5iYW5rKCJSb2xhbmRDb21wdXJoeXRobTEwMDAiKSwKICAgIHNvdW5kKCJiZCo0LCBbfiA8c2QgY3A%2BXSoyLCBbfiBoaF0qNCIpLmJhbmsoIlJvbGFuZFRSOTA5IikKICApXSwKCiAgWzgsIAogICAgbigiMCAxIFs0IDNdIDIgMCAyIFt%2BIDNdIDQiKS5zb3VuZCgiamF6eiIpLnJldigpLnNsb3coMikuX3BpYW5vcm9sbCgpCiAgXQopCg%3D%3D",
    art: "orbit",
  },
  {
    title: "TRACK TITLE TWO",            // ✏️ REPLACE
    description: "My second song",       // ✏️ REPLACE
    genre: "Clam",                       // ✏️ REPLACE
    year: 2026,
    audio: [
      "Songs/Second-Song.wav",
      "https://user-cdn.hackclub-assets.com/01a05d4a-edfd-710d-9b1e-960a0a793dde/my_strudel_song_audio.mp4",
    ],
    externalUrl: "https://user-cdn.hackclub-assets.com/01a05d4a-edfd-710d-9b1e-960a0a793dde/my_strudel_song_audio.mp4",
    strudelUrl: "https://strudel.cc/#Ly8gUHJlYmFrZSBzY3JpcHQKLy8KLy8gVGhpcyBpcyBjb2RlIHRoYXQgaXMgbG9hZGVkIGJlZm9yZSB5b3VyIHBhdHRlcm4gaXMgcnVuLgovLyBZb3UgY2FuIHVzZSBpdCB0byBkZWZpbmUgY3VzdG9tIGZ1bmN0aW9ucyB0byB1c2UgaW4gYW55IHBhdHRlcm4uCi8vIAovLyBUaGlzIGlzIGFuIGluaXRpYWwgZXhhbXBsZSBzY3JpcHQuIFlvdSBjYW4gZWRpdCBpdCB0byBhZGQgCi8vIHlvdXIgb3duIGZ1bnRpb25zLgovLwovLyBUbyB1c2UgYSBzY3JpcHQgc2hhcmVkIGJ5IHNvbWUgb3RoZXIgdXNlciB5b3UgY2FuIHVzZQovLyB0aGUgaW1wb3J0LWJ1dHRvbiBvciBwYXN0ZSB0aGUgc2NyaXB0IGluIHRoaXMgZWRpdG9yLgoKY29uc3QgcmF0Y2hldCA9IHJlZ2lzdGVyKCdyYXRjaGV0JywgKHBhdCkgPT4gcGF0LnNvbWV0aW1lcyhwbHkoMikpKQoKc2V0Y3BtKDExNS80KQoKYXJyYW5nZSgKICAvLyBJbnRybyAofjEwcykKICBbNSwgc3RhY2soCiAgICAiMCwyLFs3IDZdIgogICAgICAuYWRkKCI8MCAxIDIgMyA0IDUgNyA4PiIpCiAgICAgIC5zY2FsZSgnQyBiZWJvcCBtYWpvcicpCiAgICAgIC50cmFuc3Bvc2UoIjwwIDEgMiAxPi84IikKICAgICAgLnNsb3coMikKICAgICAgLm5vdGUoKS5waWFubygpCiAgICAgIC5jb2xvcignIzAwQjhENCcpCiAgICAgIC5fcGlhbm9yb2xsKCksCgogICAgbm90ZSgiYzMgZTMgZzMgYjMiLmFkZCgiPDAgMiA0IDUgNz4iKSkKICAgICAgLnNvdW5kKCJwaWFubyIpCiAgICAgIC5scGYoc2F3LnJhbmdlKDgwMCwgNDAwMCkpCiAgICAgIC5fcGlhbm9yb2xsKCksCgogICAgc291bmQoImJkIFt%2BIHNkXSBoaCo0IikKICAgICAgLmJhbmsoIlJvbGFuZFRSOTA5IikKICAgICAgLnJldigpCiAgICAgIC5zcGVlZCgtMikKICAgICAgLmxwZig2MDApCiAgICAgIC5nYWluKC40KQogICldLAoKICAvLyBNaWRkbGUgcGFydCAxICh%2BMjBzKQogIFsxMCwgc3RhY2soCiAgICBzb3VuZCgiYmQqMiwgaGgqMiBbaGggb2hdIiksCgogICAgbm90ZSgiYzIgZzIgZDMgYTMiKQogICAgICAuc291bmQoInNhd3Rvb3RoIikKICAgICAgLmxwZig0MDApCiAgICAgIC5yb29tKDEpCiAgICAgIC5kZWxheSguOCkKICAgICAgLnNsb3coNCkKICAgICAgLmdhaW4oLjYpCiAgICAgIC5fcGlhbm9yb2xsKCksCgogICAgc291bmQoImJkIFt%2BIHNkXSBoaCo0IikKICAgICAgLmJhbmsoIlJvbGFuZFRSOTA5IikKICAgICAgLnJldigpCiAgICAgIC5zcGVlZCgtMikKICAgICAgLmxwZig2MDApCiAgICAgIC5nYWluKC40KQogICAgLl9waWFub3JvbGwoKQogICldLAoKICAvLyBNaWRkbGUgcGFydCAyICh%2BMjBzKQogIFsxMCwgc3RhY2soCiAgICBzb3VuZCgiYmQgW34gc2RdIGhoKjQiKS5iYW5rKCJSb2xhbmRUUjkwOSIpLAoKICAgIHNvdW5kKCJiZCBbfiBzZF0gaGgqNCIpCiAgICAgIC5iYW5rKCJSb2xhbmRUUjkwOSIpCiAgICAgIC5yZXYoKQogICAgICAuc3BlZWQoLTIpCiAgICAgIC5scGYoNjAwKQogICAgICAuZ2FpbiguNCksCgogICAgbm90ZSgiYzIgZzIgZDMgYTMiKQogICAgICAuc291bmQoInNhd3Rvb3RoIikKICAgICAgLmxwZig0MDApCiAgICAgIC5yb29tKDEpCiAgICAgIC5kZWxheSguOCkKICAgICAgLnNsb3coNCkKICAgICAgLmdhaW4oLjYpCiAgICAgIC5fcGlhbm9yb2xsKCkKICApXSwKCiAgLy8gRW5kaW5nICh%2BNXMpCiAgWzMsCiAgICBzb3VuZCgiYmQgW34gc2RdIGhoKjQiKQogICAgICAuYmFuaygiUm9sYW5kVFI5MDkiKQogICAgICAucmV2KCkKICAgICAgLnNwZWVkKC0yKQogICAgICAubHBmKDYwMCkKICAgICAgLmdhaW4oLjQpCiAgXQopCg%3D%3D",
    art: "dots",
  },
];

/**
 * SOCIALS — exact URLs. Change the handle text if you like; keep URLs as given.
 */
const SOCIALS = [
  { name: "Facebook",  handle: "bishwo.gyawali.2025", url: "https://www.facebook.com/bishwo.gyawali.2025", icon: "facebook" },
  { name: "Instagram", handle: "@bishow_gyawali",     url: "https://www.instagram.com/bishow_gyawali/",   icon: "instagram" },
  { name: "YouTube",   handle: "@pramiskunwar",       url: "https://www.youtube.com/@pramiskunwar",       icon: "youtube" },
  { name: "GitHub",    handle: "VritoX098",           url: "https://github.com/VritoX098",                icon: "github" },
];

/* --------------------------------------------------------------------------
   Icons (inline SVG, monochrome, currentColor)
   -------------------------------------------------------------------------- */
const ICONS = {
  play: '<svg class="icon-play" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M4 2.5v11l9-5.5z"/></svg>',
  pause: '<svg class="icon-pause" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M4 2.5h3v11H4zM9 2.5h3v11H9z"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.5 12c0-3 .3-4.6.7-5.4a2.6 2.6 0 0 1 1.8-1.3C6.6 5 12 5 12 5s5.4 0 7 .3a2.6 2.6 0 0 1 1.8 1.3c.4.8.7 2.4.7 5.4s-.3 4.6-.7 5.4a2.6 2.6 0 0 1-1.8 1.3c-1.6.3-7 .3-7 .3s-5.4 0-7-.3a2.6 2.6 0 0 1-1.8-1.3c-.4-.8-.7-2.4-.7-5.4z"/><path d="M10 9.5v5l4.5-2.5z" fill="currentColor" stroke="none"/></svg>',
  github: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.6 5.5 6-.6.6-.6 1.2-.5 2V21"/></svg>',
};

/* --------------------------------------------------------------------------
   Helpers
   -------------------------------------------------------------------------- */
const $ = (sel, root = document) => root.querySelector(sel);

function pad(n) { return String(n).padStart(2, "0"); }

function formatTime(seconds) {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${pad(s)}`;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/* Art compositions — pure markup, styled in CSS */
function artMarkup(kind, index) {
  const num = pad(index + 1);
  switch (kind) {
    case "dots":
      return `<span class="art__line"></span><span class="art__line"></span><span class="art__ring"></span><span class="track__num">${num}</span>`;
    case "arcs":
      return `<span class="track__num">${num}</span>`;
    case "orbit":
    default: {
      const heights = [35, 70, 45, 100, 55, 80, 30];
      const bars = heights.map((h) => `<i style="--h:${h}%"></i>`).join("");
      return `<span class="art__sat"></span><span class="track__num">${num}</span><span class="art__wave">${bars}</span>`;
    }
  }
}

/* --------------------------------------------------------------------------
   Render tracks
   -------------------------------------------------------------------------- */
function renderTracks() {
  const list = $("#tracklist");
  $("#track-count").textContent = pad(TRACKS.length);

  list.innerHTML = TRACKS.map((t, i) => {
    const num = pad(i + 1);
    const id = `track-${i}`;
    const sources = t.audio.map((src) => `<source src="${escapeHtml(src)}">`).join("");
    return `
      <li class="track" data-index="${i}" id="${id}">
        <div class="track__art art--${escapeHtml(t.art || "orbit")}" aria-hidden="true">
          <span class="track__playing-tag">● now playing</span>
          ${artMarkup(t.art, i)}
        </div>

        <div class="track__body">
          <div class="track__head">
            <div>
              <p class="track__index">TRACK ${num}</p>
              <h3 class="track__title" id="${id}-title">${escapeHtml(t.title)}</h3>
            </div>
            <span class="eq" aria-hidden="true"><i></i><i></i><i></i></span>
          </div>

          <p class="track__desc">${escapeHtml(t.description)}</p>

          <ul class="track__tags" aria-label="Details">
            <li class="tag">${escapeHtml(t.genre)}</li>
            <li class="tag">${escapeHtml(t.year)}</li>
          </ul>

          <div class="player" role="group" aria-labelledby="${id}-title">
            <audio preload="metadata">${sources}</audio>
            <button class="play-btn" type="button" aria-label="Play ${escapeHtml(t.title)}" aria-pressed="false">
              ${ICONS.play}${ICONS.pause}
            </button>
            <div class="player__timeline">
              <input class="seek" type="range" min="0" max="100" step="0.1" value="0"
                     aria-label="Seek ${escapeHtml(t.title)}" aria-valuetext="0:00" />
              <div class="player__times">
                <span class="time-current">0:00</span>
                <span class="time-duration">–:––</span>
              </div>
              <p class="player__error" role="status">couldn’t load this audio — try the external link ↗</p>
            </div>
          </div>

          <div class="track__links">
            <a href="${escapeHtml(t.strudelUrl)}" target="_blank" rel="noopener noreferrer">view strudel code <span aria-hidden="true">↗</span></a>
            <a href="${escapeHtml(t.externalUrl)}" target="_blank" rel="noopener noreferrer">external audio <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </li>`;
  }).join("");
}

/* --------------------------------------------------------------------------
   Player — one track at a time
   -------------------------------------------------------------------------- */
function initPlayer() {
  const tracks = Array.from(document.querySelectorAll(".track"));
  let current = null; // the <li> currently playing

  tracks.forEach((el) => {
    const audio = $("audio", el);
    const btn = $(".play-btn", el);
    const seek = $(".seek", el);
    const cur = $(".time-current", el);
    const dur = $(".time-duration", el);
    const title = TRACKS[el.dataset.index].title;
    let scrubbing = false;

    const setPlayingUI = (playing) => {
      el.classList.toggle("is-playing", playing);
      btn.setAttribute("aria-pressed", String(playing));
      btn.setAttribute("aria-label", `${playing ? "Pause" : "Play"} ${title}`);
    };

    const updateSeek = () => {
      if (scrubbing || !audio.duration) return;
      const pct = (audio.currentTime / audio.duration) * 100;
      seek.value = pct;
      seek.style.setProperty("--pct", `${pct}%`);
      seek.setAttribute("aria-valuetext", formatTime(audio.currentTime));
      cur.textContent = formatTime(audio.currentTime);
    };

    btn.addEventListener("click", () => {
      if (audio.paused) {
        // pause whichever track is playing
        if (current && current !== el) $("audio", current).pause();
        btn.classList.add("is-loading");
        audio.play().then(() => {
          btn.classList.remove("is-loading");
        }).catch(() => {
          btn.classList.remove("is-loading");
          el.classList.add("has-error");
        });
      } else {
        audio.pause();
      }
    });

    audio.addEventListener("play", () => { current = el; el.classList.remove("has-error"); setPlayingUI(true); });
    audio.addEventListener("pause", () => setPlayingUI(false));
    audio.addEventListener("ended", () => {
      setPlayingUI(false);
      audio.currentTime = 0;
      updateSeek();
    });
    audio.addEventListener("loadedmetadata", () => { dur.textContent = formatTime(audio.duration); });
    audio.addEventListener("durationchange", () => { dur.textContent = formatTime(audio.duration); });
    audio.addEventListener("timeupdate", updateSeek);
    audio.addEventListener("waiting", () => btn.classList.add("is-loading"));
    audio.addEventListener("playing", () => btn.classList.remove("is-loading"));
    audio.addEventListener("error", () => {
      // fires only when every <source> failed
      btn.classList.remove("is-loading");
      el.classList.add("has-error");
      setPlayingUI(false);
    });

    // seeking (mouse, touch, keyboard)
    const seekTo = () => {
      if (!audio.duration) return;
      const t = (seek.value / 100) * audio.duration;
      cur.textContent = formatTime(t);
      seek.style.setProperty("--pct", `${seek.value}%`);
      seek.setAttribute("aria-valuetext", formatTime(t));
      return t;
    };
    seek.addEventListener("pointerdown", () => { scrubbing = true; });
    seek.addEventListener("input", () => { scrubbing = true; seekTo(); });
    seek.addEventListener("change", () => {
      const t = seekTo();
      if (t !== undefined) audio.currentTime = t;
      scrubbing = false;
    });
    seek.addEventListener("pointerup", () => { scrubbing = false; });
  });

  // Space / K toggles the current (or first) track when focus isn't in a control
  document.addEventListener("keydown", (e) => {
    if (e.key !== "k" && e.key !== "K") return;
    const tag = document.activeElement && document.activeElement.tagName;
    if (tag === "INPUT" || tag === "BUTTON" || tag === "TEXTAREA" || tag === "A") return;
    const target = current || tracks[0];
    if (target) $(".play-btn", target).click();
  });
}

/* --------------------------------------------------------------------------
   Render socials
   -------------------------------------------------------------------------- */
function renderSocials() {
  $("#social-list").innerHTML = SOCIALS.map((s) => `
    <li>
      <a class="social-link" href="${escapeHtml(s.url)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(s.name)} — opens in a new tab">
        <span class="social-link__name">
          <span class="social-link__icon">${ICONS[s.icon] || ""}</span>
          ${escapeHtml(s.name)}
        </span>
        <span class="social-link__handle">${escapeHtml(s.handle)} <span class="social-link__arrow" aria-hidden="true">↗</span></span>
      </a>
    </li>`).join("");
}

/* --------------------------------------------------------------------------
   Boot
   -------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  renderTracks();
  renderSocials();
  initPlayer();
  $("#year").textContent = new Date().getFullYear();
});
