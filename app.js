const projects = window.PROJECTS;
const gallery = document.querySelector('#gallery');
const count = document.querySelector('#count');
const viewer = document.querySelector('#viewer');
let visibleProjects = projects;
let activeIndex = 0;

const projectGroups = window.PROJECT_GROUPS || [];

function introMarkup(project) {
  if (!project.intro) return '';
  const intro = project.intro;
  const introMark = project.slug === 'flode'
    ? '<svg class="project-intro-mark" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#e3e3e3" aria-hidden="true"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M2 22h20V2L2 22z"/></svg>'
    : '';
  return `<section class="project-intro">
    <p class="project-intro-lead"><strong>${introMark}<span>${intro.name}</span></strong> ${intro.lead}</p>
    <h2>${intro.question}${intro.bridge ? `<br>${intro.bridge}` : ''}</h2>
    <ul>${intro.between.map(item => `<li>${item}</li>`).join('')}</ul>
    <p class="project-intro-body">${intro.body}</p>
  </section>`;
}

function definitionsMarkup(project) {
  if (!project.definitions) return '';
  return `<section class="project-definitions">
    <h3>The many definitions</h3>
    <ul>${project.definitions.map(item => `<li>${item}</li>`).join('')}</ul>
    <p>${project.definitionClosing || ''}</p>
  </section>`;
}

function podNoteMarkup(project) {
  if (project.slug !== 'flode') return '';
  return `<section class="project-pod-note">
    <span class="material-icons-outlined" aria-hidden="true">u_turn_right</span>
    <div>
      <p class="project-pod-note-lead">The example below is a closer look at POD A — one of the six PODs in flow~</p>
      <p class="project-pod-note-body">With all the adjustable parameters, modes, effects and total control of modulation and playback, you get endless possibilities of combinations</p>
    </div>
  </section>`;
}

function seriesImageMarkup(project, src, index) {
  const image = `<img src="${src}" alt="${project.alt || project.title} — view ${index + 1}" loading="${index === 0 ? 'eager' : 'lazy'}" decoding="async">`;
  if (project.slug === 'flode' && index === 2) {
    return `<div class="project-image-frame flode-logo-size-match">
      ${image}
      <div class="flode-image-header" aria-hidden="true">
        <strong>flöde~</strong>
        <span>SIX-CHANNEL SAMPLER&nbsp; • &nbsp;GENERATIVE SEQUENCER&nbsp; • &nbsp;LOOPER&nbsp; • &nbsp;AUDIO MANGLER</span>
      </div>
    </div>`;
  }
  return image;
}

function artMarkup(project, large = false) {
  if (project.thumbnail || project.media) {
    if (large && Array.isArray(project.media)) {
      return `<div class="project-series">${introMarkup(project)}${project.media.map((src, index) => `${index === 1 ? podNoteMarkup(project) : ''}${seriesImageMarkup(project, src, index)}${index === 0 ? definitionsMarkup(project) : ''}`).join('')}</div>`;
    }
    const mediaSource = Array.isArray(project.media) ? project.media[0] : project.media;
    const src = large ? (mediaSource || project.thumbnail) : (project.thumbnail || mediaSource);
    return `<img src="${src}" alt="${project.alt || project.title}" loading="${large ? 'eager' : 'lazy'}" decoding="async">`;
  }
  return `<div class="placeholder ${project.art}" role="img" aria-label="Replaceable placeholder study for ${project.title}"><span>PLACEHOLDER STUDY</span></div>`;
}

