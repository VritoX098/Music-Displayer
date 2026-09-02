/* ==========================================================================
   BISHOW GYAWALI — script.js
   Vanilla JS only. No dependencies.

   Structure:
   1. DATA        — edit tracks[] and socialLinks{} to update site content
   2. RENDER       — builds track rows + social links from the data above
   3. PLAYER       — one shared <audio> element, custom transport UI
   4. NAV          — mobile menu, smooth scroll
   5. REVEAL       — scroll-in animation for track rows
   ========================================================================== */

(function () {
  "use strict";

  /* ========================================================================
     1. DATA
     Replace the placeholder values below with your real track and link info.
     Add a third or fourth track by copying an existing object into the array.
     ======================================================================== */

  const tracks = [
    {
      title: "TRACK TITLE ONE",              // ← replace: song title
      description: "One short line describing the mood or idea behind the track.", // ← replace
      genre: "Electronic",                    // ← replace: genre label
      year: "2026",                           // ← replace: release year
      audioFile: "audio/song-1.mp3",          // ← replace: path to local audio file
      audioUrl: "https://example.com/song-1", // ← replace: external listen link (e.g. SoundCloud, Bandcamp)
      strudelUrl: "https://strudel.cc/#REPLACE_WITH_CODE_LINK_1" // ← replace: Strudel code link
    },
    {
      title: "TRACK TITLE TWO",               // ← replace: song title
      description: "One short line describing the mood or idea behind the track.", // ← replace
      genre: "Experimental",                  // ← replace: genre label
      year: "2026",                           // ← replace: release year
      audioFile: "audio/song-2.mp3",          // ← replace: path to local audio file
      audioUrl: "https://example.com/song-2", // ← replace: external listen link
      strudelUrl: "https://strudel.cc/#REPLACE_WITH_CODE_LINK_2" // ← replace: Strudel code link
    }
  ];

  // Replace each URL below with your real profile links.
  // Leaving a value as "#" will render the link but it won't go anywhere.
  const socialLinks = {
    Facebook:  "#", // ← replace with Facebook URL
    Instagram: "#", // ← replace with Instagram URL
    YouTube:   "#", // ← replace with YouTube URL
    GitHub:    "#"  // ← replace with GitHub URL
  };

  /* ========================================================================
     2. RENDER
     ======================================================================== */

  const trackListEl = document.getElementById("trackList");
  const socialListEl = document.getElementById("socialLinks");

  // Deterministic, decorative "waveform" line generated per track from its
  // title, so each track gets a stable but distinct visual identity
  // without needing any artwork.
  function generateWavePath(seedText, points) {
    let seed = 0;
    for (let i = 0; i < seedText.length; i++) {
      seed = (seed * 31 + seedText.charCodeAt(i)) % 100000;
    }
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const width = 220;
    const midY = 11;
    const step = width / (points - 1);
    let d = `M0,${midY}`;

    for (let i = 1; i < points; i++) {
      const x = Math.round(i * step);
      const amp = 2 + rand() * 8;
      const y = midY + (rand() > 0.5 ? -amp : amp) * (0.4 + rand() * 0.6);
      d += ` L${x},${y.toFixed(1)}`;
    }
    return d;
  }

  function renderTracks() {
    trackListEl.innerHTML = "";

    tracks.forEach((track, i) => {
      const index = String(i + 1).padStart(2, "0");
      const wavePath = generateWavePath(track.title + i, 28);

      const row = document.createElement("article");
      row.className = "track";
      row.dataset.index = String(i);

      row.innerHTML = `
        <span class="track-index" aria-hidden="true">${index}</span>

        <div class="track-main">
          <div class="track-heading">
            <h3 class="track-title">${escapeHtml(track.title)}</h3>
          </div>
          <p class="track-desc">${escapeHtml(track.description)}</p>

          <div class="track-wave" aria-hidden="true">
            <svg viewBox="0 0 220 22" preserveAspectRatio="none">
              <path d="${wavePath}" />
            </svg>
          </div>

          <div class="track-meta">
            <span>${escapeHtml(track.genre)}</span>
            <span class="dot">·</span>
            <span>${escapeHtml(track.year)}</span>
          </div>
        </div>

        <div class="track-actions">
          <button class="track-play-btn" data-play-index="${i}"
                  aria-label="Play ${escapeHtml(track.title)}">
            <svg class="icon-play" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            <svg class="icon-pause" viewBox="0 0 24 24"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>
          </button>

          <div class="track-links">
            <a href="${escapeAttr(track.strudelUrl)}" target="_blank" rel="noopener">
              View Strudel Code <span aria-hidden="true">↗</span>
            </a>
            <a href="${escapeAttr(track.audioUrl)}" target="_blank" rel="noopener">
              Listen externally <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      `;

      trackListEl.appendChild(row);
    });

    // Wire up play buttons after render
    trackListEl.querySelectorAll("[data-play-index]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.dataset.playIndex);
        handleTrackButtonClick(idx);
      });
    });
  }

  function renderSocialLinks() {
    socialListEl.innerHTML = "";
    Object.entries(socialLinks).forEach(([label, url]) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <a href="${escapeAttr(url)}" target="_blank" rel="noopener">
          <span>${escapeHtml(label)}</span>
          <span class="arrow" aria-hidden="true">↗</span>
        </a>
      `;
      socialListEl.appendChild(li);
    });
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str == null ? "" : String(str);
    return div.innerHTML;
  }
  function escapeAttr(str) {
    return escapeHtml(str).replace(/"/g, "&quot;");
  }

  /* ========================================================================
     3. PLAYER
     A single <audio> element is shared across all tracks; only one track
     plays at a time. UI state (active row, play icon, progress) is kept in
     sync with the audio element's real events.
     ======================================================================== */

  const audioEl = document.getElementById("audioEl");
  const playerEl = document.getElementById("player");
  const playBtn = document.getElementById("playBtn");
  const progressBar = document.getElementById("progressBar");
  const currentTimeEl = document.getElementById("currentTime");
  const durationTimeEl = document.getElementById("durationTime");
  const volumeBar = document.getElementById("volumeBar");
  const muteBtn = document.getElementById("muteBtn");
  const playerIndexEl = document.getElementById("playerIndex");
  const playerTitleEl = document.getElementById("playerTitle");
  const playerGenreEl = document.getElementById("playerGenre");

  let currentTrackIndex = null;
  let isSeeking = false;
  let lastVolume = 0.8;

  audioEl.volume = lastVolume;

  function formatTime(seconds) {
    if (!isFinite(seconds) || seconds < 0) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  function loadTrack(index, autoplay) {
    const track = tracks[index];
    if (!track) return;

    currentTrackIndex = index;
    audioEl.src = track.audioFile;
    audioEl.load();

    playerIndexEl.textContent = String(index + 1).padStart(2, "0");
    playerTitleEl.textContent = track.title;
    playerGenreEl.textContent = `${track.genre} · ${track.year}`;

    progressBar.value = 0;
    currentTimeEl.textContent = "0:00";
    durationTimeEl.textContent = "0:00";

    updateActiveRow();

    if (autoplay) {
      audioEl.play().catch(() => {
        // Autoplay can be blocked until the file exists / user has interacted;
        // UI state below still reflects the (paused) reality.
      });
    }
  }

  function handleTrackButtonClick(index) {
    if (currentTrackIndex === index) {
      togglePlay();
    } else {
      loadTrack(index, true);
    }
  }

  function togglePlay() {
    if (currentTrackIndex === null) {
      loadTrack(0, true);
      return;
    }
    if (audioEl.paused) {
      audioEl.play().catch(() => {});
    } else {
      audioEl.pause();
    }
  }

  function updateActiveRow() {
    document.querySelectorAll(".track").forEach((row) => {
      const idx = Number(row.dataset.index);
      row.classList.toggle("is-active", idx === currentTrackIndex);
      row.classList.toggle("is-playing", idx === currentTrackIndex && !audioEl.paused);
    });
  }

  playBtn.addEventListener("click", togglePlay);

  audioEl.addEventListener("play", () => {
    playerEl.classList.add("is-playing");
    playBtn.setAttribute("aria-label", "Pause");
    updateActiveRow();
  });

  audioEl.addEventListener("pause", () => {
    playerEl.classList.remove("is-playing");
    playBtn.setAttribute("aria-label", "Play");
    updateActiveRow();
  });

  audioEl.addEventListener("ended", () => {
    // Advance to the next track automatically, if one exists.
    if (currentTrackIndex !== null && currentTrackIndex < tracks.length - 1) {
      loadTrack(currentTrackIndex + 1, true);
    } else {
      playerEl.classList.remove("is-playing");
      updateActiveRow();
    }
  });

  audioEl.addEventListener("loadedmetadata", () => {
    durationTimeEl.textContent = formatTime(audioEl.duration);
    progressBar.max = 100;
  });

  audioEl.addEventListener("timeupdate", () => {
    if (isSeeking) return;
    currentTimeEl.textContent = formatTime(audioEl.currentTime);
    if (audioEl.duration) {
      progressBar.value = (audioEl.currentTime / audioEl.duration) * 100;
    }
  });

  progressBar.addEventListener("input", () => {
    isSeeking = true;
    if (audioEl.duration) {
      currentTimeEl.textContent = formatTime((progressBar.value / 100) * audioEl.duration);
    }
  });
  progressBar.addEventListener("change", () => {
    if (audioEl.duration) {
      audioEl.currentTime = (progressBar.value / 100) * audioEl.duration;
    }
    isSeeking = false;
  });

  volumeBar.addEventListener("input", () => {
    const v = Number(volumeBar.value) / 100;
    audioEl.volume = v;
    audioEl.muted = v === 0;
    updateMuteIcon();
  });

  muteBtn.addEventListener("click", () => {
    if (audioEl.muted || audioEl.volume === 0) {
      audioEl.muted = false;
      audioEl.volume = lastVolume || 0.8;
      volumeBar.value = Math.round(audioEl.volume * 100);
    } else {
      lastVolume = audioEl.volume;
      audioEl.muted = true;
    }
    updateMuteIcon();
  });

  function updateMuteIcon() {
    muteBtn.setAttribute(
      "aria-label",
      audioEl.muted || audioEl.volume === 0 ? "Unmute" : "Mute"
    );
    muteBtn.style.opacity = audioEl.muted || audioEl.volume === 0 ? "0.5" : "1";
  }

  volumeBar.value = Math.round(lastVolume * 100);

  /* ========================================================================
     4. NAV
     ======================================================================== */

  const navToggle = document.getElementById("navToggle");
  const mobileNav = document.getElementById("mobileNav");

  navToggle.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open menu");
    });
  });

  /* ========================================================================
     5. REVEAL
     Simple, restrained scroll-in for track rows only.
     ======================================================================== */

  function initReveal() {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rows = document.querySelectorAll(".track");

    if (prefersReduced || !("IntersectionObserver" in window)) {
      rows.forEach((row) => row.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    rows.forEach((row) => observer.observe(row));
  }

  /* ========================================================================
     Init
     ======================================================================== */

  document.getElementById("year").textContent = new Date().getFullYear();

  renderTracks();
  renderSocialLinks();
  initReveal();
})();
