// Project hero: as you start scrolling, the hero image grows out to the full
// width of the window (up to 1440px) and up to the header while the page
// holds still. Once it's fully expanded, the page scrolls as normal.
//
// The page's <main> sits inside a "hold" container that's taller than it by
// `distance` pixels, and sticks below the header. So for the first `distance`
// pixels of scrolling nothing on the page moves; that scroll drives the
// expansion instead. Progress (0 → 1) is passed to CSS as --p.
(() => {
  const hold = document.querySelector('.project-hold');
  const main = hold && hold.querySelector('main');
  const hero = main && main.querySelector('.project-hero');
  const media = hero && hero.querySelector('.project-hero__media');
  if (!media || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const maxWidth = 1440;
  const header = document.querySelector('header');
  let distance = 0;
  let headerHeight = 0;
  let ticking = false;

  function measure() {
    // Measure the resting layout, then switch on the expanding styles.
    hero.classList.remove('is-expanding');

    const box = media.getBoundingClientRect();
    const viewport = document.documentElement.clientWidth;
    headerHeight = header ? header.offsetHeight : 0;

    // Grow to the full window width, but no wider than maxWidth so it still
    // looks composed on ultra-wide monitors.
    const target = Math.min(viewport, maxWidth);
    const bleed = (target - box.width) / 2;
    const rise = parseFloat(getComputedStyle(hero).paddingTop);

    // Hold for longer when the image has further to grow: a short flick on a
    // phone, up to 480px on a large screen.
    distance = Math.round(Math.min(Math.max((bleed + rise) * 2.5, 120), 480));

    hero.style.setProperty('--bleed', bleed + 'px');
    // Only square the corners off when the image actually reaches the edges.
    hero.style.setProperty('--square', target === viewport ? 1 : 0);
    hero.style.setProperty('--rise', rise + 'px');
    hero.style.setProperty('--h0', box.height + 'px');
    hero.classList.add('is-expanding');
    hold.classList.add('is-holding');

    sizeHold();
    update();
  }

  // The hold container is the page's height plus the hold distance. Keep it
  // in step if the page's height changes (e.g. images or fonts loading).
  function sizeHold() {
    hold.style.height = main.offsetHeight + distance + 'px';
  }

  function update() {
    ticking = false;
    const scrolled = headerHeight - hold.getBoundingClientRect().top;
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
  if (window.ResizeObserver) new ResizeObserver(sizeHold).observe(main);
  // Re-measure once fonts load, since they can change the hero's size.
  if (document.fonts) document.fonts.ready.then(measure);
})();
