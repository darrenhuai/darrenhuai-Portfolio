// Page behaviour: mobile menu, current-section state, reveals, the demo recording, and the hero scene.
// No scroll listeners anywhere; everything position-based uses IntersectionObserver.

const root = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasIO = 'IntersectionObserver' in window;

// ---------- Mobile menu ----------
const menuButton = document.querySelector('.menu-button');
const navLinks = document.getElementById('primary-nav');

function setMenu(open, { returnFocus = false } = {}) {
  if (!menuButton || !navLinks) return;
  navLinks.classList.toggle('is-open', open);
  root.classList.toggle('menu-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.textContent = open ? 'Close' : 'Menu';
  if (!open && returnFocus) menuButton.focus();
}
if (menuButton && navLinks) {
  menuButton.addEventListener('click', () => {
    setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
  });
  navLinks.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      setMenu(false, { returnFocus: true });
    }
  });
  document.addEventListener('click', (event) => {
    if (menuButton.getAttribute('aria-expanded') !== 'true') return;
    if (!event.target.closest('.nav')) setMenu(false);
  });
  window.matchMedia('(min-width: 920px)').addEventListener('change', (event) => {
    if (event.matches) setMenu(false);
  });
}

// ---------- Current section in the nav ----------
if (hasIO && navLinks) {
  const linkFor = new Map();
  for (const link of navLinks.querySelectorAll('a[href^="#"]')) {
    const section = document.getElementById(link.getAttribute('href').slice(1));
    if (section) linkFor.set(section, link);
  }
  const sectionObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      for (const link of linkFor.values()) link.removeAttribute('aria-current');
      linkFor.get(entry.target).setAttribute('aria-current', 'true');
    }
  }, { rootMargin: '-40% 0px -55% 0px' });
  for (const section of linkFor.keys()) sectionObserver.observe(section);

  // Above the first section nothing is current.
  const hero = document.querySelector('.hero');
  if (hero) {
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) for (const link of linkFor.values()) link.removeAttribute('aria-current');
    }, { rootMargin: '-40% 0px -55% 0px' }).observe(hero);
  }
}

// ---------- Scroll reveals ----------
// Content is visible by default. Only elements that start below the fold are put into the
// hidden "pre" state, so nothing is ever gated on this script running.
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
}

// ---------- The watchglass recording: plays once when half visible, then offers Replay ----------
const video = document.querySelector('.demo-video');
const replay = document.querySelector('[data-replay]');
if (video && replay) {
  const play = () => {
    video.currentTime = 0;
    const started = video.play();
    replay.dataset.state = 'playing';
    if (started && typeof started.catch === 'function') {
      started.catch(() => { replay.dataset.state = 'idle'; });
    }
  };
  replay.addEventListener('click', play);
  video.addEventListener('ended', () => {
    replay.textContent = 'Replay';
    replay.dataset.state = 'idle';
  });
  if (hasIO && !reduceMotion) {
    const videoObserver = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      videoObserver.disconnect();
      play();
    }, { threshold: 0.5 });
    videoObserver.observe(video);
  }
}

// ---------- Hero scene ----------
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

async function mountHeroScene() {
  const box = document.getElementById('hero-canvas-box');
  if (!box || reduceMotion) return;
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
    hero = mountHero(canvas, { reducedMotion: false, pixelRatioCap: 1.5 });
  } catch (error) {
    canvas.remove();
    return;
  }
  if (hero.fallback) {
    canvas.remove();
    return;
  }
  hero.setColors(sceneColors());
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    hero.setColors(sceneColors());
  });
  requestAnimationFrame(() => requestAnimationFrame(() => box.classList.add('is-live')));
}

if ('requestIdleCallback' in window) {
  window.requestIdleCallback(mountHeroScene, { timeout: 1500 });
} else {
  window.setTimeout(mountHeroScene, 400);
}
