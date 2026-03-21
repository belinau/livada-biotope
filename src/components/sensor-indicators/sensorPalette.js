/**
 * sensorPalette.js
 * Shared colour constants and tiny helpers for all seven sensor indicator components.
 *
 * PALETTE — four semantic colours only:
 *   V   violet       wind, compass, all chrome
 *   C   cyan-teal    water: soil moisture, air humidity
 *   A   amber-coral  heat:  soil temperature, air temperature
 *   TG  teal-green   PAX WiFi
 *   VP  violet-pale  PAX BLE / labels
 */

export const V  = [139,  92, 246];
export const C  = [ 56, 189, 196];
export const A  = [234, 140,  60];
export const TG = [ 94, 210, 172];
export const VP = [167, 139, 250];

/** rgba string from a palette colour + alpha */
export const rc = (col, a) =>
  `rgba(${col[0]},${col[1]},${col[2]},${a})`;

/** Linear interpolation */
export const lerp = (a, b, t) => a + (b - a) * t;

/** Lerp between two [r,g,b] triples, return [r,g,b] */
export const lerp3 = (c1, c2, t) => [
  lerp(c1[0], c2[0], t) | 0,
  lerp(c1[1], c2[1], t) | 0,
  lerp(c1[2], c2[2], t) | 0,
];

/** Clamp v between lo and hi */
export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/**
 * Seeded, repeatable pseudo-random number generator.
 * Returns a function () => [0,1).
 */
export function mkRng(seed) {
  let s = (Math.abs(seed) % 2_147_483_647) || 1;
  return () => {
    s = (s * 16_807) % 2_147_483_647;
    return (s - 1) / 2_147_483_646;
  };
}

/**
 * Create a same-size offscreen canvas, used for trail-persistence effects
 * without any opaque background.
 */
export function makeOffscreen(w, h) {
  const oc = document.createElement('canvas');
  oc.width  = w;
  oc.height = h;
  return oc;
}

/** Ambient loop tick counter — shared mutable ref pattern for rAF loops */
export const PI2 = Math.PI * 2;

/**
 * Shared boids physics step.
 *
 * @param {object[]} ps      – particle array (each has x,y,vx,vy,phase)
 * @param {number}   active  – how many particles to update (slice from front)
 * @param {number}   W,H     – canvas dimensions
 * @param {object}   opts    – { maxSpd, cohR, sepR, aliR, pull, jitter, damping, cx, cy }
 * @param {number}   frame   – current frame index (for organic wobble)
 */
export function flockStep(ps, active, W, H, opts, frame) {
  const { maxSpd, cohR, sepR, aliR = 35, pull = 0,
          jitter = 0, damping = 1, cx = W/2, cy = H/2 } = opts;

  const slice = ps.slice(0, active);
  slice.forEach((p, pi) => {
    let sx = 0, sy = 0, ax = 0, ay = 0, chx = 0, chy = 0, an = 0, cn = 0;

    slice.forEach((o, oi) => {
      if (oi === pi) return;
      const dx = p.x - o.x, dy = p.y - o.y;
      const d = Math.sqrt(dx * dx + dy * dy) || 0.1;
      if (d < sepR) { sx += dx / d; sy += dy / d; }
      if (d < aliR) { ax += o.vx; ay += o.vy; an++; }
      if (d < cohR) { chx += o.x; chy += o.y; cn++; }
    });

    if (an) { ax /= an; ay /= an; }
    if (cn) { chx = chx / cn - p.x; chy = chy / cn - p.y; }

    // Organic sine wobble — gives each particle its own breathing rhythm
    p.vx += sx * 0.035 + ax * 0.009 + chx * 0.005
          + (cx - p.x) * pull
          + Math.sin(frame * 0.009 + p.phase) * 0.005
          + (Math.random() - 0.5) * jitter;
    p.vy += sy * 0.035 + ay * 0.009 + chy * 0.005
          + (cy - p.y) * pull
          + Math.cos(frame * 0.008 + p.phase + 1) * 0.005
          + (Math.random() - 0.5) * jitter;

    if (damping !== 1) { p.vx *= damping; p.vy *= damping; }

    const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy) || 0.1;
    if (spd > maxSpd) { p.vx = p.vx / spd * maxSpd; p.vy = p.vy / spd * maxSpd; }

    // Soft boundary repulsion
    const mg = 10;
    if (p.x < mg)     p.vx += 0.012;
    if (p.x > W - mg) p.vx -= 0.012;
    if (p.y < mg)     p.vy += 0.012;
    if (p.y > H - mg) p.vy -= 0.012;

    p.x += p.vx;
    p.y += p.vy;
  });
}
