import React, { useEffect, useRef, useCallback } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { C, lerp, clamp, rc, mkRng, makeOffscreen, PI2 } from './sensorPalette';

const MAX_HYPHAE = 52;

function spawnHypha(hyphae, px, py, angle, depth, rng) {
  if (depth > 8 || hyphae.length >= MAX_HYPHAE) return;
  hyphae.push({
    pts:       [{ x: px, y: py }],
    angle,
    depth,
    // Each hypha grows one point every growEvery frames — deeper = slower
    growEvery: 22 + depth * 10,
    growTimer: Math.floor(rng() * 22),
    stepLen:   2.1 - depth * 0.15,
    wobble:    (rng() - 0.5) * 0.055,
    maxPts:    Math.floor(7 + rng() * 16 * (1 - depth / 9)),
    branchAt:  Math.floor(4 + rng() * 5),
    branched:  false,
    done:      false,
    alpha:     0.78 - depth * 0.07,
    rng,
  });
}

function seedNetwork(cx, cy) {
  const hyphae = [];
  const rng    = mkRng(42);
  for (let i = 0; i < 7; i++) {
    spawnHypha(hyphae, cx, cy, (i / 7) * PI2 + rng() * 0.2, 0, mkRng(i * 31 + 7));
  }
  return hyphae;
}

/**
 * SoilMoistureIndicator
 *
 * Visual: mycelium network that grows from a single central origin,
 * tip-by-tip, one new point every 22+ frames. Moisture governs how far
 * threads can extend and how densely they branch. The network draws
 * permanently onto an offscreen accumulator (no opaque bg) so threads
 * persist and new ones grow on top.
 *
 * Improvement: anastomosis glow (where two tips meet) now also draws onto
 * the accumulator permanently, and the origin pulse brightness scales
 * with moisture so dry soil has a dim, barely-alive source dot.
 *
 * Props:
 *   soilMoisture {number|null}  %
 *   lastUpdated  {Date|null}
 */
