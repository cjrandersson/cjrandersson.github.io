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
      <h3>Colorado Plateau</h3>

      <p><strong>Project Overview</strong></p>
      <p><em>Colorado Plateau</em> är ett fiktivt arthouse-koncept och en psykologisk thriller byggd kring <strong>landskap, ljud och perception</strong>.</p>
      <p>En namnlös man färdas genom den amerikanska sydvästerns öken med ett föremål som inte tillhör honom. Något tycks följa efter, men om hotet är verkligt, psykologiskt eller en del av själva landskapet avslöjas aldrig.</p>
      <p>Projektet undersöker hur enorma öppna ytor kan göras klaustrofobiska och hur frånvaro, repetition och ljud kan skapa spänning utan traditionell exposition.</p>

      <p><strong>Visual Language &amp; Cinematography</strong></p>
      <p>Bildspråket bygger på <strong>extrema wide-lens-perspektiv, statiska kompositioner och långa obrutna tagningar</strong>. Människan reduceras till ett litet element i ett monumentalt landskap av röda klippformationer, uttorkade dalar och avlägsna horisonter.</p>
      <p>Kameran observerar snarare än förklarar. Negativt utrymme, värmedis och långsam repetition gör att öknen gradvis förändras från öppen och monumental till desorienterande och hotfull.</p>

      <p><strong>Narrative &amp; Atmosphere</strong></p>
      <p>Berättelsen hålls medvetet fragmentarisk.</p>
      <p>Det stulna föremålet förklaras aldrig. Förföljaren visas aldrig tydligt. Istället byggs hotet genom små förändringar: ett avlägset ljud, spår i sanden, en väg som känns bekant eller något som tycks ha flyttats under natten.</p>
      <p>Ju längre färden fortsätter, desto svårare blir det att avgöra vad som är geografiskt verkligt och vad som hör till mannens egen perception.</p>

      <p><strong>Soundtrack &amp; Sound Design</strong></p>
      <p>Ljudet fungerar som filmens <strong>osynliga narratör</strong>.</p>
      <p>Soundtracket kombinerar degraderade fältinspelningar, mobiltelefoninspelningar, improviserad gitarr, distortion, delay, varma synthtexturer och lågfrekventa drönare. Brus, clipping och elektriska artefakter lämnas medvetet kvar för att skapa en sliten och fysisk ljudbild.</p>
      <p>Miljöljud behandlas samtidigt som musikaliskt material. Vind, grus, metalliska vibrationer och avlägsna mekaniska ljud loopas, sträcks och bearbetas tills gränsen mellan <strong>diegetiskt ljud och score</strong> börjar lösas upp.</p>
      <p>Ett ljud kan uppfattas som musik i ena stunden och som något som faktiskt befinner sig ute i öknen i nästa.</p>

      <p><strong>Visual Identity</strong></p>
      <p>Den grafiska identiteten följer samma princip som filmen: <strong>fragment, landskap och otydliga signaler</strong>.</p>
      <p>Grynig ökenfotografi kombineras med röda symboler och abstrakta markörer i en begränsad palett av sand, blekt cyan, bränd orange, svart och signalrött. Uttrycket hämtar drag från screentryck, äldre trycksaker och psykedelisk affischdesign utan att bli ren retroestetik.</p>

      <p><strong>Creative Direction</strong></p>
      <p><strong>Show less. Let the viewer complete the image.</strong></p>
      <p>Hotet visas aldrig fullt ut. Föremålet förklaras aldrig. Musiken berättar inte hur publiken ska känna.</p>
      <p>Istället bygger <em>Colorado Plateau</em> sitt psykologiska rum genom små visuella och auditiva avvikelser, någonstans mellan <strong>slow cinema, road movie, psykologisk skräck och audiovisuell installation</strong>.</p>`;

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
