const projects = window.PROJECTS || [];
const gallery = document.querySelector('#gallery');
const count = document.querySelector('#count');
const viewer = document.querySelector('#viewer');
const homePage = document.querySelector('#home-page');
const aboutPage = document.querySelector('#about-page');
const routeLinks = [...document.querySelectorAll('[data-route]')];

const visibleProjects = projects;

let activeIndex = 0;

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function mediaFor(project) {
  const source = project.media || project.thumbnail;
  return (Array.isArray(source) ? source : [source]).filter(Boolean);
}

function imageMarkup(project, src, index = 0, eager = false) {
  const suffix = mediaFor(project).length > 1 ? ` — view ${index + 1}` : '';
  return `<img src="${escapeHtml(src)}" alt="${escapeHtml(project.alt || project.title)}${suffix}" loading="${eager ? 'eager' : 'lazy'}" decoding="async">`;
}

function renderGallery() {
  gallery.innerHTML = visibleProjects.map((project, index) => {
    const cover = project.cover || {};
    const src = cover.src || project.thumbnail || mediaFor(project)[0];

    return `<article class="project project--${escapeHtml(project.slug)}">
      <a class="project-open" href="#project/${encodeURIComponent(project.slug)}" aria-labelledby="title-${escapeHtml(project.slug)}">
        <div class="project-cover">
          <img src="${escapeHtml(src)}" alt="${escapeHtml(cover.alt || project.alt || project.title)}" loading="${index === 0 ? 'eager' : 'lazy'}" decoding="async"${index === 0 ? ' fetchpriority="high"' : ''}>
        </div>
        <div class="project-card-copy">
          <p class="project-card-meta"><span>${String(index + 1).padStart(2, '0')}</span><span>${escapeHtml(cover.label || 'Software / Code')}</span></p>
          <h2 id="title-${escapeHtml(project.slug)}">${project.titleIcon ? `<img class="project-card-icon" src="${escapeHtml(project.titleIcon)}" alt="" aria-hidden="true">` : ''}<span>${escapeHtml(project.title)}</span></h2>
          <p class="project-card-summary">${escapeHtml(cover.summary || project.description || '')}</p>
          <span class="project-card-link">View project<span class="material-symbols-outlined" aria-hidden="true">arrow_outward</span></span>
        </div>
      </a>
    </article>`;
  }).join('');

  count.textContent = `${visibleProjects.length} projects`;
}

