(() => {
  const viewerPage = document.querySelector('#viewer-page');
  if (!viewerPage) return;

  const coloradoPosterSrc = 'media/sound-design/colorado-plateau-poster.svg';

  const lightbox = document.createElement('dialog');
  lightbox.className = 'image-lightbox';
  lightbox.setAttribute('aria-label', 'Image preview');
  lightbox.innerHTML = `
    <div class="image-lightbox__panel">
      <button class="image-lightbox__close" type="button" aria-label="Close image preview">
        <span class="material-symbols-outlined" aria-hidden="true">close</span>
      </button>
      <img class="image-lightbox__image" alt="" decoding="async">
    </div>
  `;
  document.body.appendChild(lightbox);

  const previewImage = lightbox.querySelector('.image-lightbox__image');
  const closeButton = lightbox.querySelector('.image-lightbox__close');

  function addColoradoPlateauPoster() {
    const coloradoSection = [...viewerPage.querySelectorAll('.project-story-section')].find(section => {
      const eyebrow = section.querySelector('.project-eyebrow')?.textContent?.trim();
      const title = section.querySelector('h3')?.textContent?.trim();
      return eyebrow === 'Selected sound / 02' && title === 'Colorado Plateau';
    });

    if (!coloradoSection) return;

    const media = coloradoSection.querySelector('.project-story-media--audio');
    if (!media || media.querySelector(`img[src="${coloradoPosterSrc}"]`)) return;

    const fallbackVisual = media.querySelector('.project-audio-visual');
    if (fallbackVisual) fallbackVisual.remove();

    const link = document.createElement('a');
    link.href = coloradoPosterSrc;
    link.className = 'colorado-plateau-poster';
    link.setAttribute('aria-label', 'Open Colorado Plateau poster artwork');

    const image = document.createElement('img');
    image.src = coloradoPosterSrc;
    image.alt = 'Colorado Plateau poster artwork';
    image.loading = 'lazy';
    image.decoding = 'async';
    image.style.width = '100%';
    image.style.height = 'auto';
    image.style.display = 'block';

    link.appendChild(image);
    media.insertBefore(link, media.firstChild);
  }

  function normaliseProjectImageLinks() {
    viewerPage.querySelectorAll('a').forEach(link => {
      const image = link.querySelector('img');
      if (!image) return;

      link.classList.add('project-image-link');
      link.removeAttribute('target');
      link.removeAttribute('rel');
      link.setAttribute('aria-haspopup', 'dialog');
      link.setAttribute('aria-label', image.alt ? `Preview: ${image.alt}` : 'Preview image');
    });
  }

  function enhanceProjectImages() {
    addColoradoPlateauPoster();
    normaliseProjectImageLinks();
  }

  function openLightbox(link, image) {
    const src = link.getAttribute('href') || image.currentSrc || image.src;
    if (!src) return;

    previewImage.src = src;
    previewImage.alt = image.alt || '';

    if (!lightbox.open) lightbox.showModal();
    closeButton.focus({ preventScroll: true });
  }

  function closeLightbox() {
    if (lightbox.open) lightbox.close();
  }

  const observer = new MutationObserver(enhanceProjectImages);
  observer.observe(viewerPage, { childList: true, subtree: true });
  enhanceProjectImages();

  viewerPage.addEventListener('click', event => {
    const link = event.target.closest('a.project-image-link');
    if (!link || !viewerPage.contains(link)) return;

    const image = event.target.closest('img') || link.querySelector('img');
    if (!image) return;

    event.preventDefault();
    openLightbox(link, image);
  });

  closeButton.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', event => {
    if (event.target === lightbox) closeLightbox();
  });

  lightbox.addEventListener('cancel', event => {
    event.preventDefault();
    closeLightbox();
  });

  lightbox.addEventListener('close', () => {
    previewImage.removeAttribute('src');
    previewImage.alt = '';
  });
})();
