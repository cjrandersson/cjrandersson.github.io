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

function seriesStoryMarkup(project, media) {
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
renderGallery();
syncFromHash();

