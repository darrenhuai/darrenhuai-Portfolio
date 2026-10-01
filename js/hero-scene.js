// hero.js -- ChessTan hex-board hero, variant B (hand-authored procedural scene).
//
// This is a 3D *interpretation* of ChessTan. The shipped game draws its board and
// units as flat 2D SVG; the prisms, pieces and props here are original low-poly
// stand-ins built from lathe / cylinder / cone / box primitives, not game art.
//
// Contract:
//   import { mountHero } from './hero.js';
//   const hero = mountHero(canvas, { reducedMotion, pixelRatioCap });
//   hero.setColors({ bg, accent, ink, surface });   // any CSS colour string three.js can parse
//   hero.dispose();
//
// Only dependency: `three` (pinned by the page's import map).

import * as THREE from 'three';

export const INTERPRETATION_NOTE =
  '3D interpretation of ChessTan. The shipped game renders its units as 2D SVG.';

const SQRT3 = Math.sqrt(3);
const TAU = Math.PI * 2;

// ----------------------------------------------------------------------------
// Small helpers
// ----------------------------------------------------------------------------
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
// frame-rate independent exponential approach
const damp = (a, b, lambda, dt) => lerp(a, b, 1 - Math.exp(-lambda * dt));

function toColor(v, fallback) {
  const c = new THREE.Color(fallback);
  if (v instanceof THREE.Color) return c.copy(v);
  if (typeof v === 'number') return c.setHex(v);
  if (typeof v === 'string' && v.trim()) {
    try { c.set(v.trim()); } catch (_) { /* keep fallback */ }
  }
  return c;
}
const mix = (a, b, t) => a.clone().lerp(b, t);
function hslOf(c) { const o = { h: 0, s: 0, l: 0 }; c.getHSL(o, THREE.SRGBColorSpace); return o; }
function shift(c, dh, sMul, dl) {
  const o = hslOf(c);
  return new THREE.Color().setHSL((o.h + dh + 2) % 1, clamp(o.s * sMul, 0, 1), clamp(o.l + dl, 0, 1), THREE.SRGBColorSpace);
}

// Concatenate geometries (position/uv) into one non-indexed buffer; flat-shades the result.
function mergeFlat(parts) {
  const geos = parts.map((g) => (g.index ? g.toNonIndexed() : g));
  let n = 0;
  for (const g of geos) n += g.attributes.position.count;
  const pos = new Float32Array(n * 3);
  const uv = new Float32Array(n * 2);
  let o = 0;
  for (const g of geos) {
    const c = g.attributes.position.count;
    pos.set(g.attributes.position.array, o * 3);
    if (g.attributes.uv) uv.set(g.attributes.uv.array, o * 2);
    o += c;
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  out.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  out.computeVertexNormals(); // non-indexed => faceted, the low-poly look we want
  for (const g of parts) g.dispose();
  for (const g of geos) if (!parts.includes(g)) g.dispose();
  return out;
}
const M = new THREE.Matrix4();
function placed(geo, x, y, z, rx = 0, ry = 0, rz = 0, s = 1) {
  M.compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, ry, rz)), new THREE.Vector3(s, s, s));
  return geo.applyMatrix4(M);
}
function lathe(points, segments = 28) {
  return new THREE.LatheGeometry(points.map(([x, y]) => new THREE.Vector2(x, y)), segments);
}

// ----------------------------------------------------------------------------
// Board layout (axial coordinates, pointy-top hexes)
// ----------------------------------------------------------------------------
const TILE_R = 1.0;      // centre-to-centre spacing / circumradius
const CAP_R = 0.90;      // circumradius of the top face
const BEVEL = 0.05;
const TILE_DEPTH = 0.32;
const TILE_H = TILE_DEPTH + BEVEL * 2; // world height at scale 1

const KIND_SCALE = { field: 1.0, forest: 1.05, hill: 1.14, ore: 1.26, water: 0.80 };

// 37-tile radius-3 hex with four corner tiles removed -> 33-tile irregular cluster.
const MAP = [
  [0, -3, 'forest'], [1, -3, 'hill'],
  [-1, -2, 'forest'], [0, -2, 'forest'], [1, -2, 'hill'], [2, -2, 'ore'], [3, -2, 'ore'],
  [-2, -1, 'field'], [-1, -1, 'forest'], [0, -1, 'water'], [1, -1, 'water'], [2, -1, 'hill'], [3, -1, 'ore'],
  [-3, 0, 'field'], [-2, 0, 'field'], [-1, 0, 'water'], [0, 0, 'field'], [1, 0, 'field'], [2, 0, 'hill'], [3, 0, 'forest'],
  [-3, 1, 'field'], [-2, 1, 'hill'], [-1, 1, 'field'], [0, 1, 'forest'], [1, 1, 'forest'], [2, 1, 'water'],
  [-2, 2, 'ore'], [-1, 2, 'hill'], [0, 2, 'forest'], [1, 2, 'field'],
  [-2, 3, 'ore'], [-1, 3, 'hill'], [0, 3, 'field'],
];
const UNIT_AT = { nexus: [0, 0], settlement: [-2, 0], tower: [2, 0], knight: [1, 1], enemy: [1, 2] };
const HIGHLIGHT = [1, 2];

const hexToWorld = (q, r) => [SQRT3 * (q + r / 2) * TILE_R, 1.5 * r * TILE_R];
const hexKey = (q, r) => `${q},${r}`;

// ----------------------------------------------------------------------------
// Geometry builders
// ----------------------------------------------------------------------------
function buildTileGeometry() {
  const shape = new THREE.Shape();
  for (let i = 0; i < 6; i++) {
    const a = Math.PI / 6 + (i * Math.PI) / 3; // pointy top
    const x = Math.cos(a) * CAP_R, y = Math.sin(a) * CAP_R;
    if (i === 0) shape.moveTo(x, y); else shape.lineTo(x, y);
  }
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: TILE_DEPTH, bevelEnabled: true, bevelThickness: BEVEL, bevelSize: BEVEL, bevelOffset: 0, bevelSegments: 3, curveSegments: 1,
  });
  geo.rotateX(-Math.PI / 2);
  geo.translate(0, BEVEL, 0); // bottom at y=0, top at TILE_H
  return geo;
}

