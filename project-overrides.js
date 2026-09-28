(() => {
  const soundProject = (window.PROJECTS || []).find(project => project.slug === 'sound-design');
  const coloradoPlateau = soundProject?.storySections?.find(section => section.title === 'Colorado Plateau');

  if (!coloradoPlateau) return;

  coloradoPlateau.artwork = 'media/sound-design/colorado-plateau-poster-hq.webp';
  coloradoPlateau.alt = 'Colorado Plateau fictional film poster with desert landscape, red bird symbols and bold yellow title typography';
})();
