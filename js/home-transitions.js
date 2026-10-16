// Home page view transitions: only the project being opened (or returned
// from) keeps its view-transition-names, so it travels on top as its own
// layer while the rest of the page, including the other cards, fades
// underneath as one layer.
//
// This runs in the <head> so the listeners are in place before the page's
// first frame (pagereveal fires then). Without the script, every card keeps
// its names and the transition still works, just with cards stacked in page
// order.
(() => {
  const STORE = 'home-transition-project';

  function cards() {
    return [...document.querySelectorAll('.project-card a[href]')];
  }

  // Give the matching card its names back and switch everyone else's off.
  function nameOnly(url) {
    for (const link of cards()) {
      const active = url && link.href === url;
      for (const el of link.querySelectorAll('[style*="view-transition-name"], [data-vt-name]')) {
        if (!el.dataset.vtName) el.dataset.vtName = el.style.viewTransitionName;
        el.style.viewTransitionName = active ? el.dataset.vtName : 'none';
      }
    }
  }

  // Leaving the home page: keep names only on the card that was clicked.
  addEventListener('pageswap', (e) => {
    if (!e.viewTransition) return;
    const url = e.activation && e.activation.entry && e.activation.entry.url;
    try { sessionStorage.setItem(STORE, url || ''); } catch (err) {}
    nameOnly(url);
  });

  // Arriving back on the home page: keep names only on the project we came
  // from. The Navigation API says where we came from; elsewhere fall back to
  // the project that was opened last.
  addEventListener('pagereveal', (e) => {
    if (!e.viewTransition) return;
    let from = window.navigation && navigation.activation && navigation.activation.from
      ? navigation.activation.from.url : null;
    if (!from) {
      try { from = sessionStorage.getItem(STORE); } catch (err) {}
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => nameOnly(from), { once: true });
    } else {
      nameOnly(from);
    }
  });
})();
