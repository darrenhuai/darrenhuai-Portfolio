// A field of short tick marks drawn on a canvas. At rest they lie still in a noise pattern; while the
// pointer is over the field they turn toward it, the nearest ones most, and ease back when it leaves.
// Pass drift: true for a slow idle drift as well. mountField(canvas, options) returns { dispose }.
// With reduced motion it draws one frame and stops.

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

// shortest signed distance between two angles of undirected lines (a mark and its reverse look the same)
function lineAngleDelta(from, to) {
  let d = (to - from) % Math.PI;
  if (d > Math.PI / 2) d -= Math.PI;
  if (d < -Math.PI / 2) d += Math.PI;
  return d;
}

export function mountField(canvas, options = {}) {
  const cols = options.cols || 9;
  const rows = options.rows || 9;
  const length = options.length || 14;
  const color = options.color || '#17131f';
  const speed = options.speed || 0.12;
  const reduced = Boolean(options.reducedMotion);
  const drift = Boolean(options.drift) && !reduced;
  const followPointer = options.followPointer !== false && !reduced;
  const hoverTarget = options.hoverTarget || canvas.parentElement || canvas;
  const noise = makeNoise(options.seed || 7);
  const ctx = canvas.getContext('2d');
  if (!ctx) return { dispose() {} };

  let width = 0, height = 0, dpr = 1, frame = 0, running = false, start = performance.now();
  let pointer = null; // page coordinates of the pointer while it is over the field, else null
  let settled = true; // true once every mark has reached its target and the loop can rest
  const angles = new Float32Array(cols * rows); // the angle each mark is currently drawn at

  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, Math.round(rect.width));
    height = Math.max(1, Math.round(rect.height));
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function markCentre(c, r) {
    // alternate rows sit half a cell over, so the marks fall on a hex lattice like the board's tiles
    const gx = width / (cols + 0.5), gy = height / rows;
    return [gx * (c + 0.5 + (r % 2) * 0.5), gy * (r + 0.5)];
  }

  function targetAngle(c, r, t, local) {
    const rest = (noise(c * 0.35, r * 0.35, drift ? t : 0) - 0.5) * Math.PI * 1.6;
    if (!local) return rest;
    // the mark leans toward the pointer; the pull fades with distance so the field bends rather than snaps
    const [cx, cy] = markCentre(c, r);
    const dx = local.x - cx, dy = local.y - cy;
    const dist = Math.hypot(dx, dy);
    const reach = Math.max(width, height) * 1.4;
    const pull = Math.max(0, 1 - dist / reach);
    const toward = Math.atan2(dy, dx);
    return rest + lineAngleDelta(rest, toward) * pull;
  }

  function draw(t, settle) {
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.1;
    ctx.lineCap = 'round';
    let local = null;
    if (pointer) {
      const rect = canvas.getBoundingClientRect();
      local = { x: pointer.x - rect.left - window.scrollX, y: pointer.y - rect.top - window.scrollY };
    }
    let largest = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        const target = targetAngle(c, r, t, local);
        // ease toward the target so the marks turn instead of jumping
        const delta = lineAngleDelta(angles[i], target);
        largest = Math.max(largest, Math.abs(delta));
        angles[i] = settle ? target : angles[i] + delta * 0.14;
        const [cx, cy] = markCentre(c, r);
        const dx = Math.cos(angles[i]) * length / 2, dy = Math.sin(angles[i]) * length / 2;
        ctx.beginPath();
        ctx.moveTo(cx - dx, cy - dy);
        ctx.lineTo(cx + dx, cy + dy);
        ctx.stroke();
      }
    }
    settled = largest < 0.002;
  }

  function loop(now) {
    if (!running) return;
    draw(((now - start) / 1000) * speed, false);
    // without drift the loop only needs to run while the marks are turning
    if (!drift && pointer === null && settled) { running = false; return; }
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
  draw(0, true);
  const onResize = () => { resize(); draw(reduced ? 0 : ((performance.now() - start) / 1000) * speed, true); };
  window.addEventListener('resize', onResize);

  const onMove = (event) => {
    if (event.pointerType && event.pointerType !== 'mouse') return;
    pointer = { x: event.pageX, y: event.pageY };
    play();
  };
  const onLeave = () => { pointer = null; play(); };
  if (followPointer) {
    hoverTarget.addEventListener('pointerenter', onMove);
    hoverTarget.addEventListener('pointermove', onMove, { passive: true });
    hoverTarget.addEventListener('pointerleave', onLeave);
    window.addEventListener('blur', onLeave);
  }

  let observer = null;
  if (drift && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) play(); else pause(); });
    observer.observe(canvas);
  } else if (drift) {
    play();
  }
  const onVisibility = () => { if (document.hidden) pause(); else if (drift && observer === null) play(); };
  document.addEventListener('visibilitychange', onVisibility);

  return {
    dispose() {
      pause();
      window.removeEventListener('resize', onResize);
      hoverTarget.removeEventListener('pointerenter', onMove);
      hoverTarget.removeEventListener('pointermove', onMove);
      hoverTarget.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', onLeave);
      document.removeEventListener('visibilitychange', onVisibility);
      if (observer) observer.disconnect();
    },
  };
}
