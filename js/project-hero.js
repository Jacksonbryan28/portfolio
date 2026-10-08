// Project hero: as you start scrolling, the hero image grows out to the full
// width of the window and up to the header while the page holds still. Once
// it's full-bleed, the page scrolls as normal.
//
// The hero sits in a taller "pin" container and sticks below the header, so
// the first `distance` pixels of scrolling drive the expansion instead of
// moving the page. Progress (0 → 1) is passed to CSS as --p.
(() => {
  const pin = document.querySelector('.project-hero-pin');
  const hero = pin && pin.querySelector('.project-hero');
  const media = hero && hero.querySelector('.project-hero__media');
  if (!media || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const header = document.querySelector('header');
  let distance = 0;
  let headerHeight = 0;
  let ticking = false;

  function measure() {
    // Measure the resting layout, then switch on the expanding styles.
    hero.classList.remove('is-expanding');
    pin.style.height = '';

    const box = media.getBoundingClientRect();
    const viewport = document.documentElement.clientWidth;
    headerHeight = header ? header.offsetHeight : 0;
    distance = Math.round(Math.min(window.innerHeight * 0.5, 480));

    hero.style.setProperty('--bleed', (viewport - box.width) / 2 + 'px');
    hero.style.setProperty('--rise', parseFloat(getComputedStyle(hero).paddingTop) + 'px');
    hero.style.setProperty('--h0', box.height + 'px');
    hero.classList.add('is-expanding');

    pin.style.height = hero.offsetHeight + distance + 'px';
    update();
  }

  function update() {
    ticking = false;
    const scrolled = headerHeight - pin.getBoundingClientRect().top;
    const p = Math.min(Math.max(scrolled / distance, 0), 1);
    hero.style.setProperty('--p', p.toFixed(4));
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  measure();
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', measure);
  addEventListener('pageshow', measure);
  // Re-measure once fonts load, since they can change the hero's height.
  if (document.fonts) document.fonts.ready.then(measure);
})();
