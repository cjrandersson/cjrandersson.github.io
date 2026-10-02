(() => {
  const SOUNDTRACK_TITLE = 'Colorado Plateau';
  const PLAYLIST_URL = 'https://soundcloud.com/dr-boland/sets/colorado-plateau-original-soundtrack';
  const PLAYER_SRC = `https://w.soundcloud.com/player/?url=${encodeURIComponent(PLAYLIST_URL)}&color=%230a0a0a&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&show_artwork=false&show_playcount=false&sharing=false&download=false&buying=false&visual=false`;
  let apiLoading = false;
  let apiReady = false;

  function loadWidgetApi(callback) {
    if (window.SC?.Widget) {
      apiReady = true;
      callback();
      return;
    }

    if (apiLoading) {
      window.addEventListener('soundcloud-api-ready', callback, { once: true });
      return;
    }

    apiLoading = true;
    const script = document.createElement('script');
    script.src = 'https://w.soundcloud.com/player/api.js';
    script.async = true;
    script.onload = () => {
      apiReady = true;
      window.dispatchEvent(new Event('soundcloud-api-ready'));
      callback();
    };
    document.head.appendChild(script);
  }

  function setActiveTrack(list, index) {
    list.querySelectorAll('button[data-track-index]').forEach(button => {
      button.setAttribute('aria-current', Number(button.dataset.trackIndex) === index ? 'true' : 'false');
    });
  }

  function buildTracklist(section, widget) {
    const media = section.querySelector('.project-story-media--soundcloud');
    if (!media || media.querySelector('.colorado-tracklist')) return;

    widget.getSounds(sounds => {
      if (!Array.isArray(sounds) || !sounds.length) return;

      const list = document.createElement('ol');
      list.className = 'colorado-tracklist';
      list.setAttribute('aria-label', 'Colorado Plateau soundtrack tracks');

      sounds.forEach((sound, index) => {
        const item = document.createElement('li');
        const button = document.createElement('button');
        button.type = 'button';
        button.dataset.trackIndex = String(index);
        button.setAttribute('aria-current', 'false');

        const number = document.createElement('span');
        number.className = 'colorado-track-number';
        number.textContent = String(index + 1).padStart(2, '0');

        const title = document.createElement('span');
        title.className = 'colorado-track-title';
        title.textContent = sound.title || `Track ${index + 1}`;

        button.append(number, title);
        button.addEventListener('click', () => {
          widget.skip(index);
          widget.play();
          setActiveTrack(list, index);
        });

        item.appendChild(button);
        list.appendChild(item);
      });

      media.appendChild(list);

      widget.bind(window.SC.Widget.Events.PLAY, () => {
        widget.getCurrentSoundIndex(index => setActiveTrack(list, index));
      });
    });
  }

  function enhanceColoradoSection() {
    const sections = [...document.querySelectorAll('#viewer-story .project-story-section')];
    const section = sections.find(candidate => candidate.querySelector('h3')?.textContent.trim() === SOUNDTRACK_TITLE);
    if (!section || section.dataset.coloradoEnhanced === 'true') return;

    const iframe = section.querySelector('.soundcloud-player-wrapper iframe');
    const copy = section.querySelector('.project-story-copy');
    if (!iframe || !copy) return;

    section.dataset.coloradoEnhanced = 'true';
    section.classList.add('colorado-soundtrack-section');

    const eyebrow = copy.querySelector('.project-eyebrow');
    const body = copy.querySelector('p:not(.project-eyebrow)');
    if (eyebrow) eyebrow.textContent = 'Original motion picture soundtrack';
    if (body) {
      body.textContent = 'Colorado Plateau (Original Motion Picture Soundtrack) is the film score composed by Carl Johan Robin Andersson for a fictive arthouse / psychological thriller.';
    }

    iframe.src = PLAYER_SRC;
    iframe.height = '166';
    iframe.title = 'Colorado Plateau original motion picture soundtrack';

    loadWidgetApi(() => {
      if (!apiReady || !window.SC?.Widget) return;
      const widget = window.SC.Widget(iframe);
      widget.bind(window.SC.Widget.Events.READY, () => buildTracklist(section, widget));
    });
  }

  const observer = new MutationObserver(enhanceColoradoSection);
  const viewerStory = document.querySelector('#viewer-story');
  if (viewerStory) observer.observe(viewerStory, { childList: true, subtree: true });

  window.addEventListener('hashchange', () => window.setTimeout(enhanceColoradoSection, 0));
  window.addEventListener('DOMContentLoaded', enhanceColoradoSection, { once: true });
  enhanceColoradoSection();
})();
