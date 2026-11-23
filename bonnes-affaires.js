(() => {
  document.querySelectorAll('.atelier-deal').forEach(deal => {
    const controls = deal.querySelector('.atelier-deal-photo-controls');
    if (!controls) return;
    controls.hidden = false;
    const buttons = [...controls.querySelectorAll('[data-deal-photo]')];
    const photos = [...deal.querySelectorAll('.atelier-deal-photo-frame img')];
    buttons.forEach(button => button.addEventListener('click', () => {
      photos.forEach(photo => { photo.hidden = photo.id !== button.dataset.dealPhoto; });
      buttons.forEach(other => other.setAttribute('aria-pressed', String(other === button)));
    }));
  });
})();
