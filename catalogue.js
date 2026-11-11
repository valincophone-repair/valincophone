(() => {
  const form = document.getElementById('catalogue-filters');
  const search = document.getElementById('catalogue-search');
  const category = document.getElementById('catalogue-category');
  const brand = document.getElementById('catalogue-brand');
  const condition = document.getElementById('catalogue-condition');
  const sort = document.getElementById('catalogue-sort');
  const count = document.getElementById('catalogue-count');
  const empty = document.getElementById('catalogue-empty');
  const sections = [...document.querySelectorAll('.catalogue-section')];
  const cards = [...document.querySelectorAll('.catalogue-card')];
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, '');

  function update() {
    const terms = search.value.trim().split(/\s+/).filter(Boolean).map(normalize);
    let total = 0;
    cards.forEach(card => {
      const matches = (!category.value || card.dataset.category === category.value)
        && (!brand.value || card.dataset.brand === brand.value)
        && (!condition.value || card.dataset.condition === condition.value)
        && terms.every(term => normalize(card.dataset.search).includes(term));
      card.hidden = !matches;
      if (matches) total++;
    });
    sections.forEach(section => {
      const grid = section.querySelector('.catalogue-grid');
      const sectionCards = [...grid.children];
      sectionCards.sort((a, b) => {
        const byName = a.dataset.search.localeCompare(b.dataset.search, 'fr', {numeric: true});
        if (sort.value === 'name') return (a.dataset.brand + a.querySelector('h3').textContent).localeCompare(b.dataset.brand + b.querySelector('h3').textContent, 'fr', {numeric: true}) || byName;
        const difference = Number(a.dataset.price) - Number(b.dataset.price);
        return (sort.value === 'price-desc' ? -difference : difference) || byName;
      });
      sectionCards.forEach(card => grid.appendChild(card));
      section.hidden = sectionCards.every(card => card.hidden);
    });
    count.textContent = total + (total === 1 ? ' appareil affiché sur ' : ' appareils affichés sur ') + cards.length;
    empty.textContent = category.value === 'tablettes' && !cards.some(card => card.dataset.category === 'tablettes')
      ? 'Aucune tablette n’est proposée pour le moment. Les modèles apparaîtront ici lorsqu’ils seront ajoutés au catalogue.'
      : 'Aucun appareil ne correspond à votre recherche. Essayez une autre marque ou effacez les filtres.';
    empty.hidden = total !== 0;
  }
  form.hidden = false;
  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  form.addEventListener('reset', () => setTimeout(update, 0));
  document.querySelectorAll('.catalogue-nav a').forEach(link => {
    link.addEventListener('click', () => {
      category.value = link.getAttribute('href').slice(1);
      search.value = brand.value = condition.value = '';
      update();
    });
  });
  update();
})();

