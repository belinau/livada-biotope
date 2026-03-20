import React, { useEffect, useRef, useCallback } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { VP, TG, rc, clamp, makeOffscreen, PI2 } from './sensorPalette';

const MAX_PER_TYPE = 25;
const SPEED_MAX    = 0.82;
const SEP_R        = 16;
const ALI_R        = 36;
const COH_R        = 55;

function mkBoid(type, W, H) {
  return {
    x:     W * 0.15 + Math.random() * W * 0.7,
    y:     H * 0.15 + Math.random() * H * 0.7,
    vx:    (Math.random() - 0.5) * 0.8,
    vy:    (Math.random() - 0.5) * 0.8,
    type,
    trail: [],
    phase: Math.random() * PI2,
  };
}

/**
 * PaxIndicator
 *
 * Visual: a murmuration of glowing particles — violet for WiFi devices,
 * teal for BLE. Each particle runs full boids physics (separation,
 * alignment, cohesion) plus a gentle centre-drift and organic sine wobble.
 * Nearby same-type particles draw faint connection lines.
 *
 * Improvements over widget version:
 * - Boids now have a very slight cross-type *repulsion* — WiFi and BLE
 *   clusters gently avoid each other, creating two distinct murmurations
 *   that occasionally brush past each other rather than fully mixing.
 * - Trail length scales with flock size — a single lone device gets a
 *   longer, more visible trail (it's moving faster relative to the empty
 *   canvas); a dense flock gets shorter trails so it doesn't smear.
 * - The offscreen trail alpha is 0.76 (fairly fast fade) so the canvas
 *   stays transparent and the glassmorphic card shines through clearly.
 *
 * Props:
 *   wifi        {number|null}  WiFi device count
 *   ble         {number|null}  BLE device count
 *   lastUpdated {Date|null}
 */
