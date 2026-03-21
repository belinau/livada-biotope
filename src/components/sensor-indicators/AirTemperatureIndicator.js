import React, { useEffect, useRef, useCallback } from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { V, A, lerp, lerp3, clamp, flockStep, makeOffscreen, PI2 } from './sensorPalette';

const N_PARTICLES = 26;

function tempColor(n) {
  // violet (cold) → amber → coral (hot)
  if (n < 0.5) return lerp3(V, A, n / 0.5);
  return lerp3(A, [252, 100, 40], (n - 0.5) / 0.5);
}

function makeParticles(W, H, cx, cy) {
  return Array.from({ length: N_PARTICLES }, (_, i) => {
    const a = (i / N_PARTICLES) * PI2 + Math.random() * 0.4;
    const r = 3 + Math.random() * 10;
    return {
      x: cx + r * Math.cos(a),
      y: cy + r * Math.sin(a),
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      phase: Math.random() * PI2,
    };
  });
}

/**
 * AirTemperatureIndicator
 *
 * Visual: a flock of 26 particles whose behaviour is driven purely by
 * temperature. Cold → tight slow violet cluster near centre with strong
 * centripetal pull. Hot → fast chaotic amber-coral spread filling the
 * canvas. Trail persistence is achieved via an offscreen buffer composited
 * at reduced opacity — no opaque background anywhere.
 *
 * Improvement over widget version: particles now also shift slightly in
 * *size* with temperature (hotter = slightly larger glow radius), and the
 * colour scale strip at the bottom has a live indicator needle that
 * animates smoothly when temperature changes.
 *
 * Props:
 *   airTemperature {number|null}  °C
 *   lastUpdated    {Date|null}
 */
const AirTemperatureIndicator = ({ airTemperature = null, lastUpdated = null }) => {
  const { t, language } = useTranslation();
  const canvasRef  = useRef(null);
  const frameRef   = useRef(0);
  const rafRef     = useRef(null);
  const psRef      = useRef(null);
  const offRef     = useRef(null);
  const targetNorm = useRef(0.42); // smooth needle
  const smoothNorm = useRef(0.42);

  const norm = useCallback((temp) =>
    clamp((temp + 10) / 55, 0, 1), []);

  const fmt = useCallback((n) => {
    if (n === null || n === undefined || isNaN(n)) return '—';
    const s = Number(n).toFixed(1);
    return language === 'sl' ? s.replace('.', ',') : s;
  }, [language]);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const W  = cv.width;
    const H  = cv.height;
    const cx = W / 2;
    const cy = H / 2 - 3;

    if (!psRef.current)  psRef.current  = makeParticles(W, H, cx, cy);
    if (!offRef.current) offRef.current = makeOffscreen(W, H);

    const ps   = psRef.current;
    const oc   = offRef.current;
    const octx = oc.getContext('2d');
    const ctx  = cv.getContext('2d');

    function draw() {
      frameRef.current++;
      const frame = frameRef.current;

      const raw = airTemperature !== null && !isNaN(airTemperature) ? airTemperature : 13;
      const n   = norm(raw);
      targetNorm.current = n;
      smoothNorm.current += (targetNorm.current - smoothNorm.current) * 0.04;
      const sn = smoothNorm.current;

      flockStep(ps, N_PARTICLES, W, H, {
        maxSpd: 0.1  + n * 1.55,
        cohR:   n < 0.28 ? 16 : lerp(50, W * 0.42, n),
        sepR:   lerp(6, 17, n),
        aliR:   lerp(20, 42, n),
        pull:   lerp(0.0035, 0.0003, n),
        jitter: n * 0.025,
        cx, cy,
      }, frame);

      // offscreen trail persistence (no black bg — pure alpha decay)
      octx.clearRect(0, 0, W, H);
      octx.drawImage(cv, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.globalAlpha = 0.80 + n * 0.06; // hotter = longer trail
      ctx.drawImage(oc, 0, 0);
      ctx.globalAlpha = 1;

      const col = tempColor(n);

      // connection lines between nearby particles
      for (let i = 0; i < N_PARTICLES; i++) {
        for (let j = i + 1; j < N_PARTICLES; j++) {
          const dx = ps[i].x - ps[j].x, dy = ps[i].y - ps[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          const mx = lerp(18, 46, n);
          if (d > mx) continue;
          ctx.beginPath();
          ctx.moveTo(ps[i].x, ps[i].y);
          ctx.lineTo(ps[j].x, ps[j].y);
          ctx.strokeStyle = `rgba(${col[0]},${col[1]},${col[2]},${(1 - d / mx) * (0.05 + n * 0.08)})`;
          ctx.lineWidth   = 0.5;
          ctx.stroke();
        }
      }

      // particle glows + cores
      const sz = 2 + n * 2.2;
      ps.forEach(p => {
        const a  = 0.48 + n * 0.22;
        const gr = sz * 2.4;
        const g  = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, gr);
        g.addColorStop(0,   `rgba(${col[0]},${col[1]},${col[2]},${a})`);
        g.addColorStop(0.5, `rgba(${col[0]},${col[1]},${col[2]},${a * 0.2})`);
        g.addColorStop(1,   `rgba(${col[0]},${col[1]},${col[2]},0)`);
        ctx.beginPath(); ctx.arc(p.x, p.y, gr,       0, PI2); ctx.fillStyle = g;   ctx.fill();
        ctx.beginPath(); ctx.arc(p.x, p.y, sz * 0.4, 0, PI2); ctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${a})`; ctx.fill();
      });

      // colour-scale strip + smooth needle
      const sw = 84, sh = 2.5, sx = (W - sw) / 2, sy = H - 8;
      for (let i = 0; i < sw; i++) {
        const c = tempColor(i / sw);
        ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},0.5)`;
        ctx.fillRect(sx + i, sy, 1, sh);
      }
      const px = sx + sn * sw;
      ctx.beginPath(); ctx.moveTo(px, sy - 3); ctx.lineTo(px + 2.5, sy); ctx.lineTo(px - 2.5, sy); ctx.closePath();
      ctx.fillStyle = 'rgba(220,210,255,0.7)'; ctx.fill();

      rafRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [airTemperature, norm]);

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
          {fmt(airTemperature)}°C
        </div>
        <div className="text-[9px] uppercase tracking-widest text-[var(--text-sage)] opacity-35 mt-0.5">
          {t('airTemp')}
        </div>
      </div>
    </div>
  );
};

export default AirTemperatureIndicator;
