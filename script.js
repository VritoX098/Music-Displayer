(function() {
  'use strict';

  /* ============================================================
     SONG DATA
     ============================================================ */
  const songs = [
    {
      id: '808-bass-journey',
      title: '808 Bass Journey',
      artist: 'Strudel Live Coder',
      audio: 'your-song.mp3',
      artwork: null, // or 'artwork.jpg'
      sections: [
        { name: 'Bass', start: null },
        { name: 'Drums', start: null },
        { name: 'Chords', start: null },
        { name: 'Outro', start: null }
      ]
    }
    // Add more songs here:
    // {
    //   id: 'second-track',
    //   title: 'Second Track',
    //   artist: 'Strudel Live Coder',
    //   audio: 'second.mp3',
    //   artwork: null,
    //   sections: [
    //     { name: 'Intro', start: null },
    //     { name: 'Verse', start: null }
    //   ]
    // }
  ];

  /* ============================================================
     STATE
     ============================================================ */
  let currentTrackIndex = 0;
  let isPlaying = false;
  let isPausedByUser = false;
  let rotationAngle = 0;
  let animationFrameId = null;
  let isDraggingProgress = false;
  let libraryOpen = false;

  /* ============================================================
     DOM REFS
     ============================================================ */
  const audio = new Audio();
  audio.preload = 'metadata';

  const vinylRecord = document.getElementById('vinylRecord');
  const labelContent = document.getElementById('labelContent');
  const songTitle = document.getElementById('songTitle');
  const songArtist = document.getElementById('songArtist');
  const sectionsContainer = document.getElementById('sectionsContainer');
  const timeCurrent = document.getElementById('timeCurrent');
  const timeDuration = document.getElementById('timeDuration');
  const progressFill = document.getElementById('progressFill');
  const progressHandle = document.getElementById('progressHandle');
  const progressTrack = document.getElementById('progressTrack');
  const playBtn = document.getElementById('playBtn');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const libraryList = document.getElementById('libraryList');
  const libraryHeader = document.getElementById('libraryHeader');
  const libraryToggle = document.getElementById('libraryToggle');
  const libraryCount = document.getElementById('libraryCount');

  /* ============================================================
     HELPERS
     ============================================================ */
  function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  function getCurrentSong() {
    return songs[currentTrackIndex] || songs[0];
  }

  /* ============================================================
     VINYL LABEL
     ============================================================ */
  function renderLabel(song) {
    const hasArtwork = song.artwork && song.artwork.trim() !== '';
    if (hasArtwork) {
      labelContent.innerHTML = `<img class="label-artwork" src="${song.artwork}" alt="${song.title} artwork" />`;
    } else {
      labelContent.innerHTML = `
        <div class="label-text">
          <span class="label-title">${song.title}</span>
          <span class="label-artist">${song.artist}</span>
        </div>
      `;
    }
  }

  /* ============================================================
     SECTIONS
     ============================================================ */
  function renderSections(song) {
    if (!song.sections || song.sections.length === 0) {
      sectionsContainer.innerHTML = '';
      return;
    }
    sectionsContainer.innerHTML = song.sections
      .map(s => `<span class="section-tag" role="listitem">${s.name}</span>`)
      .join('');
  }

  /* ============================================================
     LIBRARY
     ============================================================ */
  function renderLibrary() {
    const currentSong = getCurrentSong();
    libraryList.innerHTML = songs
      .map((song, idx) => {
        const active = idx === currentTrackIndex ? 'active' : '';
        return `
          <div class="library-item ${active}" data-index="${idx}" role="listitem" tabindex="0">
            <span class="item-title">${song.title}</span>
            <span class="item-artist">${song.artist}</span>
          </div>
        `;
      })
      .join('');

    libraryCount.textContent = `${songs.length} song${songs.length !== 1 ? 's' : ''}`;

    // Attach click listeners
    document.querySelectorAll('.library-item').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.dataset.index, 10);
        if (idx !== currentTrackIndex) {
          loadTrack(idx);
        }
        // close library on mobile after selection (optional)
        if (window.innerWidth < 720) {
          toggleLibrary(false);
        }
      });
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const idx = parseInt(el.dataset.index, 10);
          if (idx !== currentTrackIndex) {
            loadTrack(idx);
          }
          if (window.innerWidth < 720) {
            toggleLibrary(false);
          }
        }
      });
    });
  }

  /* ============================================================
     TOGGLE LIBRARY
     ============================================================ */
  function toggleLibrary(forceState) {
    const isOpen = typeof forceState === 'boolean' ? forceState : !libraryOpen;
    libraryOpen = isOpen;
    libraryList.classList.toggle('open', libraryOpen);
    libraryHeader.classList.toggle('expanded', libraryOpen);
    libraryHeader.setAttribute('aria-expanded', libraryOpen);
  }

  /* ============================================================
     LOAD TRACK
     ============================================================ */
  function loadTrack(index) {
    if (index < 0 || index >= songs.length) return;
    const song = songs[index];
    if (!song) return;

    // Pause current
    if (isPlaying) {
      audio.pause();
      stopVinylAnimation();
      isPlaying = false;
      updatePlayButton();
    }

    currentTrackIndex = index;

    // Update UI
    songTitle.textContent = song.title;
    songArtist.textContent = song.artist;
    renderSections(song);
    renderLabel(song);
    renderLibrary();

    // Reset audio
    audio.src = song.audio;
    audio.load();
    audio.currentTime = 0;
    timeCurrent.textContent = '0:00';
    timeDuration.textContent = '0:00';
    progressFill.style.width = '0%';
    progressHandle.style.left = '0%';

    // Reset rotation? No – keep current angle for continuity.
    // but we set rotationAngle to current (already stored)
    // apply it
    vinylRecord.style.transform = `rotate(${rotationAngle}deg)`;

    // Reset play state
    isPlaying = false;
    updatePlayButton();

    // Handle metadata load
    if (audio.readyState >= 1) {
      timeDuration.textContent = formatTime(audio.duration);
    } else {
      audio.addEventListener('loadedmetadata', function onMeta() {
        timeDuration.textContent = formatTime(audio.duration);
        audio.removeEventListener('loadedmetadata', onMeta);
      });
    }

    // Update active library item
    document.querySelectorAll('.library-item').forEach(el => {
      el.classList.toggle('active', parseInt(el.dataset.index, 10) === index);
    });
  }

  /* ============================================================
     PLAY / PAUSE
     ============================================================ */
  function togglePlay() {
    if (!audio.src || audio.src === '') {
      // If no audio loaded, load first track
      loadTrack(0);
      // small delay to let audio load, then play
      setTimeout(() => {
        if (audio.src) {
          playAudio();
        }
      }, 100);
      return;
    }
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  }

  function playAudio() {
    if (!audio.src || audio.src === '') {
      loadTrack(0);
      setTimeout(() => {
        if (audio.src) {
          playAudio();
        }
      }, 150);
      return;
    }
    audio.play().catch(err => {
      // subtle error: log and show minimal message in console
      console.warn('Playback error:', err);
      // fallback: try loading again?
    });
    isPlaying = true;
    startVinylAnimation();
    updatePlayButton();
  }

  function pauseAudio() {
    audio.pause();
    isPlaying = false;
    stopVinylAnimation();
    updatePlayButton();
  }

  /* ============================================================
     PLAY BUTTON UI
     ============================================================ */
  function updatePlayButton() {
    if (isPlaying) {
      playBtn.classList.remove('paused');
      playBtn.classList.add('playing');
      playBtn.setAttribute('aria-label', 'Pause');
      playBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
        <span class="pause-icon" style="display:none;"></span>
      `;
    } else {
      playBtn.classList.remove('playing');
      playBtn.classList.add('paused');
      playBtn.setAttribute('aria-label', 'Play');
      playBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
        <span class="pause-icon" style="display:none;"></span>
      `;
    }
  }

  /* ============================================================
     VINYL ANIMATION
     ============================================================ */
  function startVinylAnimation() {
    if (animationFrameId) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // still rotate but at lower speed? we respect reduce: just skip animation
      return;
    }
    function animate() {
      if (!isPlaying) {
        animationFrameId = null;
        return;
      }
      rotationAngle += 0.3; // smooth speed
      vinylRecord.style.transform = `rotate(${rotationAngle}deg)`;
      animationFrameId = requestAnimationFrame(animate);
    }
    animationFrameId = requestAnimationFrame(animate);
  }

  function stopVinylAnimation() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  /* ============================================================
     PROGRESS
     ============================================================ */
  function updateProgress() {
    if (isDraggingProgress) return;
    if (!audio.duration || isNaN(audio.duration)) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = `${Math.min(pct, 100)}%`;
    progressHandle.style.left = `${Math.min(pct, 100)}%`;
    timeCurrent.textContent = formatTime(audio.currentTime);
    // Update aria value
    progressTrack.setAttribute('aria-valuenow', Math.round(pct));
  }

  function seekTo(clientX) {
    const rect = progressTrack.getBoundingClientRect();
    let x = (clientX - rect.left) / rect.width;
    x = Math.min(Math.max(x, 0), 1);
    if (audio.duration && !isNaN(audio.duration)) {
      const newTime = x * audio.duration;
      audio.currentTime = newTime;
      progressFill.style.width = `${x * 100}%`;
      progressHandle.style.left = `${x * 100}%`;
      timeCurrent.textContent = formatTime(newTime);
      progressTrack.setAttribute('aria-valuenow', Math.round(x * 100));
    }
  }

  /* ============================================================
     EVENT BINDING
     ============================================================ */
  // Play button
  playBtn.addEventListener('click', togglePlay);

  // Prev / Next
  prevBtn.addEventListener('click', () => {
    const prev = (currentTrackIndex - 1 + songs.length) % songs.length;
    loadTrack(prev);
  });
  nextBtn.addEventListener('click', () => {
    const next = (currentTrackIndex + 1) % songs.length;
    loadTrack(next);
  });

  // Audio events
  audio.addEventListener('timeupdate', updateProgress);

  audio.addEventListener('ended', () => {
    isPlaying = false;
    stopVinylAnimation();
    updatePlayButton();
    // Optionally go to next track? we don't autoplay next, just stop.
    progressFill.style.width = '0%';
    progressHandle.style.left = '0%';
    timeCurrent.textContent = '0:00';
    audio.currentTime = 0;
  });

  audio.addEventListener('loadedmetadata', () => {
    timeDuration.textContent = formatTime(audio.duration);
    if (audio.currentTime === 0) {
      timeCurrent.textContent = '0:00';
      progressFill.style.width = '0%';
      progressHandle.style.left = '0%';
    }
  });

  audio.addEventListener('error', (e) => {
    console.warn('Audio error:', e);
    // subtle message in console only
  });

  // Progress drag
  progressTrack.addEventListener('mousedown', (e) => {
    isDraggingProgress = true;
    progressHandle.classList.add('active');
    seekTo(e.clientX);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    e.preventDefault();
  });

  progressTrack.addEventListener('touchstart', (e) => {
    isDraggingProgress = true;
    progressHandle.classList.add('active');
    const touch = e.touches[0];
    seekTo(touch.clientX);
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd);
    e.preventDefault();
  });

  function onMouseMove(e) {
    seekTo(e.clientX);
  }
  function onMouseUp() {
    isDraggingProgress = false;
    progressHandle.classList.remove('active');
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }
  function onTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    seekTo(touch.clientX);
  }
  function onTouchEnd() {
    isDraggingProgress = false;
    progressHandle.classList.remove('active');
    document.removeEventListener('touchmove', onTouchMove);
    document.removeEventListener('touchend', onTouchEnd);
  }

  // Library toggle
  libraryHeader.addEventListener('click', () => toggleLibrary());
  libraryHeader.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleLibrary();
    }
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {

        // Ignore if focus inside input/textarea/select/contenteditable
    const tag = e.target.tagName.toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable) {
      return;
    }

    switch (e.key) {
      case ' ':
        e.preventDefault();
        togglePlay();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (audio.duration && !isNaN(audio.duration)) {
          const newTime = Math.max(0, audio.currentTime - 5);
          audio.currentTime = newTime;
          updateProgress();
        }
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (audio.duration && !isNaN(audio.duration)) {
          const newTime = Math.min(audio.duration, audio.currentTime + 5);
          audio.currentTime = newTime;
          updateProgress();
        }
        break;
    }
  });

  /* ============================================================
     REDUCED MOTION
     ============================================================ */
  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  function handleReduceMotionChange() {
    if (reduceMotionQuery.matches) {
      // Stop animation if playing
      if (isPlaying) {
        stopVinylAnimation();
      }
    } else {
      // Restart animation if playing
      if (isPlaying && !animationFrameId) {
        startVinylAnimation();
      }
    }
  }
  reduceMotionQuery.addEventListener('change', handleReduceMotionChange);

  /* ============================================================
     INIT
     ============================================================ */
  function init() {
    // Load first track
    if (songs.length > 0) {
      loadTrack(0);
      // Ensure label renders
      renderLabel(songs[0]);
      renderSections(songs[0]);
    }
    renderLibrary();
    updatePlayButton();

    // Set initial progress bar state
    progressFill.style.width = '0%';
    progressHandle.style.left = '0%';
    timeCurrent.textContent = '0:00';
    timeDuration.textContent = '0:00';

    // Ensure audio metadata loads
    audio.addEventListener('loadedmetadata', () => {
      timeDuration.textContent = formatTime(audio.duration);
    });

    // Handle case where audio loads but duration isn't ready
    if (audio.readyState >= 1) {
      timeDuration.textContent = formatTime(audio.duration);
    }

    // Set initial vinyl rotation
    vinylRecord.style.transform = `rotate(0deg)`;

    console.log('🎵 ARIA player initialized.');
    console.log(`📀 ${songs.length} song(s) loaded.`);
    console.log('ℹ️  Replace your-song.mp3 with your actual recording.');
  }

  // DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ============================================================
     EXPOSE API (optional, for debugging)
     ============================================================ */
  window.__aria = {
    songs,
    currentTrackIndex: () => currentTrackIndex,
    isPlaying: () => isPlaying,
    loadTrack,
    togglePlay,
    play: playAudio,
    pause: pauseAudio,
    next: () => {
      const next = (currentTrackIndex + 1) % songs.length;
      loadTrack(next);
    },
    prev: () => {
      const prev = (currentTrackIndex - 1 + songs.length) % songs.length;
      loadTrack(prev);
    },
    toggleLibrary
  };

})();
