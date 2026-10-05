(() => {
  let apiPromise;
  let cleanup = () => {};
  let mounted;
  const time = ms => {
    const seconds = Math.max(0, Math.floor((Number(ms) || 0) / 1000));
    return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  };
  function loadAPI() {
    if (window.SC?.Widget) return Promise.resolve(window.SC.Widget);
    if (!apiPromise) apiPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://w.soundcloud.com/player/api.js';
      script.onload = () => window.SC?.Widget ? resolve(window.SC.Widget) : reject(new Error('API unavailable'));
      script.onerror = reject;
      document.head.append(script);
    }).catch(error => { apiPromise = null; throw error; });
    return apiPromise;
  }
  async function mount(root) {
    const custom = root.querySelector('.cp-player');
    const frame = root.querySelector('iframe');
    const play = root.querySelector('.cp-play');
    const mute = root.querySelector('.cp-mute');
    const seek = root.querySelector('.cp-seek');
    const clock = root.querySelector('.cp-time');
    const status = root.querySelector('.cp-status');
    const list = root.querySelector('.cp-tracks');
    let widget, alive = true, ready = false, duration = 0, playing = false, muted = false, retry, reads = 0, resolving = false, failed = false;
    const resolvers = new Set();
    const events = [];
    // Keep the full-size native playlist rendered so SoundCloud can hydrate all tracks.
    root.classList.add('cp-enhancing');
    custom.hidden = false;
    frame.tabIndex = -1;
    frame.setAttribute('aria-hidden', 'true');
    const fallback = () => {
      if (!alive) return;
      failed = true;
      clearTimeout(retry);
      root.classList.remove('cp-enhancing');
      custom.hidden = true;
      frame.removeAttribute('tabindex');
      frame.removeAttribute('aria-hidden');
    };
    const timeout = setTimeout(fallback, 20000);
    cleanup = () => {
      if (!alive) return;
      alive = false;
      clearTimeout(timeout); clearTimeout(retry);
      resolvers.forEach(frame => frame.remove());
      if (widget && frame.isConnected && frame.contentWindow) {
        widget.pause();
        events.forEach(event => widget.unbind(event));
      }
    };
    try {
      const Widget = await loadAPI();
      if (!alive) return;
      widget = Widget(frame);
      const on = (event, fn) => { events.push(event); widget.bind(event, fn); };
      const setPlaying = value => {
        playing = value;
        play.setAttribute('aria-label', value ? 'Pause' : 'Play');
        play.querySelector('span').textContent = value ? 'pause' : 'play_arrow';
      };
      const updatePosition = position => {
        if (document.activeElement !== seek) seek.value = duration ? Math.round(position / duration * 1000) : 0;
        clock.textContent = `${time(position)} / ${time(duration)}`;
        seek.setAttribute('aria-valuetext', `${time(position)} of ${time(duration)}`);
      };
      const updateTrack = () => {
        widget.getCurrentSoundIndex(index => {
          if (!alive) return;
          [...list.querySelectorAll('button')].forEach((button, i) => button.setAttribute('aria-current', String(i === index)));
        });
        widget.getDuration(value => { if (alive) { duration = value; widget.getPosition(updatePosition); } });
      };
      function resolveSound(sound) {
        if (sound.title && Number.isFinite(sound.duration)) return Promise.resolve(sound);
        const url = sound.permalink_url || sound.uri || (sound.id ? `https://api.soundcloud.com/tracks/${sound.id}` : null);
        if (!url) return Promise.reject(new Error('Missing track identity'));
        return new Promise((resolve, reject) => {
          const probe = document.createElement('iframe');
          probe.className = 'cp-metadata-probe';
          probe.tabIndex = -1; probe.setAttribute('aria-hidden', 'true');
          probe.src = `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&auto_play=false`;
          root.append(probe); resolvers.add(probe);
          const reader = Widget(probe);
          const finish = (result, error) => {
            clearTimeout(limit); reader.unbind(Widget.Events.READY); probe.remove(); resolvers.delete(probe);
            if (error) reject(error); else resolve(result);
          };
          const limit = setTimeout(() => finish(null, new Error('Track metadata timed out')), 10000);
          reader.bind(Widget.Events.READY, () => reader.getCurrentSound(full => {
            if (full?.title && Number.isFinite(full.duration)) finish({...sound, ...full});
            else finish(null, new Error('Incomplete metadata'));
          }));
        });
      }
      function readTracks() {
        if (!alive || ready || failed || resolving) return;
        clearTimeout(retry);
        widget.getSounds(async sounds => {
          if (!alive || ready || failed || resolving) return;
          // READY may precede full metadata. Never substitute invented track names.
          if (!Array.isArray(sounds) || !sounds.length || sounds.some(sound => !sound.title || !Number.isFinite(sound.duration))) {
            if (++reads < 6 || !Array.isArray(sounds) || !sounds.length) {
              retry = setTimeout(readTracks, 500);
              return;
            }
            resolving = true;
            try { sounds = await Promise.all(sounds.map(resolveSound)); }
            catch { fallback(); return; }
          }
          if (!alive || ready || failed) return;
          ready = true;
          clearTimeout(timeout);
          sounds.forEach((sound, index) => {
            const li = document.createElement('li');
            const button = document.createElement('button');
            button.type = 'button';
            button.setAttribute('aria-current', String(index === 0));
            button.setAttribute('aria-label', `Play ${sound.title}`);
            const number = document.createElement('span'); number.className = 'cp-number'; number.textContent = String(index + 1).padStart(2, '0');
            const title = document.createElement('span'); title.className = 'cp-title'; title.textContent = sound.title;
            const length = document.createElement('span'); length.className = 'cp-duration'; length.textContent = time(sound.duration);
            button.append(number, title, length);
            button.addEventListener('click', () => { widget.skip(index); widget.play(); });
            li.append(button); list.append(li);
          });
          status.hidden = true;
          play.disabled = mute.disabled = seek.disabled = false;
          duration = sounds[0].duration;
          updatePosition(0);
          updateTrack();
        });
      }
      on(Widget.Events.READY, readTracks);
      // The iframe can already be ready when the API script finishes loading.
      readTracks();
      on(Widget.Events.PLAY, () => { if (alive) { setPlaying(true); updateTrack(); } });
      on(Widget.Events.PAUSE, () => { if (alive) setPlaying(false); });
      on(Widget.Events.FINISH, () => { if (alive) { setPlaying(false); updateTrack(); } });
      on(Widget.Events.PLAY_PROGRESS, event => { if (alive) updatePosition(event.currentPosition); });
      on(Widget.Events.SEEK, event => { if (alive) updatePosition(event.currentPosition); });
      on(Widget.Events.ERROR, fallback);
      play.addEventListener('click', () => { if (playing) widget.pause(); else widget.play(); });
      mute.addEventListener('click', () => {
        muted = !muted; widget.setVolume(muted ? 0 : 100);
        mute.setAttribute('aria-pressed', String(muted));
        mute.setAttribute('aria-label', muted ? 'Unmute' : 'Mute');
        mute.querySelector('span').textContent = muted ? 'volume_off' : 'volume_up';
      });
      seek.addEventListener('input', () => { clock.textContent = `${time(Number(seek.value) / 1000 * duration)} / ${time(duration)}`; });
      seek.addEventListener('change', () => widget.seekTo(Number(seek.value) / 1000 * duration));
    } catch { fallback(); }
  }
  function sync() {
    const root = document.querySelector('#viewer').open ? document.querySelector('[data-colorado-player]') : null;
    if (root === mounted) return;
    cleanup(); mounted = root;
    if (root) mount(root);
  }
  new MutationObserver(sync).observe(document.querySelector('#viewer-story'), {childList: true});
  // Pause if the dialog closes even when its content is retained by the router.
  document.querySelector('#viewer').addEventListener('close', () => {
    if (!document.querySelector('#viewer').open) { cleanup(); mounted = null; }
  });
  window.addEventListener('hashchange', sync);
  sync();
})();