function renderGallery() {
  visibleProjects = projects;
  gallery.innerHTML = projectGroups.map(group => {
    const groupProjects = group.slugs.map(slug => projects.find(project => project.slug === slug)).filter(Boolean);
    const layout = group.layout || 'editorial';
    const columns = Math.max(1, Number(group.columns) || 3);
    const gap = group.gap || 'var(--gap)';
    return `<section class="project-group layout-${layout}" aria-labelledby="group-${group.id}" style="--group-columns:${columns};--group-gap:${gap}">
      <header class="project-group-header">
        <h2 id="group-${group.id}">
          <button class="project-group-toggle" type="button" aria-expanded="true" aria-controls="group-panel-${group.id}">
            <span class="project-group-title">${group.label}</span>
            ${group.note ? `<span class="project-group-note">${group.note}</span>` : '<span class="project-group-spacer" aria-hidden="true"></span>'}
            <span class="project-group-count">${groupProjects.length.toString().padStart(2,'0')}</span>
            <span class="material-symbols-outlined project-group-chevron" aria-hidden="true">expand_more</span>
          </button>
        </h2>
      </header>
      <div class="project-group-grid" id="group-panel-${group.id}">
        ${groupProjects.map(project => {
          const index = visibleProjects.indexOf(project);
          return `<article class="project size-${project.size}" style="--ratio:${project.aspectRatio}">
            <button class="project-open" data-index="${index}" aria-label="Open ${project.title}">
              <div class="media">${artMarkup(project)}${project.mediaType === 'video' ? '<span class="play" aria-hidden="true">Play</span>' : ''}</div>
            </button>
          </article>`;
        }).join('')}
      </div>
    </section>`;
  }).join('');
  count.textContent = `${visibleProjects.length} works`;
}

function showProject(index) {
  activeIndex = (index + visibleProjects.length) % visibleProjects.length;
  const project = visibleProjects[activeIndex];
  viewer.classList.toggle('series-mode', Array.isArray(project.media));
  document.querySelector('#viewer-art').innerHTML = artMarkup(project, true);
  document.querySelector('#viewer-art').style.aspectRatio = Array.isArray(project.media) ? 'auto' : project.aspectRatio;
  document.querySelector('#viewer-title').textContent = project.title;
  document.querySelector('#viewer-meta').textContent = project.meta || `${project.category} · ${project.year}`;
  const originalSource = Array.isArray(project.media) ? project.media[0] : (project.media || project.thumbnail);
  const originalLink = document.querySelector('#viewer-original');
  originalLink.hidden = !originalSource;
  if (originalSource) originalLink.href = originalSource;
  const details = project.details || {};
  document.querySelector('#viewer-what').textContent = details.what || project.description || '—';
  document.querySelector('#viewer-why').textContent = details.why || '—';
  document.querySelector('#viewer-thoughts').textContent = details.thoughts || '—';
  document.querySelector('#viewer-software').textContent = Array.isArray(details.software) && details.software.length ? details.software.join(' · ') : '—';
  if (!viewer.open) viewer.showModal();
}

gallery.addEventListener('click', event => {
  const groupToggle = event.target.closest('.project-group-toggle');
  if (groupToggle) {
    const panel = document.getElementById(groupToggle.getAttribute('aria-controls'));
    const willExpand = groupToggle.getAttribute('aria-expanded') !== 'true';
    groupToggle.setAttribute('aria-expanded', String(willExpand));
    panel.hidden = !willExpand;
    groupToggle.closest('.project-group').classList.toggle('is-collapsed', !willExpand);
    return;
  }
  const button = event.target.closest('.project-open');
  if (button) showProject(Number(button.dataset.index));
});
document.querySelector('.viewer-close').addEventListener('click', () => viewer.close());
document.querySelector('.viewer-prev').addEventListener('click', () => showProject(activeIndex - 1));
document.querySelector('.viewer-next').addEventListener('click', () => showProject(activeIndex + 1));
viewer.addEventListener('click', event => { if (event.target === viewer) viewer.close(); });
document.addEventListener('keydown', event => {
  if (!viewer.open) return;
  if (event.key === 'ArrowLeft') showProject(activeIndex - 1);
  if (event.key === 'ArrowRight') showProject(activeIndex + 1);
});
document.querySelector('#year').textContent = new Date().getFullYear();
renderGallery();