// Pedestal shared by every piece: wide base disc + collar (echoes the SVG silhouettes).
const PEDESTAL = [
  [0, 0], [0.30, 0], [0.30, 0.04], [0.245, 0.10], [0.255, 0.11],
  [0.255, 0.165], [0.215, 0.185],
];
const BAND = () => placed(new THREE.TorusGeometry(0.256, 0.014, 6, 32), 0, 0.14, 0, Math.PI / 2);

function buildMilitia() {
  const body = lathe([...PEDESTAL, [0.19, 0.22], [0.165, 0.32], [0.14, 0.44], [0.13, 0.53], [0.145, 0.585], [0.08, 0.61], [0, 0.61]]);
  const head = placed(new THREE.SphereGeometry(0.135, 18, 12), 0, 0.72, 0);
  return { body: mergeFlat([body, head]), trim: mergeFlat([BAND()]) };
}

function buildNexus() {
  const body = lathe([...PEDESTAL, [0.20, 0.22], [0.17, 0.34], [0.145, 0.48], [0.14, 0.58], [0.155, 0.64], [0.11, 0.67], [0, 0.67]]);
  const parts = [body, placed(new THREE.CylinderGeometry(0.165, 0.13, 0.09, 12), 0, 0.715, 0)];
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * TAU;
    parts.push(placed(new THREE.ConeGeometry(0.036, 0.13, 5), Math.cos(a) * 0.12, 0.76 + 0.065, Math.sin(a) * 0.12));
  }
  parts.push(placed(new THREE.ConeGeometry(0.05, 0.19, 6), 0, 0.76 + 0.095, 0));
  const trim = mergeFlat([
    placed(new THREE.BoxGeometry(0.034, 0.2, 0.034), 0, 1.02, 0),
    placed(new THREE.BoxGeometry(0.13, 0.034, 0.034), 0, 1.07, 0),
    BAND(),
  ]);
  return { body: mergeFlat(parts), trim };
}

function buildTower() {
  const body = lathe([...PEDESTAL, [0.215, 0.22], [0.19, 0.28], [0.175, 0.42], [0.175, 0.58], [0.22, 0.62], [0.22, 0.70], [0.15, 0.70], [0.15, 0.68], [0, 0.68]]);
  const parts = [body];
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * TAU + Math.PI / 6;
    parts.push(placed(new THREE.BoxGeometry(0.075, 0.095, 0.07), Math.cos(a) * 0.175, 0.70 + 0.0475, Math.sin(a) * 0.175, 0, -a, 0));
  }
  const trim = mergeFlat([BAND(), placed(new THREE.TorusGeometry(0.182, 0.012, 6, 32), 0, 0.50, 0, Math.PI / 2)]);
  return { body: mergeFlat(parts), trim };
}

function buildKnight() {
  const lean = 0.34; // neck leans toward +z (the piece's front)
  const body = lathe([...PEDESTAL, [0.20, 0.22], [0.18, 0.30], [0.16, 0.36], [0, 0.36]]);
  const neck = new THREE.BoxGeometry(0.19, 0.36, 0.17);
  neck.translate(0, 0.18, 0).applyMatrix4(new THREE.Matrix4().makeRotationX(lean)).translate(0, 0.30, 0);
  const topY = 0.30 + 0.36 * Math.cos(lean), topZ = 0.36 * Math.sin(lean);
  const head = placed(new THREE.BoxGeometry(0.15, 0.13, 0.31), 0, topY - 0.02, topZ + 0.09, 0.32);
  const muzzle = placed(new THREE.BoxGeometry(0.11, 0.08, 0.10), 0, topY - 0.11, topZ + 0.24, 0.32);
  const earL = placed(new THREE.ConeGeometry(0.028, 0.09, 5), -0.045, topY + 0.07, topZ - 0.02, -0.15);
  const earR = placed(new THREE.ConeGeometry(0.028, 0.09, 5), 0.045, topY + 0.07, topZ - 0.02, -0.15);
  const mane = new THREE.BoxGeometry(0.05, 0.36, 0.05);
  mane.translate(0, 0.18, -0.10).applyMatrix4(new THREE.Matrix4().makeRotationX(lean)).translate(0, 0.31, 0);
  const trim = mergeFlat([mane, BAND()]);
  return { body: mergeFlat([body, neck, head, muzzle, earL, earR]), trim };
}

function gableRoof(w, h, d) {
  const s = new THREE.Shape();
  s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(0, h); s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: false });
  g.translate(0, 0, -d / 2);
  return g;
}

function buildSettlement() {
  const a = { x: -0.11, z: 0.05, ry: -0.18 };
  const b = { x: 0.17, z: -0.16, ry: 0.55 };
  const walls = mergeFlat([
    placed(new THREE.BoxGeometry(0.27, 0.21, 0.23), a.x, 0.105, a.z, 0, a.ry),
    placed(new THREE.BoxGeometry(0.05, 0.12, 0.05), a.x - 0.08, 0.29, a.z - 0.05, 0, a.ry),
    placed(new THREE.BoxGeometry(0.19, 0.15, 0.19), b.x, 0.075, b.z, 0, b.ry),
    placed(new THREE.CylinderGeometry(0.34, 0.36, 0.03, 6), 0.02, 0.015, -0.04, 0, Math.PI / 6), // little plaza
  ]);
  const roofs = mergeFlat([
    placed(gableRoof(0.31, 0.15, 0.27), a.x, 0.21, a.z, 0, a.ry),
    placed(gableRoof(0.23, 0.11, 0.23), b.x, 0.15, b.z, 0, b.ry),
  ]);
  return { body: walls, trim: roofs };
}

