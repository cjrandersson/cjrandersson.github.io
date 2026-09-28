(() => {
  const viewerPage = document.querySelector('#viewer-page');
  if (!viewerPage) return;

  const coloradoPosterSrc = 'media/sound-design/colorado-plateau-poster-hq.webp';

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

  function findColoradoSection() {
    return [...viewerPage.querySelectorAll('.project-story-section')].find(section => {
      const eyebrow = section.querySelector('.project-eyebrow')?.textContent?.trim();
      const title = section.querySelector('h3')?.textContent?.trim();
      return eyebrow === 'Selected sound / 02' && title === 'Colorado Plateau';
    });
  }

  function updateColoradoPlateauCopy() {
    const coloradoSection = findColoradoSection();
    if (!coloradoSection) return;

    const copy = coloradoSection.querySelector('.project-story-copy');
    if (!copy || copy.dataset.coloradoCopyUpdated === 'true') return;

    copy.innerHTML = `
      <p class="project-eyebrow">Selected sound / 02</p>
      <h3 style="color:#f2d84a;">Colorado Plateau</h3>
      <p style="color:#f2d84a;font-size:clamp(1.05rem,1.45vw,1.3rem);line-height:1.45;font-weight:600;margin-top:.65rem;"><em>Ett arthouse-koncept och en psykologisk thriller i skärningspunkten mellan slow cinema, ödslighet och experimentell ljudkonst.</em></p>

      <p style="color:#f2d84a;font-size:clamp(1rem,1.15vw,1.15rem);font-weight:700;margin-top:1.6rem;margin-bottom:.45rem;">Handling &amp; Synopsis</p>
      <p>En namnlös man färdas genom den amerikanska sydvästerns monumentala ödemark med ett oförklarligt stulet föremål i sin packning. Ständigt förföljd av en okänd närvaro tvingas han genom ett landskap där gränsen mellan yttre verklighet och inre paranoia gradvis löses upp. Genom minimal exposition och ett dröjande tempo undersöker projektet hur oändliga, öppna ytor kan göras djupt klaustrofobiska.</p>

      <p style="color:#f2d84a;font-size:clamp(1rem,1.15vw,1.15rem);font-weight:700;margin-top:1.6rem;margin-bottom:.45rem;">Cinematografi &amp; Visuellt Språk</p>
      <p>Ett minimalistiskt och observerande bildspråk byggt på anamorfa <em>wide-lens</em>-perspektiv, statiska kompositioner och utdragna, obrutna tagningar. Människan reduceras till ett litet element i ett storslaget landskap där värmedis och långsam repetition förvandlar öknen från öppen till desorienterande och hotfull.</p>

      <p style="color:#f2d84a;font-size:clamp(1rem,1.15vw,1.15rem);font-weight:700;margin-top:1.6rem;margin-bottom:.45rem;">Soundtrack &amp; Sound Design</p>
      <p>Ljudet fungerar som filmens osynliga narratör. Soundtracket bygger på en analog lo-fi-process med slitna gitarrpedaler, degraderade fältinspelningar, distorsion, varma synthmattor och lågfrekventa drönare. Brus och elektriska artefakter har lämnats kvar för att skapa en taktil, sliten textur. Miljöljud (vind, grus, vibrationer) vävs sömlöst samman med musiken – gränsen mellan vad som är diegetiskt ljud och vad som är filmens score löses helt upp.</p>`;

    copy.dataset.coloradoCopyUpdated = 'true';
  }

  function addColoradoPlateauPoster() {
    const coloradoSection = findColoradoSection();
    if (!coloradoSection) return;

    const media = coloradoSection.querySelector('.project-story-media--audio');
    if (!media || media.querySelector(`img[src="${coloradoPosterSrc}"]`)) return;

    const fallbackVisual = media.querySelector('.project-audio-visual');
    if (fallbackVisual) fallbackVisual.remove();

    const existingPoster = media.querySelector('.colorado-plateau-poster');
    if (existingPoster) existingPoster.remove();

    const link = document.createElement('a');
    link.href = coloradoPosterSrc;
    link.className = 'colorado-plateau-poster';
    link.setAttribute('aria-label', 'Open Colorado Plateau poster artwork');

    const image = document.createElement('img');
    image.src = coloradoPosterSrc;
    image.alt = 'Colorado Plateau poster artwork';
    image.width = 2732;
    image.height = 4268;
    image.loading = 'eager';
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
    updateColoradoPlateauCopy();
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