const SoilMoistureIndicator = ({ soilMoisture = null, lastUpdated = null }) => {
  const { t, language } = useTranslation();
  const canvasRef  = useRef(null);
  const frameRef   = useRef(0);
  const rafRef     = useRef(null);
  const hyphaeRef  = useRef(null);
  const offRef     = useRef(null);
  const resetFlag  = useRef(false);
  const dimRef     = useRef({ W: 160, H: 150, cx: 80, cy: 70 });

  const fmt = useCallback((n) => {
    if (n === null || n === undefined || isNaN(n)) return '—';
    const s = Number(n).toFixed(1);
    return language === 'sl' ? s.replace('.', ',') : s;
  }, [language]);

  const doReset = useCallback(() => {
    const { cx, cy }  = dimRef.current;
    hyphaeRef.current  = seedNetwork(cx, cy);
    if (offRef.current) {
      offRef.current.getContext('2d').clearRect(0, 0, offRef.current.width, offRef.current.height);
    }
    resetFlag.current = false;
  }, []);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const W  = cv.width;
    const H  = cv.height;
    const cx = W / 2;
    const cy = Math.floor(H * 0.47);

    dimRef.current = { W, H, cx, cy };

    if (!hyphaeRef.current) hyphaeRef.current = seedNetwork(cx, cy);
    if (!offRef.current)    offRef.current    = makeOffscreen(W, H);

    const oc   = offRef.current;
    const octx = oc.getContext('2d');
    const ctx  = cv.getContext('2d');

    function growStep(pct) {
      const hyphae   = hyphaeRef.current;
      const maxActive = Math.floor(3 + pct * MAX_HYPHAE * 0.75);

      hyphae.forEach(h => {
        if (h.done) return;
        if (++h.growTimer < h.growEvery) return;
        h.growTimer = 0;

        // Can't grow beyond moisture-scaled target length
        if (h.pts.length >= h.maxPts * pct + 2) { h.done = true; return; }

        const tip = h.pts[h.pts.length - 1];
        h.angle += h.wobble + Math.sin(frameRef.current * 0.006 + h.depth) * 0.01;
        const nx = tip.x + Math.cos(h.angle) * h.stepLen;
        const ny = tip.y + Math.sin(h.angle) * h.stepLen;

        if (nx < 3 || nx > W - 3 || ny < 3 || ny > H - 3) { h.done = true; return; }

        // Paint new segment directly onto offscreen accumulator
        const col = [lerp(28, C[0], pct) | 0, lerp(95, C[1], pct) | 0, lerp(75, C[2], pct) | 0];
        const a   = h.alpha * (0.2 + pct * 0.62);
        octx.beginPath();
        octx.moveTo(tip.x, tip.y);
        octx.lineTo(nx, ny);
        octx.strokeStyle = `rgba(${col[0]},${col[1]},${col[2]},${a})`;
        octx.lineWidth   = clamp(1.45 - h.depth * 0.12, 0.28, 1.45);
        octx.lineCap     = 'round';
        octx.stroke();

        // Living tip glow on accumulator
        const g = octx.createRadialGradient(nx, ny, 0, nx, ny, 3.5);
        g.addColorStop(0, `rgba(${col[0]},${col[1]},${col[2]},${a * 0.85})`);
        g.addColorStop(1, `rgba(${col[0]},${col[1]},${col[2]},0)`);
        octx.beginPath(); octx.arc(nx, ny, 3.5, 0, PI2);
        octx.fillStyle = g; octx.fill();

        h.pts.push({ x: nx, y: ny });

        // Branching — only when moist enough
        if (!h.branched && h.pts.length === h.branchAt && pct > 0.2 && hyphae.length < maxActive) {
          h.branched  = true;
          const side  = h.rng() > 0.5 ? 1 : -1;
          spawnHypha(hyphae, nx, ny, h.angle + side * (0.32 + h.rng() * 0.2), h.depth + 1, mkRng(hyphae.length * 17 + 3));
          if (pct > 0.6 && hyphae.length < maxActive) {
            spawnHypha(hyphae, nx, ny, h.angle - side * (0.27 + h.rng() * 0.17), h.depth + 2, mkRng(hyphae.length * 13 + 9));
          }
        }

        // Anastomosis — check if this tip is near another tip
        hyphae.forEach((h2, j) => {
          if (h2 === h || !h2.pts.length) return;
          const t2 = h2.pts[h2.pts.length - 1];
          const dx = nx - t2.x, dy = ny - t2.y;
          if (dx * dx + dy * dy < 20) {
            // Permanent glow at junction
            const mg = octx.createRadialGradient((nx + t2.x) / 2, (ny + t2.y) / 2, 0, (nx + t2.x) / 2, (ny + t2.y) / 2, 5);
            mg.addColorStop(0, `rgba(180,255,220,${pct * 0.6})`);
            mg.addColorStop(1, 'rgba(100,220,160,0)');
            octx.beginPath(); octx.arc((nx + t2.x) / 2, (ny + t2.y) / 2, 5, 0, PI2);
            octx.fillStyle = mg; octx.fill();
          }
        });
      });

      // Trigger respawn when all threads are done
      if (hyphae.every(h => h.done) && hyphae.length < 5) {
        resetFlag.current = true;
      }
    }

    function draw() {
      frameRef.current++;
      if (resetFlag.current) doReset();

      const pct = clamp((soilMoisture ?? 93) / 100, 0, 1);
      growStep(pct);

      // Blit accumulator onto main canvas (transparent — no fill)
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(oc, 0, 0);

      // Pulsing origin dot — brightness = moisture
      const pulse = Math.sin(frameRef.current * 0.016) * 0.5 + 0.5;
      const og    = ctx.createRadialGradient(cx, cy, 0, cx, cy, 5.5 + pulse * 2);
      og.addColorStop(0, rc(C, pct * 0.65));
      og.addColorStop(1, rc(C, 0));
      ctx.beginPath(); ctx.arc(cx, cy, 5.5 + pulse * 2, 0, PI2);
      ctx.fillStyle = og; ctx.fill();

      rafRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [soilMoisture, doReset]);

  // When moisture rises significantly and network is dead, respawn
  useEffect(() => {
    const h = hyphaeRef.current;
    if (h && soilMoisture > 10 && h.filter(x => !x.done).length === 0) {
      resetFlag.current = true;
    }
  }, [soilMoisture]);

  return (
    <div className="w-full flex flex-col items-center gap-1">
      <canvas
        ref={canvasRef}
        width={160} height={150}
        className="w-full"
        style={{ maxWidth: 160 }}
      />
      <div className="text-center">
        <div className="text-lg font-mono font-bold text-[var(--text-sage)]">
          {fmt(soilMoisture)}%
        </div>
        <div className="text-[9px] uppercase tracking-widest text-[var(--text-sage)] opacity-35 mt-0.5">
          {t('soilMoisture') || 'vlaga v prsti'}
        </div>
      </div>
    </div>
  );
};

export default SoilMoistureIndicator;