function buildFoliage() {
  return mergeFlat([
    placed(new THREE.ConeGeometry(0.16, 0.34, 6), 0, 0.10 + 0.17, 0),
    placed(new THREE.ConeGeometry(0.115, 0.28, 6), 0, 0.10 + 0.32, 0, 0, Math.PI / 6),
  ]);
}
const buildTrunk = () => mergeFlat([placed(new THREE.CylinderGeometry(0.035, 0.045, 0.14, 6), 0, 0.07, 0)]);
const buildRock = () => mergeFlat([new THREE.DodecahedronGeometry(0.12, 0)]);
const buildPeak = () => mergeFlat([
  placed(new THREE.ConeGeometry(0.30, 0.48, 5), 0, 0.24, 0),
  placed(new THREE.ConeGeometry(0.19, 0.30, 5), 0.17, 0.15, -0.11, 0, 0.6),
]);

// ----------------------------------------------------------------------------
// Shaders (ring + dust). Both include three's tone-mapping / colour-space chunks
// so they match the lit materials.
// ----------------------------------------------------------------------------
const RING_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const RING_FRAG = /* glsl */ `
  uniform vec3 uColor; uniform float uTime; uniform float uOpacity;
  varying vec2 vUv;
  float hexDist(vec2 p) { p = abs(p); return max(dot(p, vec2(0.8660254, 0.5)), p.y); }
  void main() {
    vec2 p = (vUv - 0.5) * 2.0;       // -1..1 == +-1.4 world units
    float d = hexDist(p);
    float pulse = 1.0;
    float ring = smoothstep(0.59, 0.64, d) * (1.0 - smoothstep(0.69, 0.745, d));
    float inner = (1.0 - smoothstep(0.30, 0.62, d)) * 0.10;
    float halo = 0.0;
    float a = (ring * 0.95 + inner + halo) * pulse * uOpacity;
    gl_FragColor = vec4(uColor, a);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;
// Soft hexagonal contact shadow under the floating board (the shadow map alone
// reads as a hard offset; this keeps the board visually grounded on any page colour).
const BLOB_FRAG = /* glsl */ `
  uniform vec3 uColor; uniform float uOpacity;
  varying vec2 vUv;
  float hexDist(vec2 p) { p = abs(p); return max(dot(p, vec2(0.8660254, 0.5)), p.y); }
  void main() {
    vec2 p = (vUv - 0.5) * 2.0;
    float d = hexDist(p);
    float a = (1.0 - smoothstep(0.42, 1.0, d)) * uOpacity;
    gl_FragColor = vec4(uColor, a);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;
const DUST_VERT = /* glsl */ `
  attribute float aSize; attribute float aPhase;
  uniform float uTime; uniform float uScale;
  varying float vA;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * uScale / -mv.z;
    vA = 0.5 + 0.5 * sin(uTime * 1.1 + aPhase);
    gl_Position = projectionMatrix * mv;
  }
`;
const DUST_FRAG = /* glsl */ `
  uniform vec3 uColor; uniform float uOpacity;
  varying float vA;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = length(c) * 2.0;
    float a = smoothstep(1.0, 0.2, r) * vA * uOpacity;
    if (a < 0.003) discard;
    gl_FragColor = vec4(uColor, a);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

// ----------------------------------------------------------------------------
// Fallback + capability checks
// ----------------------------------------------------------------------------
function webgl2Available() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGL2RenderingContext && c.getContext('webgl2'));
  } catch (_) { return false; }
}
function fallbackController(canvas, reason) {
  const prev = canvas.style.visibility;
  canvas.style.visibility = 'hidden';
  canvas.dataset.hero = 'fallback';
  canvas.dataset.heroReason = reason;
  return {
    fallback: true,
    reason,
    note: INTERPRETATION_NOTE,
    dispose() { canvas.style.visibility = prev; delete canvas.dataset.hero; delete canvas.dataset.heroReason; },
    setColors() {},
    getStats() { return { calls: 0, triangles: 0, fallback: true, reason }; },
  };
}

// ----------------------------------------------------------------------------
// mountHero
// ----------------------------------------------------------------------------
export function mountHero(canvas, options = {}) {
  const opts = { reducedMotion: false, pixelRatioCap: 2, ...options };
  if (!(canvas instanceof HTMLCanvasElement)) throw new TypeError('mountHero: first argument must be a <canvas>');
  if (opts.reducedMotion) return fallbackController(canvas, 'reduced-motion');
  if (!webgl2Available()) return fallbackController(canvas, 'no-webgl2');

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance', stencil: false });
  } catch (_) {
    return fallbackController(canvas, 'renderer-failed');
  }
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.info.autoReset = false;

  const rng = mulberry32(0x5eed);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(27, 1, 4, 80);
  const disposables = [];
  const track = (o) => { disposables.push(o); return o; };

  // --- environment (neutral, procedural; gives the PBR materials something to reflect)
  {
    const pmrem = new THREE.PMREMGenerator(renderer);
    const env = new THREE.Scene();
    const box = new THREE.Mesh(new THREE.BoxGeometry(12, 12, 12), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.35, 0.35, 0.37), side: THREE.BackSide }));
    env.add(box);
    const panel = (w, h, color, x, y, z, rx, ry) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide }));
      m.position.set(x, y, z); m.rotation.set(rx, ry, 0); env.add(m);
    };
    panel(6, 6, new THREE.Color(2.4, 2.3, 2.2), 0, 5.9, 0, Math.PI / 2, 0);   // ceiling key
    panel(3, 8, new THREE.Color(1.1, 1.15, 1.3), -5.9, 1, 0, 0, Math.PI / 2); // cool side
    panel(8, 3, new THREE.Color(0.9, 0.8, 0.7), 0, 1, -5.9, 0, 0);            // warm back
    panel(12, 12, new THREE.Color(0.12, 0.12, 0.12), 0, -5.9, 0, -Math.PI / 2, 0); // dark floor
    const rt = pmrem.fromScene(env, 0.04);
    scene.environment = rt.texture;
    scene.environmentIntensity = 0.55;
    env.traverse((o) => { if (o.isMesh) { o.geometry.dispose(); o.material.dispose(); } });
    pmrem.dispose();
    disposables.push(rt);
  }

  // --- lights
  const key = new THREE.DirectionalLight(0xffffff, 2.9);
  key.position.set(-7, 9, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -8; key.shadow.camera.right = 8;
  key.shadow.camera.top = 8; key.shadow.camera.bottom = -8;
  key.shadow.camera.near = 2; key.shadow.camera.far = 30;
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.025;
  const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
  const rim = new THREE.DirectionalLight(0xffffff, 1.1);
  rim.position.set(6, 4, -8);
  const fill = new THREE.DirectionalLight(0xffffff, 0.5); // lifts the camera-facing walls
  fill.position.set(8, 3, 5);
  const glowLight = new THREE.PointLight(0xffffff, 4, 3.6, 2);
  glowLight.userData.base = 4;
  scene.add(key, key.target, hemi, rim, fill, glowLight);

  // --- materials
  const white = 0xffffff;
  const mats = {
    land: track(new THREE.MeshStandardMaterial({ color: white, roughness: 0.86, metalness: 0.0 })),
    water: track(new THREE.MeshStandardMaterial({ color: white, roughness: 0.22, metalness: 0.05 })),
    body: track(new THREE.MeshStandardMaterial({ color: white, roughness: 0.55, metalness: 0.0 })),
    trim: track(new THREE.MeshStandardMaterial({ color: white, roughness: 0.32, metalness: 0.65 })),
    enemyBody: track(new THREE.MeshStandardMaterial({ color: white, roughness: 0.5, metalness: 0.0 })),
    enemyTrim: track(new THREE.MeshStandardMaterial({ color: white, roughness: 0.4, metalness: 0.4 })),
    foliage: track(new THREE.MeshStandardMaterial({ color: white, roughness: 0.9 })),
    trunk: track(new THREE.MeshStandardMaterial({ color: white, roughness: 0.9 })),
    rock: track(new THREE.MeshStandardMaterial({ color: white, roughness: 0.8 })),
    peak: track(new THREE.MeshStandardMaterial({ color: white, roughness: 0.7, metalness: 0.08 })),
    shadow: track(new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.3, transparent: true })),
    lines: track(new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.9, depthWrite: false })),
    ring: track(new THREE.ShaderMaterial({
      uniforms: { uColor: { value: new THREE.Color(white) }, uTime: { value: 0 }, uOpacity: { value: 1 } },
      vertexShader: RING_VERT, fragmentShader: RING_FRAG, transparent: true, depthWrite: false, side: THREE.DoubleSide,
    })),
    blob: track(new THREE.ShaderMaterial({
      uniforms: { uColor: { value: new THREE.Color(0) }, uOpacity: { value: 0.3 } },
      vertexShader: RING_VERT, fragmentShader: BLOB_FRAG, transparent: true, depthWrite: false,
    })),
    dust: track(new THREE.ShaderMaterial({
      uniforms: { uColor: { value: new THREE.Color(white) }, uTime: { value: 0 }, uScale: { value: 400 }, uOpacity: { value: 0.7 } },
      vertexShader: DUST_VERT, fragmentShader: DUST_FRAG, transparent: true, depthWrite: false,
    })),
  };

  // --- board group (everything that tilts with the pointer)
  const board = new THREE.Group();
  scene.add(board);

  const tiles = MAP.map(([q, r, kind], i) => {
    const [x, z] = hexToWorld(q, r);
    const scaleY = KIND_SCALE[kind] * (1 + (rng() - 0.5) * 0.06);
    return {
      i, q, r, kind, x, z, scaleY,
      top: TILE_H * scaleY,
      phase: rng() * TAU, breatheHz: 0.22 + rng() * 0.16,
      jitter: (rng() - 0.5) * 0.06,
      lift: 0, liftTarget: 0,
      y: 0,
      isHighlight: q === HIGHLIGHT[0] && r === HIGHLIGHT[1],
      instance: -1, mesh: null,
    };
  });
  const tileByKey = new Map(tiles.map((t) => [hexKey(t.q, t.r), t]));
  const centroid = tiles.reduce((a, t) => { a.x += t.x / tiles.length; a.z += t.z / tiles.length; return a; }, { x: 0, z: 0 });
  const centroidV = new THREE.Vector3(centroid.x, 0, centroid.z);

  const tileGeo = track(buildTileGeometry());
  const landTiles = tiles.filter((t) => t.kind !== 'water');
  const waterTiles = tiles.filter((t) => t.kind === 'water');
  const landMesh = new THREE.InstancedMesh(tileGeo, mats.land, landTiles.length);
  const waterMesh = new THREE.InstancedMesh(tileGeo, mats.water, waterTiles.length);
  landMesh.castShadow = true; landMesh.receiveShadow = true;
  waterMesh.receiveShadow = true;
  landTiles.forEach((t, k) => { t.instance = k; t.mesh = landMesh; });
  waterTiles.forEach((t, k) => { t.instance = k; t.mesh = waterMesh; });
  landMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  waterMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  board.add(landMesh, waterMesh);

  // Lighter inset cap on every land tile: the game's tiles have an inner hex, and
  // it gives the tops a second value step so they do not read as flat colour chips.
  const insetGeo = track((() => {
    const s = new THREE.Shape();
    for (let i = 0; i < 6; i++) {
      const a = Math.PI / 6 + (i * Math.PI) / 3;
      if (i === 0) s.moveTo(Math.cos(a) * 0.72, Math.sin(a) * 0.72); else s.lineTo(Math.cos(a) * 0.72, Math.sin(a) * 0.72);
    }
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.012, bevelEnabled: false, curveSegments: 1 });
    g.rotateX(-Math.PI / 2);
    return g;
  })());
  const insetMesh = new THREE.InstancedMesh(insetGeo, mats.land, landTiles.length);
  insetMesh.receiveShadow = true;
  insetMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  board.add(insetMesh);

  // --- props (instanced, ride on their tile)
  const props = []; // { mesh, index, tile, x, z, ry, s, sy, sink }
  const propMeshes = [];
  function makeProps(geo, mat, list, castShadow) {
    const mesh = new THREE.InstancedMesh(track(geo), mat, Math.max(1, list.length));
    mesh.castShadow = castShadow; mesh.receiveShadow = true;
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    list.forEach((p, k) => { p.mesh = mesh; p.index = k; props.push(p); });
    mesh.count = list.length;
    board.add(mesh);
    propMeshes.push(mesh);
    return mesh;
  }
  const unitKeys = new Set(Object.values(UNIT_AT).map(([q, r]) => hexKey(q, r)));
  const scatter = (tile, count, minDist, radius) => {
    const out = [];
    let guard = 0;
    while (out.length < count && guard++ < 200) {
      const a = rng() * TAU, d = Math.sqrt(rng()) * radius;
      const x = Math.cos(a) * d, z = Math.sin(a) * d;
      if (out.every((o) => Math.hypot(o.x - x, o.z - z) >= minDist)) out.push({ tile, x, z, ry: rng() * TAU, s: 0.85 + rng() * 0.3, sy: 1, sink: 0 });
    }
    return out;
  };
  const treeList = [], rockList = [], peakList = [];
  for (const t of tiles) {
    if (unitKeys.has(hexKey(t.q, t.r))) continue;
    if (t.kind === 'forest') treeList.push(...scatter(t, 3, 0.36, 0.5));
    if (t.kind === 'hill') rockList.push(...scatter(t, 2, 0.34, 0.42).map((p) => ({ ...p, sy: 0.7, sink: 0.045, s: 1.0 + rng() * 0.6 })));
    if (t.kind === 'ore') peakList.push({ tile: t, x: (rng() - 0.5) * 0.3, z: (rng() - 0.5) * 0.3, ry: rng() * TAU, s: 0.9 + rng() * 0.2, sy: 1, sink: 0.02 });
  }
  const trunkList = treeList.map((p) => ({ ...p }));
  makeProps(buildFoliage(), mats.foliage, treeList, true);
  makeProps(buildTrunk(), mats.trunk, trunkList, false);
  makeProps(buildRock(), mats.rock, rockList, false);
  makeProps(buildPeak(), mats.peak, peakList, true);

  // --- units
  const units = []; // { group, tile, name }
  const UNIT_SCALE = 1.4;
  function addUnit(name, builder, bodyMat, trimMat, yaw = 0, scale = UNIT_SCALE) {
    const [q, r] = UNIT_AT[name];
    const tile = tileByKey.get(hexKey(q, r));
    const { body, trim } = builder();
    const g = new THREE.Group();
    const bm = new THREE.Mesh(track(body), bodyMat); bm.castShadow = true; bm.receiveShadow = true;
    const tm = new THREE.Mesh(track(trim), trimMat); tm.castShadow = true;
    g.add(bm, tm);
    g.rotation.y = yaw;
    g.scale.setScalar(scale);
    board.add(g);
    units.push({ group: g, tile, name });
    return g;
  }
  addUnit('nexus', buildNexus, mats.body, mats.trim, 0.2);
  addUnit('settlement', buildSettlement, mats.body, mats.trim, 0.3, 1.55);
  addUnit('tower', buildTower, mats.body, mats.trim, 0);
  addUnit('knight', buildKnight, mats.body, mats.trim, 1.5); // three-quarter profile toward the camera
  addUnit('enemy', buildMilitia, mats.enemyBody, mats.enemyTrim, 0);

  // --- highlight ring (hex SDF shader) sits just above the highlighted tile
  const hlTile = tileByKey.get(hexKey(HIGHLIGHT[0], HIGHLIGHT[1]));
  const ring = new THREE.Mesh(track(new THREE.PlaneGeometry(2.8, 2.8).rotateX(-Math.PI / 2)), mats.ring);
  ring.renderOrder = 2;
  board.add(ring);

  // --- dust motes
  const DUST_N = 150;
  const dustPos = new Float32Array(DUST_N * 3);
  const dustSize = new Float32Array(DUST_N);
  const dustPhase = new Float32Array(DUST_N);
  const dustDrift = new Float32Array(DUST_N);
  for (let i = 0; i < DUST_N; i++) {
    const a = rng() * TAU, d = Math.sqrt(rng()) * 5.6;
    dustPos[i * 3] = centroid.x + Math.cos(a) * d;
    dustPos[i * 3 + 1] = 0.5 + rng() * 3.2;
    dustPos[i * 3 + 2] = centroid.z + Math.sin(a) * d;
    dustSize[i] = 0.03 + rng() * 0.05;
    dustPhase[i] = rng() * TAU;
    dustDrift[i] = 0.05 + rng() * 0.07;
  }
  const dustGeo = track(new THREE.BufferGeometry());
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3).setUsage(THREE.DynamicDrawUsage));
  dustGeo.setAttribute('aSize', new THREE.BufferAttribute(dustSize, 1));
  dustGeo.setAttribute('aPhase', new THREE.BufferAttribute(dustPhase, 1));
  const dust = new THREE.Points(dustGeo, mats.dust);
  dust.frustumCulled = false; // kept allocated but not added: ambient particles read as specks on the page

  // --- ground: soft contact shadow + ghost grid suggesting the map continues
  const GROUND_Y = -0.55;
  const ground = new THREE.Mesh(track(new THREE.PlaneGeometry(60, 60).rotateX(-Math.PI / 2)), mats.shadow);
  ground.position.y = GROUND_Y;
  ground.receiveShadow = true;
  scene.add(ground);
  const blob = new THREE.Mesh(track(new THREE.PlaneGeometry(15, 15).rotateX(-Math.PI / 2)), mats.blob);
  blob.position.set(centroid.x + 0.25, GROUND_Y + 0.006, centroid.z + 0.1);
  blob.renderOrder = -1;
  scene.add(blob);

  const ghost = []; // { q, r, dist }
  for (let q = -5; q <= 5; q++) for (let r = -5; r <= 5; r++) {
    const s = -q - r;
    const dist = Math.max(Math.abs(q), Math.abs(r), Math.abs(s));
    if (dist > 5 || tileByKey.has(hexKey(q, r))) continue;
    ghost.push({ q, r, dist });
  }
  const linePos = new Float32Array(ghost.length * 12 * 3);
  const lineCol = new Float32Array(ghost.length * 12 * 3);
  {
    let o = 0;
    for (const g of ghost) {
      const [cx, cz] = hexToWorld(g.q, g.r);
      for (let i = 0; i < 6; i++) {
        for (const k of [i, i + 1]) {
          const a = Math.PI / 6 + (k * Math.PI) / 3;
          linePos[o++] = cx + Math.cos(a) * 0.94; linePos[o++] = GROUND_Y + 0.012; linePos[o++] = cz + Math.sin(a) * 0.94;
        }
      }
    }
  }
  const lineGeo = track(new THREE.BufferGeometry());
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
  lineGeo.setAttribute('color', new THREE.BufferAttribute(lineCol, 3));
  const lines = new THREE.LineSegments(lineGeo, mats.lines);
  scene.add(lines);

  // --- palette
  const palette = { bg: '#101114', accent: '#e0a458', ink: '#ece7dc', surface: '#23262e' };
  const tileColor = new THREE.Color();
  function applyPalette() {
    const bg = toColor(palette.bg, '#101114');
    const accent = toColor(palette.accent, '#e0a458');
    const ink = toColor(palette.ink, '#ece7dc');
    const surface = toColor(palette.surface, '#23262e');
    const dark = hslOf(bg).l < 0.5;
    // Terrain hues are offsets from the accent (analogous field, triadic forest,
    // complementary water, split ore) pulled most of the way back toward `surface`
    // so the board reads as one designed object rather than a rainbow.
    const S = dark ? 0.45 : 0.75;  // saturation multiplier
    const A = dark ? 0.38 : 0.55;  // how far a tile leaves `surface` toward its hue
    const tints = {
      field: mix(surface, shift(accent, 0.075, S, dark ? -0.06 : 0.12), A),
      forest: mix(surface, shift(accent, 0.27, S * 0.9, dark ? -0.10 : -0.06), A),
      hill: mix(surface, ink, dark ? 0.10 : 0.17),
      ore: mix(mix(surface, ink, dark ? 0.12 : 0.2), shift(accent, 0.55, S * 0.45, dark ? -0.06 : -0.02), dark ? 0.3 : 0.35),
      water: mix(surface, shift(accent, 0.52, S * 1.05, dark ? -0.02 : 0.06), dark ? 0.45 : 0.6),
    };
    for (const t of tiles) {
      tileColor.copy(tints[t.kind]);
      if (t.isHighlight) tileColor.lerp(accent, 0.5);
      const h = hslOf(tileColor);
      tileColor.setHSL(h.h, h.s, clamp(h.l + t.jitter * 0.5, 0, 1), THREE.SRGBColorSpace);
      t.mesh.setColorAt(t.instance, tileColor);
      if (t.kind !== 'water') {
        tileColor.setHSL(h.h, h.s * 0.92, clamp(h.l + (dark ? 0.045 : 0.05), 0, 1), THREE.SRGBColorSpace);
        insetMesh.setColorAt(t.instance, tileColor);
      }
    }
    landMesh.instanceColor.needsUpdate = true;
    waterMesh.instanceColor.needsUpdate = true;
    insetMesh.instanceColor.needsUpdate = true;
    mats.blob.uniforms.uColor.value.copy(bg.clone().multiplyScalar(0.22));
    mats.blob.uniforms.uOpacity.value = dark ? 0.55 : 0.22;

    mats.body.color.copy(mix(ink, surface, 0.12));
    mats.trim.color.copy(accent);
    mats.enemyBody.color.copy(accent);
    mats.enemyTrim.color.copy(mix(ink, surface, 0.2));
    mats.foliage.color.copy(shift(tints.forest, 0, dark ? 1.5 : 1.7, dark ? -0.07 : -0.16));
    mats.trunk.color.copy(mix(surface, ink, 0.35));
    mats.rock.color.copy(mix(surface, ink, dark ? 0.24 : 0.32));
    mats.peak.color.copy(mix(mix(surface, ink, 0.42), accent, 0.06));
    mats.shadow.color.copy(bg.clone().multiplyScalar(0.22));
    mats.shadow.opacity = dark ? 0.6 : 0.3;
    mats.ring.uniforms.uColor.value.copy(dark ? accent : shift(accent, 0, 1.05, -0.04));
    mats.dust.uniforms.uColor.value.copy(mix(accent, ink, 0.25));
    mats.dust.uniforms.uOpacity.value = dark ? 0.75 : 0.55;

    key.color.copy(mix(new THREE.Color(0xffffff), accent, 0.1));
    hemi.color.copy(mix(bg, new THREE.Color(0xffffff), dark ? 0.55 : 0.4));
    hemi.groundColor.copy(mix(surface, bg, 0.5));
    hemi.intensity = dark ? 1.1 : 0.9;
    rim.color.copy(mix(new THREE.Color(0xffffff), accent, 0.5));
    fill.color.copy(mix(new THREE.Color(0xffffff), bg, 0.3));
    fill.intensity = dark ? 0.7 : 0.35;
    glowLight.color.copy(accent);
    glowLight.userData.base = dark ? 2.5 : 1.5;

    const near = mix(bg, ink, dark ? 0.16 : 0.2), far = mix(bg, ink, 0);
    let o = 0;
    for (const g of ghost) {
      const c = mix(near, far, clamp((g.dist - 3) / 1.5, 0, 1));
      for (let k = 0; k < 12; k++) { lineCol[o++] = c.r; lineCol[o++] = c.g; lineCol[o++] = c.b; }
    }
    lineGeo.attributes.color.needsUpdate = true;
  }
  applyPalette();

  // --- camera fit
  const target = new THREE.Vector3(centroid.x, 0.35, centroid.z + 0.15);
  const AZ0 = 0.58, EL0 = 0.62; // three-quarter view from the front-right
  let camDist = 20;
  const camDir = new THREE.Vector3();
  const dirFrom = (az, el, out) => out.set(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el));
  const fitPoints = [];
  for (const t of tiles) {
    const top = t.top + 0.05;
    for (let i = 0; i < 6; i++) {
      const a = Math.PI / 6 + (i * Math.PI) / 3;
      fitPoints.push(new THREE.Vector3(t.x + Math.cos(a) * 0.97, top, t.z + Math.sin(a) * 0.97));
      fitPoints.push(new THREE.Vector3(t.x + Math.cos(a) * 0.97, 0, t.z + Math.sin(a) * 0.97));
    }
  }
  for (const u of units) fitPoints.push(new THREE.Vector3(u.tile.x, u.tile.top + 1.15 * u.group.scale.x, u.tile.z));

  function fitCamera(w, h) {
    camera.aspect = w / h;
    const margin = w < 600 ? 0.02 : 0.04;
    const tanV = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
    const tanH = tanV * camera.aspect;
    dirFrom(AZ0, EL0, camDir);
    const q = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().lookAt(camDir, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0)));
    const inv = q.clone().invert();
    const v = new THREE.Vector3();
    let d = 0;
    for (const p of fitPoints) {
      v.copy(p).sub(target).applyQuaternion(inv); // camera-local: x right, y up, -z forward
      const along = -v.z; // >0 means the point sits between target and camera
      d = Math.max(d, along + Math.abs(v.x) / ((1 - margin) * tanH), along + Math.abs(v.y) / ((1 - margin) * tanV));
    }
    camDist = clamp(d, 8, 60);
    camera.updateProjectionMatrix();
  }

  // --- pointer
  const host = opts.pointerTarget || canvas.parentElement || canvas;
  const ptrTarget = { x: 0, y: 0, inside: false };
  const ptr = { x: 0, y: 0 };
  let ptrDirty = false;
  const ndc = new THREE.Vector2();
  function onPointerMove(e) {
    const r = canvas.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
    const ny = -(((e.clientY - r.top) / r.height) * 2 - 1);
    ptrTarget.x = clamp(nx, -1, 1);
    ptrTarget.y = clamp(ny, -1, 1);
    ptrTarget.inside = nx >= -1 && nx <= 1 && ny >= -1 && ny <= 1;
    ndc.set(nx, ny);
    ptrDirty = true;
    schedule();
  }
  function onPointerLeave() { ptrTarget.x = 0; ptrTarget.y = 0; ptrTarget.inside = false; ptrDirty = true; schedule(); }
  host.addEventListener('pointermove', onPointerMove, { passive: true });
  host.addEventListener('pointerleave', onPointerLeave, { passive: true });

  // Nearest tile under the pointer: project the pointer ray onto the (tilted) board
  // plane and take the closest tile centre. No mesh raycast needed.
  const raycaster = new THREE.Raycaster();
  const boardPlane = new THREE.Plane();
  const planeNormal = new THREE.Vector3(), planePoint = new THREE.Vector3(), hitPoint = new THREE.Vector3();
  let hovered = null;
  function pickTile() {
    if (!ptrTarget.inside) { hovered = null; return; }
    raycaster.setFromCamera(ndc, camera);
    board.updateMatrixWorld();
    planeNormal.set(0, 1, 0).applyQuaternion(board.quaternion);
    planePoint.set(centroid.x, TILE_H, centroid.z).applyMatrix4(board.matrixWorld);
    boardPlane.setFromNormalAndCoplanarPoint(planeNormal, planePoint);
    if (!raycaster.ray.intersectPlane(boardPlane, hitPoint)) { hovered = null; return; }
    board.worldToLocal(hitPoint);
    let best = null, bestD = 1.35;
    for (const t of tiles) {
      const d = Math.hypot(t.x - hitPoint.x, t.z - hitPoint.z);
      if (d < bestD) { bestD = d; best = t; }
    }
    hovered = best;
  }

  // --- sizing
  let width = 1, height = 1;
  function resize() {
    const w = Math.max(1, Math.round(canvas.clientWidth || host.clientWidth || 1));
    const h = Math.max(1, Math.round(canvas.clientHeight || host.clientHeight || 1));
    const dpr = Math.min(window.devicePixelRatio || 1, opts.pixelRatioCap ?? 2, 2);
    if (w === width && h === height && renderer.getPixelRatio() === dpr) return;
    width = w; height = h;
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    fitCamera(w, h);
    mats.dust.uniforms.uScale.value = (h * dpr) / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2));
    const shadowRes = w * dpr > 1400 ? 2048 : 1024;
    if (key.shadow.mapSize.x !== shadowRes) {
      key.shadow.mapSize.set(shadowRes, shadowRes);
      if (key.shadow.map) { key.shadow.map.dispose(); key.shadow.map = null; }
    }
    schedule();
  }
  const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => resize()) : null;
  if (ro) ro.observe(canvas); else window.addEventListener('resize', resize);

  // --- visibility gating
  let onScreen = true, pageVisible = !document.hidden, disposed = false, rafId = 0;
  const running = () => onScreen && pageVisible && !disposed;
  const io = typeof IntersectionObserver !== 'undefined'
    ? new IntersectionObserver((entries) => { onScreen = entries.some((e) => e.isIntersecting); if (onScreen) schedule(); }, { threshold: 0 })
    : null;
  if (io) io.observe(canvas);
  function onVis() { pageVisible = !document.hidden; if (pageVisible) schedule(); }
  document.addEventListener('visibilitychange', onVis);
  function onLost(e) { e.preventDefault(); }
  canvas.addEventListener('webglcontextlost', onLost);

  function schedule() { if (!rafId && running()) rafId = requestAnimationFrame(frame); }

  // --- per-frame
  const tileMat = new THREE.Matrix4(), tmpPos = new THREE.Vector3(), tmpQ = new THREE.Quaternion(), tmpS = new THREE.Vector3(), tmpE = new THREE.Euler();
  const qTilt = new THREE.Quaternion(), qA = new THREE.Quaternion(), axisR = new THREE.Vector3(), axisF = new THREE.Vector3(), tmpC = new THREE.Vector3();
  const t0 = performance.now();
  let last = t0;
  let frames = 0;
  const TILT = THREE.MathUtils.degToRad(4.5);

  function frame(now) {
    rafId = 0;
    if (!running()) return;
    const t = (now - t0) / 1000;
    const dt = clamp((now - last) / 1000, 0, 0.05);
    last = now;
    frames++;

    // pointer easing
    ptr.x = damp(ptr.x, ptrTarget.x, 5, dt);
    ptr.y = damp(ptr.y, ptrTarget.y, 5, dt);
    if (ptrDirty) { pickTile(); ptrDirty = false; }

    // camera drift (a slow wander, never a spin) + a touch of parallax
    const az = AZ0 + 0.035 * Math.sin(t * 0.11) + ptr.x * 0.03;
    const el = EL0 + 0.018 * Math.sin(t * 0.073 + 1.3) - ptr.y * 0.02;
    dirFrom(az, el, camDir);
    camera.position.copy(target).addScaledVector(camDir, camDist);
    camera.lookAt(target);

    // board tilt toward the cursor, around camera-relative ground axes, about the centroid
    axisR.set(1, 0, 0).applyQuaternion(camera.quaternion); axisR.y = 0; axisR.normalize();
    axisF.set(0, 0, -1).applyQuaternion(camera.quaternion); axisF.y = 0; axisF.normalize();
    qTilt.setFromAxisAngle(axisR, -ptr.y * TILT * 0.75);
    qA.setFromAxisAngle(axisF, ptr.x * TILT);
    qTilt.multiply(qA);
    board.quaternion.slerp(qTilt, 1 - Math.exp(-8 * dt));
    board.position.copy(centroidV).sub(tmpC.copy(centroidV).applyQuaternion(board.quaternion));

    // tiles: breathe + lift
    for (const tile of tiles) {
      tile.liftTarget = (tile === hovered ? 0.2 : 0) + (tile.isHighlight ? 0.05 + 0.012 * Math.sin(t * 2.2) : 0);
      tile.lift = damp(tile.lift, tile.liftTarget, 9, dt);
      tile.y = 0.008 * Math.sin(t * tile.breatheHz * TAU + tile.phase) + tile.lift;
      tmpPos.set(tile.x, tile.y, tile.z); tmpS.set(1, tile.scaleY, 1);
      tileMat.compose(tmpPos, tmpQ.identity(), tmpS);
      tile.mesh.setMatrixAt(tile.instance, tileMat);
      if (tile.mesh === landMesh) {
        tmpPos.y += tile.top; tmpS.set(1, 1, 1);
        tileMat.compose(tmpPos, tmpQ, tmpS);
        insetMesh.setMatrixAt(tile.instance, tileMat);
      }
    }
    landMesh.instanceMatrix.needsUpdate = true;
    waterMesh.instanceMatrix.needsUpdate = true;
    insetMesh.instanceMatrix.needsUpdate = true;

    for (const p of props) {
      const ty = p.tile.y + p.tile.top - p.sink;
      tmpPos.set(p.tile.x + p.x, ty, p.tile.z + p.z);
      tmpQ.setFromEuler(tmpE.set(0, p.ry, 0));
      tmpS.set(p.s, p.s * p.sy, p.s);
      tileMat.compose(tmpPos, tmpQ, tmpS);
      p.mesh.setMatrixAt(p.index, tileMat);
    }
    for (const m of propMeshes) m.instanceMatrix.needsUpdate = true;

    for (const u of units) u.group.position.set(u.tile.x, u.tile.y + u.tile.top, u.tile.z);

    ring.position.set(hlTile.x, hlTile.y + hlTile.top + 0.012, hlTile.z);
    mats.ring.uniforms.uTime.value = t;
    glowLight.position.set(hlTile.x, hlTile.y + hlTile.top + 0.9, hlTile.z).applyQuaternion(board.quaternion).add(board.position);
    glowLight.intensity = glowLight.userData.base;


    renderer.info.reset();
    renderer.render(scene, camera);
    schedule();
  }

  resize();
  schedule();

  return {
    fallback: false,
    note: INTERPRETATION_NOTE,
    setColors(colors = {}) {
      for (const k of ['bg', 'accent', 'ink', 'surface']) if (colors[k] != null) palette[k] = colors[k];
      applyPalette();
      schedule();
    },
    getStats() {
      const r = renderer.info.render, m = renderer.info.memory;
      return { calls: r.calls, triangles: r.triangles, points: r.points, lines: r.lines, geometries: m.geometries, textures: m.textures, frames, width, height, dpr: renderer.getPixelRatio() };
    },
    dispose() {
      disposed = true;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
      host.removeEventListener('pointermove', onPointerMove);
      host.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVis);
      canvas.removeEventListener('webglcontextlost', onLost);
      window.removeEventListener('resize', resize);
      if (ro) ro.disconnect();
      if (io) io.disconnect();
      for (const d of disposables) if (d && typeof d.dispose === 'function') d.dispose();
      scene.traverse((o) => { if (o.isInstancedMesh) o.dispose(); });
      if (key.shadow.map) key.shadow.map.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}

export default mountHero;
