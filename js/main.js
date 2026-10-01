// Page behaviour: mobile menu, current-section state, reveals, the demo recording, and the hero scene.
// No scroll listeners anywhere; everything position-based uses IntersectionObserver.

const root = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasIO = 'IntersectionObserver' in window;

// ---------- Mobile menu ----------
const header = document.querySelector('.nav');
const menuButton = document.querySelector('.menu-button');
const navLinks = document.getElementById('primary-nav');
const menuIsOpen = () => menuButton.getAttribute('aria-expanded') === 'true';

function setMenu(open, { returnFocus = false } = {}) {
  navLinks.classList.toggle('is-open', open);
  root.classList.toggle('menu-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.textContent = open ? 'Close' : 'Menu';
  if (!open && returnFocus) menuButton.focus();
}
if (header && menuButton && navLinks) {
  menuButton.addEventListener('click', () => setMenu(!menuIsOpen()));
  navLinks.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuIsOpen()) setMenu(false, { returnFocus: true });
  });
  document.addEventListener('click', (event) => {
    if (menuIsOpen() && !event.target.closest('.nav')) setMenu(false);
  });
  // Tabbing past the last link must not leave an open panel over a page that scrolls behind it.
  header.addEventListener('focusout', (event) => {
    if (menuIsOpen() && event.relatedTarget && !header.contains(event.relatedTarget)) setMenu(false);
  });
  window.matchMedia('(min-width: 920px)').addEventListener('change', (event) => {
    if (event.matches && menuIsOpen()) setMenu(false);
  });
}

// ---------- Current section in the nav ----------
// A section is current while it crosses a thin band below the header. The last section can be too
// short to reach that band on a tall viewport, so reaching the footer also makes it current.
if (hasIO && navLinks) {
  const linkFor = new Map();
  for (const link of navLinks.querySelectorAll('a[href^="#"]')) {
    const section = document.getElementById(link.getAttribute('href').slice(1));
    if (section) linkFor.set(section, link);
  }
  const sections = [...linkFor.keys()];
  const inBand = new Set();
  let atEnd = false;
  const paint = () => {
    const current = atEnd ? sections[sections.length - 1] : sections.filter((s) => inBand.has(s)).pop();
    for (const [section, link] of linkFor) {
      if (section === current) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    }
  };
  const bandObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) inBand.add(entry.target);
      else inBand.delete(entry.target);
    }
    paint();
  }, { rootMargin: '-40% 0px -55% 0px' });
  for (const section of sections) bandObserver.observe(section);

  const footer = document.querySelector('.footer');
  if (footer) {
    new IntersectionObserver(([entry]) => {
      atEnd = entry.isIntersecting;
      paint();
    }).observe(footer);
  }
}

// ---------- Scroll reveals ----------
// Content is visible by default. Only elements that start below the fold are put into the
// hidden "pre" state, so nothing is ever gated on this script running.
const showAll = () => {
  for (const el of document.querySelectorAll('.pre')) el.classList.remove('pre');
};
if (hasIO && !reduceMotion) {
  const revealObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.remove('pre');
      revealObserver.unobserve(entry.target);
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });


  const fold = window.innerHeight * 0.92;
  for (const el of document.querySelectorAll('[data-reveal]')) {
    if (el.getBoundingClientRect().top > fold) {
      el.classList.add('pre');
      revealObserver.observe(el);
    }
  }
  window.addEventListener('beforeprint', showAll);
}

// ---------- Scroll regions are only tab stops while they actually scroll ----------
if ('ResizeObserver' in window) {
  for (const region of document.querySelectorAll('.axis-scroll')) {
    const sync = () => {
      if (region.scrollWidth > region.clientWidth + 1) region.tabIndex = 0;
      else region.removeAttribute('tabindex');
    };
    new ResizeObserver(sync).observe(region);
  }
}

// ---------- The watchglass recording ----------
// Plays once when half visible; the button is always there and toggles pause, play and replay.
const video = document.querySelector('.demo-video');
const toggle = document.querySelector('[data-replay]');
if (video && toggle) {
  video.removeAttribute('controls'); // native controls are the no-script fallback
  toggle.addEventListener('click', () => {
    if (!video.paused && !video.ended) {
      video.pause();
      return;
    }
    if (video.ended) video.currentTime = 0;
    video.play().catch(() => {});
  });
  video.addEventListener('play', () => { toggle.textContent = 'Pause'; });
  video.addEventListener('pause', () => { if (!video.ended) toggle.textContent = 'Play demo'; });
  video.addEventListener('ended', () => { toggle.textContent = 'Replay'; });

  if (hasIO && !reduceMotion) {
    const videoObserver = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      videoObserver.disconnect();
      video.play().catch(() => {});
    }, { threshold: 0.5 });
    videoObserver.observe(video);
  }
}

// ---------- Live ChessTan board on the project card ----------
// The <picture> still is the loading state, the error state, and the reduced-motion state.
function sceneColors() {
  const style = getComputedStyle(root);
  const read = (name) => style.getPropertyValue(name).trim();
  return {
    bg: read('--bg-hex'),
    accent: read('--accent-hex'),
    ink: read('--ink-hex'),
    surface: read('--surface-hex'),
  };
}

async function mountBoardScene(box) {
  const connection = navigator.connection;
  if (connection && connection.saveData) return;
  if (navigator.deviceMemory && navigator.deviceMemory < 4) return;
  if (!document.createElement('canvas').getContext('webgl2')) return;

  let mountHero;
  try {
    ({ mountHero } = await import('./hero-scene.js'));
  } catch (error) {
    return; // CDN or module failure: the still stays.
  }

  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  box.appendChild(canvas);

  let hero;
  try {
    hero = mountHero(canvas, { reducedMotion: false, pixelRatioCap: 1.5, pointerTarget: box.closest('.project-card') || box });
  } catch (error) {
    canvas.remove();
    return;
  }
  if (hero.fallback) {
    canvas.remove();
    return;
  }
  hero.setColors(sceneColors());

  const scheme = window.matchMedia('(prefers-color-scheme: dark)');
  const onScheme = () => hero.setColors(sceneColors());
  scheme.addEventListener('change', onScheme);

  // A lost WebGL context (a backgrounded phone tab, a driver reset) goes back to the still for good.
  canvas.addEventListener('webglcontextlost', () => {
    box.classList.remove('is-live');
    scheme.removeEventListener('change', onScheme);
    hero.dispose();
    canvas.remove();
  }, { once: true });

  requestAnimationFrame(() => requestAnimationFrame(() => box.classList.add('is-live')));
}

// Load three.js only when the card is about a screen away, and only where motion is welcome.
const boardBox = document.getElementById('board-canvas-box');
if (boardBox && !reduceMotion && hasIO) {
  const nearBoard = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    nearBoard.disconnect();
    const start = () => mountBoardScene(boardBox);
    if ('requestIdleCallback' in window) window.requestIdleCallback(start, { timeout: 1500 });
    else window.setTimeout(start, 200);
  }, { rootMargin: '800px 0px' });
  nearBoard.observe(boardBox);
}