function introStoryMarkup(project, media) {
  const intro = project.intro;
  if (!intro) return '';

  const definitions = Array.isArray(project.definitions) ? project.definitions : [];
  const secondImage = media[1];
  const thirdImage = media[2];

  return `<section class="project-story-section">
    <div class="project-story-copy">
      <p class="project-eyebrow">In short</p>
      <h3>${escapeHtml(intro.question || project.title)}</h3>
      <p>${escapeHtml(intro.lead || '')}</p>
      <p>${escapeHtml(intro.body || '')}</p>
      ${Array.isArray(intro.between) ? `<ul>${intro.between.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>` : ''}
    </div>
    ${secondImage ? `<div class="project-story-media"><a href="${escapeHtml(secondImage)}" target="_blank" rel="noreferrer" aria-label="Open image in original resolution">${imageMarkup(project, secondImage, 1)}</a></div>` : ''}
  </section>
  ${definitions.length ? `<section class="project-story-section">
    <div class="project-story-copy">
      <p class="project-eyebrow">The many definitions</p>
      <h3>One system, many uses.</h3>
      <ul>${definitions.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
      ${project.definitionClosing ? `<p>${escapeHtml(project.definitionClosing)}</p>` : ''}
    </div>
    ${thirdImage ? `<div class="project-story-media"><a href="${escapeHtml(thirdImage)}" target="_blank" rel="noreferrer" aria-label="Open image in original resolution">${imageMarkup(project, thirdImage, 2)}</a></div>` : ''}
  </section>` : ''}`;
}

function structuredStoryMarkup(project) {
  return project.storySections.map(section => {
    const cropClass = section.mediaCrop
      ? ` project-story-media--crop crop-${escapeHtml(section.mediaCrop)}`
      : '';

    return `<section class="project-story-section">
      <div class="project-story-copy">
        <p class="project-eyebrow">${escapeHtml(section.eyebrow || '')}</p>
        <h3>${escapeHtml(section.title || '')}</h3>
        <p>${escapeHtml(section.body || '')}</p>
        ${Array.isArray(section.bullets) && section.bullets.length ? `<ul>${section.bullets.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>` : ''}
      </div>
      ${section.media ? `<div class="project-story-media${cropClass}"><a href="${escapeHtml(section.media)}" target="_blank" rel="noreferrer" aria-label="Open image in original resolution">${imageMarkup(project, section.media)}</a></div>` : ''}
    </section>`;
  }).join('');
}

function flodeStoryMarkup(project) {
  const light = 'media/flode/flode-interface-light-six-pod.png?v=20260919-light-theme-story';
  const pod = 'media/flode/flode-pod-design.png?v=20260919-pod-story';
  const jungulator = 'media/flode/flode-interface-jungulator-detail.png?v=20260919-jungulator-story';
  const hardware = 'media/flode/flode-hardware-render.png?v=20260919-hardware-story';

  return `<section class="flode-theme-feature">
    <div class="flode-theme-visual">
      <a href="${light}" target="_blank" rel="noreferrer" aria-label="Open the flöde light interface in original resolution">
        <img src="${light}" alt="flöde~ light theme six-pod sampler interface" loading="lazy" decoding="async">
      </a>
    </div>
    <div class="flode-theme-copy">
      <div class="flode-theme-heading">
        <p class="project-eyebrow">Theme system / Light mode</p>
        <h3>Hardware memory, software freedom.</h3>
      </div>
      <div class="flode-theme-body">
        <p>The light palette deliberately steps away from the familiar all-black language of contemporary music software. Its visual temperature comes from samplers, drum machines, sequencers and studio workstations of the late 1980s and 1990s: warm grey and off-white control surfaces, dark display wells, direct labelling, strong orange accents and small flashes of colour used to separate functions.</p>
        <p>The intention is not retro imitation. Those machines often made complicated systems understandable by giving controls a strong physical hierarchy. flöde~ translates that logic into a screen-based instrument. The chassis stays calm, waveform areas become darker working zones, active states are unmistakable, and the six pods can still be scanned quickly when several samples are moving at the same time.</p>
        <p>The interface is designed as a true two-theme system. Light mode feels tactile, technical and object-like. Dark mode recedes into the room and is better suited to long sessions, low-light studios and live performance. The user should be able to switch between the two without relearning anything: geometry, spacing, control behaviour and semantic colour remain in exactly the same places.</p>
      </div>
    </div>
    <div class="flode-theme-notes" aria-label="flöde theme design principles">
      <div><span>Light palette</span><p>Warm neutral chassis, black waveform beds, orange focus states and restrained channel colours.</p></div>
      <div><span>Dark palette</span><p>Near-black surfaces, amber waveforms and reduced peripheral contrast for focus in darker environments.</p></div>
      <div><span>Shared language</span><p>The theme changes atmosphere, not operation. Labels, states, layout and hierarchy stay consistent.</p></div>
      <div><span>Signal before decoration</span><p>Colour is functional first: pod identity, active controls, meters and status. Important states never depend on colour alone.</p></div>
    </div>
    <div class="flode-palette" aria-label="Light theme colour palette">
      <span class="flode-swatch swatch-bone" title="Warm neutral"></span>
      <span class="flode-swatch swatch-charcoal" title="Charcoal"></span>
      <span class="flode-swatch swatch-orange" title="Orange"></span>
      <span class="flode-swatch swatch-red" title="Red"></span>
      <span class="flode-swatch swatch-violet" title="Violet"></span>
      <span class="flode-swatch swatch-cyan" title="Cyan"></span>
      <span class="flode-swatch swatch-blue" title="Blue"></span>
      <span class="flode-swatch swatch-yellow" title="Yellow"></span>
    </div>
  </section>

  <section class="project-story-section flode-pod-story">
    <div class="project-story-copy">
      <p class="project-eyebrow">Pod architecture</p>
      <h3>One pod is the instrument in miniature.</h3>
      <p>Each pod is deliberately treated as more than a mixer channel. It is a small sampler with its own waveform, slice behaviour, speed, probability, jitter, level, panning and routing. That makes the six-pod system modular rather than monolithic: one pod can behave predictably while another is being pushed into unstable, generative territory.</p>
      <p>The close view also matters from a UX perspective. The controls are grouped around the question the musician is asking in that moment: what part of the sound is playing, how tightly should it follow the clock, and how far should the machine be allowed to wander?</p>
      <ul>
        <li>Waveform and slicing stay visually dominant.</li>
        <li>Randomness is exposed as a playable parameter, not a hidden algorithm.</li>
        <li>Performance controls remain reachable without opening nested windows.</li>
        <li>Every pod can be understood alone, then combined into a six-part instrument.</li>
      </ul>
    </div>
    <div class="project-story-media"><a href="${pod}" target="_blank" rel="noreferrer" aria-label="Open flöde pod design in original resolution"><img src="${pod}" alt="Close view of an individual flöde~ sampler pod" loading="lazy" decoding="async"></a></div>
  </section>

  <section class="project-story-section flode-jungulator-story">
    <div class="project-story-copy">
      <p class="project-eyebrow">Jungulator DNA</p>
      <h3>Chaos, but with a pulse.</h3>
      <p>A central part of flöde~ comes from the character of the old Max/MSP patch I Am The Mighty Jungulator. Its appeal was never simply that it could glitch a sample. It could slice, repeat, jump and destabilise audio while still feeling tied to the rhythm around it.</p>
      <p>That idea becomes the behavioural core here. Randomness is bounded by tempo, slicing logic, probability and user-defined ranges, so the instrument can surprise the player without becoming disconnected from the performance.</p>
      <ul>
        <li>Controlled randomness rather than arbitrary shuffle.</li>
        <li>Tempo-aware slicing keeps accidents musically useful.</li>
        <li>Transient detection gives the system material to react to.</li>
        <li>The user sets the boundaries; the instrument explores inside them.</li>
      </ul>
    </div>
    <div class="project-story-media"><a href="${jungulator}" target="_blank" rel="noreferrer" aria-label="Open Jungulator-inspired flöde interface in original resolution"><img src="${jungulator}" alt="flöde~ Jungulator-inspired generative control interface" loading="lazy" decoding="async"></a></div>
  </section>

  <section class="project-story-section flode-hardware-story">
    <div class="project-story-copy">
      <p class="project-eyebrow">Physical direction</p>
      <h3>Designed to feel like an instrument, not a settings panel.</h3>
      <p>The same hierarchy is explored as a physical workstation: six recognisable sound lanes, immediate performance controls and a master layer that binds everything to one clock. Thinking about flöde~ as hardware is useful even when it runs entirely in software, because it forces every control to justify its place.</p>
      <p>The long-term visual goal is a system that can move between Max/MSP, Max for Live, standalone software and a possible dedicated controller without changing its underlying grammar.</p>
    </div>
    <div class="project-story-media"><a href="${hardware}" target="_blank" rel="noreferrer" aria-label="Open flöde hardware concept in original resolution"><img src="${hardware}" alt="flöde~ physical sampler workstation concept" loading="lazy" decoding="async"></a></div>
  </section>`;
}

function seriesStoryMarkup(project, media) {
  if (project.slug === 'flode') {
    return flodeStoryMarkup(project);
  }

  if (Array.isArray(project.storySections) && project.storySections.length) {
    return structuredStoryMarkup(project);
  }

  if (project.intro) {
    const remaining = media.slice(3);
    return `${introStoryMarkup(project, media)}${remaining.length ? `<div class="project-media-wall">${remaining.map((src, index) => `<a href="${escapeHtml(src)}" target="_blank" rel="noreferrer" aria-label="Open image in original resolution">${imageMarkup(project, src, index + 3)}</a>`).join('')}</div>` : ''}`;
  }

  if (media.length <= 1) return '';

  return `<div class="project-media-wall">${media.slice(1).map((src, index) => `<a href="${escapeHtml(src)}" target="_blank" rel="noreferrer" aria-label="Open image in original resolution">${imageMarkup(project, src, index + 1)}</a>`).join('')}</div>`;
}

function renderProject(project) {
  const details = project.details || {};
  const media = mediaFor(project);
  const original = media[0];

  document.querySelector('#viewer-page').classList.toggle('long-title', project.title.length > 17);

  document.querySelector('#viewer-category').textContent = `${project.cover?.label || 'Software / Code'} · ${project.year || ''}`;
  const viewerTitle = document.querySelector('#viewer-title');
  viewerTitle.classList.toggle('has-project-icon', Boolean(project.titleIcon));
  viewerTitle.innerHTML = project.titleIcon
    ? `<img class="project-title-icon" src="${escapeHtml(project.titleIcon)}" alt="" aria-hidden="true"><span>${escapeHtml(project.title)}</span>`
    : escapeHtml(project.title);
  document.querySelector('#viewer-marquee').textContent = `${project.title}  ${project.title}  ${project.title}`;
  document.querySelector('#viewer-summary').textContent = project.description || details.what || '';
  document.querySelector('#viewer-what').textContent = details.what || project.description || '—';
  document.querySelector('#viewer-why').textContent = details.why || '—';
  document.querySelector('#viewer-thoughts').textContent = details.thoughts || '—';
  document.querySelector('#viewer-software').textContent = Array.isArray(details.software) && details.software.length
    ? details.software.join(' · ')
    : '—';
  document.querySelector('#viewer-position').textContent = String(activeIndex + 1).padStart(2, '0');
  document.querySelector('#viewer-total').textContent = String(visibleProjects.length).padStart(2, '0');

  const originalLink = document.querySelector('#viewer-original');
  originalLink.hidden = !original;
  if (original) originalLink.href = original;

  document.querySelector('#viewer-hero-media').innerHTML = original
    ? `<a href="${escapeHtml(original)}" target="_blank" rel="noreferrer" aria-label="Open image in original resolution">${imageMarkup(project, original, 0, true)}</a>`
    : '';
  document.querySelector('#viewer-story').innerHTML = seriesStoryMarkup(project, media);

  if (!viewer.open) viewer.showModal();
  viewer.scrollTop = 0;
  document.body.classList.add('viewer-open');
}

function openProject(slug) {
  const index = visibleProjects.findIndex(project => project.slug === slug);
  if (index < 0) {
    closeProject();
    window.history.replaceState(null, '', '#work');
    scrollToRoute('#work');
    return;
  }
  activeIndex = index;
  renderProject(visibleProjects[activeIndex]);
}

function closeProject() {
  if (viewer.open) viewer.close();
  document.body.classList.remove('viewer-open');
}

function showPage(page, activeRoute = page) {
  const showAbout = page === 'about';
  homePage.hidden = showAbout;
  aboutPage.hidden = !showAbout;

  routeLinks.forEach(link => {
    if (link.dataset.route === activeRoute) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

function scrollToRoute(hash) {
  window.setTimeout(() => {
    const target = hash === '#work'
      ? document.querySelector('#work')
      : hash === '#contact'
        ? document.querySelector('#contact')
        : null;
    if (target) window.scrollTo({ top: target.offsetTop, left: 0, behavior: 'auto' });
    else window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, 40);
}

function syncFromHash() {
  const hash = window.location.hash || '#home';
  const match = hash.match(/^#project\/(.+)$/);
  if (match) {
    showPage('home', 'work');
    openProject(decodeURIComponent(match[1]));
  } else if (hash === '#about') {
    closeProject();
    showPage('about', 'about');
    scrollToRoute('#about');
  } else {
    closeProject();
    showPage('home', hash === '#contact' ? 'contact' : 'work');
    scrollToRoute(hash);
  }
}

function navigateProject(offset) {
  const nextIndex = (activeIndex + offset + visibleProjects.length) % visibleProjects.length;
  window.location.hash = `project/${encodeURIComponent(visibleProjects[nextIndex].slug)}`;
}

function installFlodeStoryStyles() {
  if (document.querySelector('#flode-story-styles')) return;
  const style = document.createElement('style');
  style.id = 'flode-story-styles';
  style.textContent = `
    .flode-theme-feature {
      display: block;
      padding: clamp(56px, 7vw, 96px) 0 clamp(100px, 12vw, 170px);
      border-top: 1px solid var(--line);
    }
    .flode-theme-visual {
      width: 100%;
      margin-bottom: clamp(52px, 7vw, 92px);
    }
    .flode-theme-visual a { display: block; }
    .flode-theme-visual img {
      width: 100%;
      height: auto;
      display: block;
      background: #d4d4d2;
    }
    .flode-theme-copy {
      display: grid;
      grid-template-columns: minmax(240px, .78fr) minmax(0, 1.22fr);
      gap: clamp(42px, 8vw, 130px);
      align-items: start;
    }
    .flode-theme-heading h3 {
      margin: 0;
      font-size: clamp(42px, 5.8vw, 82px);
      font-weight: 430;
      line-height: .94;
      letter-spacing: -.055em;
    }
    .flode-theme-body {
      max-width: 610px;
      justify-self: end;
    }
    .flode-theme-body p {
      margin: 0 0 22px;
      color: var(--muted);
      font-size: clamp(15px, 1.35vw, 18px);
      line-height: 1.65;
    }
    .flode-theme-notes {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 0;
      margin-top: clamp(48px, 6vw, 78px);
      border-top: 1px solid var(--line);
      border-bottom: 1px solid var(--line);
    }
    .flode-theme-notes > div {
      min-height: 170px;
      padding: 20px 22px 24px 0;
      border-right: 1px solid var(--line);
    }
    .flode-theme-notes > div:not(:first-child) { padding-left: 22px; }
    .flode-theme-notes > div:last-child { border-right: 0; }
    .flode-theme-notes span {
      display: block;
      margin-bottom: 22px;
      color: var(--ink);
      font-size: 10px;
      font-weight: 600;
      letter-spacing: .11em;
      text-transform: uppercase;
    }
    .flode-theme-notes p {
      max-width: 25ch;
      margin: 0;
      color: var(--muted);
      font-size: 13px;
      line-height: 1.5;
    }
    .flode-palette {
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      height: 12px;
      margin-top: 24px;
      overflow: hidden;
    }
    .flode-swatch { display: block; }
    .swatch-bone { background: #d6d6d2; }
    .swatch-charcoal { background: #242526; }
    .swatch-orange { background: #f37b20; }
    .swatch-red { background: #ef4848; }
    .swatch-violet { background: #8b61d5; }
    .swatch-cyan { background: #3ac5cc; }
    .swatch-blue { background: #4b8fe8; }
    .swatch-yellow { background: #d8b642; }
    .flode-pod-story .project-story-media {
      width: min(100%, 470px);
      justify-self: center;
    }
    .flode-pod-story .project-story-media img {
      max-height: 720px;
      object-fit: contain;
      background: transparent;
    }
    @media (max-width: 820px) {
      .flode-theme-copy { grid-template-columns: 1fr; gap: 30px; }
      .flode-theme-body { max-width: 100%; justify-self: start; }
      .flode-theme-notes { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .flode-theme-notes > div:nth-child(2) { border-right: 0; }
      .flode-theme-notes > div:nth-child(-n+2) { border-bottom: 1px solid var(--line); }
    }
    @media (max-width: 520px) {
      .flode-theme-feature { padding-top: 34px; }
      .flode-theme-visual { margin-bottom: 42px; }
      .flode-theme-heading h3 { font-size: 46px; }
      .flode-theme-notes { grid-template-columns: 1fr; }
      .flode-theme-notes > div,
      .flode-theme-notes > div:not(:first-child) {
        min-height: 0;
        padding: 18px 0 22px;
        border-right: 0;
        border-bottom: 1px solid var(--line);
      }
      .flode-theme-notes > div:last-child { border-bottom: 0; }
      .flode-palette { height: 9px; }
    }
  `;
  document.head.appendChild(style);
}

document.querySelector('.viewer-close').addEventListener('click', () => {
  window.location.hash = 'work';
});
document.querySelector('.viewer-prev').addEventListener('click', () => navigateProject(-1));
document.querySelector('.viewer-next').addEventListener('click', () => navigateProject(1));
viewer.addEventListener('cancel', event => {
  event.preventDefault();
  window.location.hash = 'work';
});
viewer.addEventListener('close', () => document.body.classList.remove('viewer-open'));
window.addEventListener('hashchange', syncFromHash);
document.addEventListener('keydown', event => {
  if (!viewer.open) return;
  if (event.key === 'ArrowLeft') navigateProject(-1);
  if (event.key === 'ArrowRight') navigateProject(1);
});

document.querySelector('#year').textContent = new Date().getFullYear();
installFlodeStoryStyles();
renderGallery();
syncFromHash();
