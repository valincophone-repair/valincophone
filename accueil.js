(() => {
  const notes = Array.from(document.querySelectorAll('.home-more'));
  const desktop = window.matchMedia('(hover: hover) and (pointer: fine)');
  const canFloat = typeof HTMLElement.prototype.showPopover === 'function';
  let active = null;
  let pinned = false;
  let closingTimer;

  function cancelClose() {
    window.clearTimeout(closingTimer);
  }

  function close(returnFocus = false) {
    cancelClose();
    if (!active) return;
    const note = active;
    const panel = note.querySelector('.home-note');
    active = null;
    pinned = false;
    if (panel.hasAttribute('popover')) {
      panel.hidePopover();
      panel.removeAttribute('popover');
    }
    note.open = false;
    if (returnFocus) note.querySelector('summary').focus({ preventScroll: true });
  }

  function positionPanel() {
    if (!active) return;
    const panel = active.querySelector('.home-note');
    if (!panel.hasAttribute('popover')) return;
    const anchor = active.querySelector('summary').getBoundingClientRect();
    const height = document.documentElement.clientHeight;
    if (anchor.bottom < 0 || anchor.top > height) { close(); return; }
    const top = anchor.bottom + panel.offsetHeight + 8 <= height
      ? anchor.bottom + 2
      : Math.max(6, anchor.top - panel.offsetHeight - 2);
    panel.style.top = top + 'px';
    panel.style.left = Math.max(8, Math.min(anchor.left, document.documentElement.clientWidth - panel.offsetWidth - 8)) + 'px';
  }

  function open(note, pin, floating) {
    cancelClose();
    if (active === note) { pinned ||= pin; return; }
    close();
    active = note;
    pinned = pin;
    note.open = true;
    if (canFloat && floating) {
      const panel = note.querySelector('.home-note');
      panel.setAttribute('popover', 'manual');
      panel.showPopover();
      positionPanel();
    }
  }

  function scheduleClose(note) {
    if (active !== note || pinned) return;
    cancelClose();
    closingTimer = window.setTimeout(() => {
      if (active === note && !pinned && !note.contains(document.activeElement)) close();
    }, 260);
  }

  for (const note of notes) {
    const summary = note.querySelector('summary');
    const panel = note.querySelector('.home-note');
    let lastPointerType = '';
    summary.addEventListener('pointerdown', event => { lastPointerType = event.pointerType; });
    summary.addEventListener('click', event => {
      event.preventDefault();
      if (active === note && pinned) close(true);
      else open(note, true, desktop.matches && (event.detail === 0 || lastPointerType !== 'touch'));
    });
    summary.addEventListener('pointerenter', event => {
      if (event.pointerType === 'mouse' && desktop.matches && (!pinned || active === note)) open(note, false, true);
    });
    summary.addEventListener('pointerleave', () => scheduleClose(note));
    panel.addEventListener('pointerenter', cancelClose);
    panel.addEventListener('pointerleave', () => scheduleClose(note));
    note.addEventListener('focusout', event => {
      if (active === note && !note.contains(event.relatedTarget)) close();
    });
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Fermer';
    button.addEventListener('click', () => close(true));
    panel.append(button);
  }

  document.addEventListener('pointerdown', event => {
    if (active && !active.contains(event.target)) close();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && active) {
      close(active.contains(document.activeElement));
      event.preventDefault();
    }
  });
  window.addEventListener('resize', positionPanel);
  window.addEventListener('scroll', positionPanel, { passive: true });
  function followFragment() {
    const note = document.getElementById(location.hash.slice(1));
    if (note?.matches('.home-more')) open(note, true, desktop.matches);
  }
  window.addEventListener('hashchange', followFragment);
  followFragment();
})();
