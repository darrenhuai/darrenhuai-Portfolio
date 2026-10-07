// A field of short tick marks that lean with a slow-moving noise, drawn on a canvas.
// mountField(canvas, options) returns { dispose }. With reduced motion it draws one frame and stops.

function makeNoise(seed) {
  // value noise on a 3D lattice, smoothed; enough for marks that drift, not for terrain
  const perm = new Uint8Array(512);
  let s = seed >>> 0;
  const rand = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  const base = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [base[i], base[j]] = [base[j], base[i]];
  }
  for (let i = 0; i < 512; i++) perm[i] = base[i & 255];
  const hash = (x, y, z) => perm[(perm[(perm[x & 255] + y) & 255] + z) & 255] / 255;
  const fade = (t) => t * t * (3 - 2 * t);
  const lerp = (a, b, t) => a + (b - a) * t;
  return (x, y, z) => {
    const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
    const xf = fade(x - xi), yf = fade(y - yi), zf = fade(z - zi);
    const c = (dx, dy, dz) => hash(xi + dx, yi + dy, zi + dz);
    const x00 = lerp(c(0, 0, 0), c(1, 0, 0), xf);
    const x10 = lerp(c(0, 1, 0), c(1, 1, 0), xf);
    const x01 = lerp(c(0, 0, 1), c(1, 0, 1), xf);
    const x11 = lerp(c(0, 1, 1), c(1, 1, 1), xf);
    return lerp(lerp(x00, x10, yf), lerp(x01, x11, yf), zf);
  };
}

export function mountField(canvas, options = {}) {
  const cols = options.cols || 9;
  const rows = options.rows || 9;
  const length = options.length || 14;
  const color = options.color || '#17131f';
  const speed = options.speed || 0.12;
  const reduced = Boolean(options.reducedMotion);
  const noise = makeNoise(options.seed || 7);
  const ctx = canvas.getContext('2d');
  if (!ctx) return { dispose() {} };

  let width = 0, height = 0, dpr = 1, frame = 0, running = false, start = performance.now();

  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, Math.round(rect.width));
    height = Math.max(1, Math.round(rect.height));
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function draw(t) {
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.1;
    ctx.lineCap = 'round';
    // alternate rows sit half a cell over, so the marks fall on a hex lattice like the board's tiles
    const gx = width / (cols + 0.5), gy = height / rows;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cx = gx * (c + 0.5 + (r % 2) * 0.5), cy = gy * (r + 0.5);
        const n = noise(c * 0.35, r * 0.35, t);
        const angle = (n - 0.5) * Math.PI * 1.6;
        const dx = Math.cos(angle) * length / 2, dy = Math.sin(angle) * length / 2;
        ctx.beginPath();
        ctx.moveTo(cx - dx, cy - dy);
        ctx.lineTo(cx + dx, cy + dy);
        ctx.stroke();
      }
    }
  }

  function loop(now) {
    if (!running) return;
    draw(((now - start) / 1000) * speed);
    frame = requestAnimationFrame(loop);
  }

  function play() {
    if (running || reduced) return;
    running = true;
    frame = requestAnimationFrame(loop);
  }
  function pause() {
    running = false;
    cancelAnimationFrame(frame);
  }

  resize();
  draw(0);
  const onResize = () => { resize(); draw(reduced ? 0 : ((performance.now() - start) / 1000) * speed); };
  window.addEventListener('resize', onResize);

  let observer = null;
  if (!reduced && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) play(); else pause(); });
    observer.observe(canvas);
  } else {
    play();
  }
  const onVisibility = () => { if (document.hidden) pause(); else if (observer === null) play(); };
  document.addEventListener('visibilitychange', onVisibility);

  return {
    dispose() {
      pause();
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      if (observer) observer.disconnect();
    },
  };
}