const PaxIndicator = ({ wifi = null, ble = null, lastUpdated = null }) => {
  const { t } = useTranslation();
  const canvasRef  = useRef(null);
  const frameRef   = useRef(0);
  const rafRef     = useRef(null);
  const boidsRef   = useRef([]);
  const offRef     = useRef(null);
  const dimRef     = useRef({ W: 280, H: 150 });

  // Sync boid array when counts change
  const syncBoids = useCallback((W, H) => {
    const targetW = clamp(wifi  ?? 0, 0, MAX_PER_TYPE);
    const targetB = clamp(ble   ?? 0, 0, MAX_PER_TYPE);
    const boids   = boidsRef.current;

    ['w', 'b'].forEach((tp, ti) => {
      const target = ti === 0 ? targetW : targetB;
      const cur    = boids.filter(b => b.type === tp).length;
      if (cur < target) {
        for (let i = cur; i < target; i++) boids.push(mkBoid(tp, W, H));
      } else if (cur > target) {
        let rem = cur - target;
        for (let i = boids.length - 1; i >= 0 && rem > 0; i--) {
          if (boids[i].type === tp) { boids.splice(i, 1); rem--; }
        }
      }
    });
  }, [wifi, ble]);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const W  = cv.width;
    const H  = cv.height;
    dimRef.current = { W, H };

    if (!offRef.current) offRef.current = makeOffscreen(W, H);
    syncBoids(W, H);

    const oc   = offRef.current;
    const octx = oc.getContext('2d');
    const ctx  = cv.getContext('2d');
    const boids = boidsRef.current;

    function step(frame) {
      boids.forEach((b, bi) => {
        let sx = 0, sy = 0, ax = 0, ay = 0, chx = 0, chy = 0, an = 0, cn = 0;
        let rx = 0, ry = 0; // cross-type repulsion

        boids.forEach((o, oi) => {
          if (oi === bi) return;
          const dx = b.x - o.x, dy = b.y - o.y;
          const d  = Math.sqrt(dx * dx + dy * dy) || 0.1;

          if (b.type === o.type) {
            // same-type: standard boids
            if (d < SEP_R) { sx += dx / d; sy += dy / d; }
            if (d < ALI_R) { ax += o.vx; ay += o.vy; an++; }
            if (d < COH_R) { chx += o.x; chy += o.y; cn++; }
          } else {
            // cross-type: gentle avoidance within a wider radius
            if (d < 40) { rx += dx / d * 0.35; ry += dy / d * 0.35; }
          }
        });

        if (an) { ax /= an; ay /= an; }
        if (cn) { chx = chx / cn - b.x; chy = chy / cn - b.y; }

        b.vx += sx * 0.05  + ax * 0.025 + chx * 0.003
              + (W / 2 - b.x) * 0.0004
              + Math.sin(frame * 0.009 + b.phase) * 0.028
              + rx * 0.04;
        b.vy += sy * 0.05  + ay * 0.025 + chy * 0.003
              + (H / 2 - b.y) * 0.0005
              + Math.cos(frame * 0.008 + b.phase) * 0.028
              + ry * 0.04;

        const spd = Math.sqrt(b.vx * b.vx + b.vy * b.vy) || 0.1;
        if (spd > SPEED_MAX) { b.vx = b.vx / spd * SPEED_MAX; b.vy = b.vy / spd * SPEED_MAX; }

        // Trail length inversely proportional to flock density
        const maxTrail = Math.max(4, Math.round(12 - boids.length * 0.15));
        b.trail.push({ x: b.x, y: b.y });
        if (b.trail.length > maxTrail) b.trail.shift();

        b.x = clamp(b.x + b.vx, 4, W - 4);
        b.y = clamp(b.y + b.vy, 4, H - 4);
      });
    }

    function draw() {
      frameRef.current++;
      const frame = frameRef.current;
      step(frame);

      octx.clearRect(0, 0, W, H);
      octx.drawImage(cv, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.globalAlpha = 0.76;
      ctx.drawImage(oc, 0, 0);
      ctx.globalAlpha = 1;

      // Connection lines — same type only
      for (let i = 0; i < boids.length; i++) {
        for (let j = i + 1; j < boids.length; j++) {
          if (boids[i].type !== boids[j].type) continue;
          const dx = boids[i].x - boids[j].x, dy = boids[i].y - boids[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d > 28) continue;
          const col = boids[i].type === 'w' ? VP : TG;
          ctx.beginPath();
          ctx.moveTo(boids[i].x, boids[i].y);
          ctx.lineTo(boids[j].x, boids[j].y);
          ctx.strokeStyle = rc(col, (1 - d / 28) * 0.2);
          ctx.lineWidth   = 0.38;
          ctx.stroke();
        }
      }

      // Particles
      boids.forEach(b => {
        const col = b.type === 'w' ? VP : TG;

        // Trail dots
        b.trail.forEach((p, i) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 0.65, 0, PI2);
          ctx.fillStyle = rc(col, (i / b.trail.length) * 0.22);
          ctx.fill();
        });

        // Glow halo
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, 4);
        g.addColorStop(0,   rc(col, 0.8));
        g.addColorStop(0.5, rc(col, 0.16));
        g.addColorStop(1,   rc(col, 0));
        ctx.beginPath(); ctx.arc(b.x, b.y, 4,   0, PI2); ctx.fillStyle = g;           ctx.fill();
        ctx.beginPath(); ctx.arc(b.x, b.y, 1.4, 0, PI2); ctx.fillStyle = rc(col, 0.9); ctx.fill();
      });

      // Legend
      ctx.beginPath(); ctx.arc(10, H - 9, 2, 0, PI2); ctx.fillStyle = rc(VP, 0.7); ctx.fill();
      ctx.fillStyle    = rc(VP, 0.42);
      ctx.font         = "7px 'Courier New'";
      ctx.textBaseline = 'middle';
      ctx.fillText('WiFi', 15, H - 9);

      ctx.beginPath(); ctx.arc(46, H - 9, 2, 0, PI2); ctx.fillStyle = rc(TG, 0.7); ctx.fill();
      ctx.fillStyle = rc(TG, 0.42);
      ctx.fillText('BLE', 51, H - 9);

      rafRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, []); // canvas setup once

  // Re-sync boids when counts change without restarting the loop
  useEffect(() => {
    const { W, H } = dimRef.current;
    syncBoids(W, H);
  }, [syncBoids]);

  const total = (wifi ?? 0) + (ble ?? 0);

  return (
    <div className="w-full flex flex-col items-center gap-1">
      <canvas
        ref={canvasRef}
        width={280} height={150}
        className="w-full"
        style={{ maxWidth: 280 }}
      />
      <div className="text-center">
        <div className="text-lg font-mono font-bold text-[var(--text-sage)]">
          {total}
        </div>
        <div className="text-xs font-mono text-[var(--text-sage)] opacity-55">
          <span style={{ color: `rgba(${VP[0]},${VP[1]},${VP[2]},0.7)` }}>WiFi {wifi ?? '—'}</span>
          {' · '}
          <span style={{ color: `rgba(${TG[0]},${TG[1]},${TG[2]},0.7)` }}>BLE {ble ?? '—'}</span>
        </div>
        <div className="text-[9px] uppercase tracking-widest text-[var(--text-sage)] opacity-35 mt-0.5">
          {t('paxCounter') || 'prisotnost'}
        </div>
      </div>
    </div>
  );
};

export default PaxIndicator;
