import React, { useEffect, useRef, useCallback } from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { V, A, lerp, lerp3, clamp, flockStep, makeOffscreen, PI2 } from './sensorPalette';

const N = 18;

function soilColor(n) {
  // frozen violet → amber → hot coral
  if (n < 0.15) return lerp3(V, A, n / 0.15);
  if (n < 0.6)  return lerp3(A, [242, 132, 44], (n - 0.15) / 0.45);
  return lerp3([242, 132, 44], [255, 72, 36], (n - 0.6) / 0.4);
}

function makeParticles(W, H, cx, cy) {
  return Array.from({ length: N }, (_, i) => {
    const a = (i / N) * PI2 + Math.random() * 0.5;
    const r = 5 + Math.random() * 14;
    return {
      x:     cx + r * Math.cos(a),
      y:     cy + r * Math.sin(a),
      vx:    (Math.random() - 0.5) * 0.08,
      vy:    (Math.random() - 0.5) * 0.08,
      phase: Math.random() * PI2,
      sz:    3 + Math.random() * 3,  // per-particle blob radius seed
    };
  });
}

/**
 * SoilTemperatureIndicator
 *
 * Visual: 18 heavy heat-blobs drifting through soil. Viscous damping
 * (0.965) keeps them slow regardless of temperature — soil is not air.
 * Temperature drives: spread (cohesion radius), glow size, and colour.
 * Cold: tight violet cluster, small glows. Warm: spread amber blobs.
 * Hot: sparse coral blobs, large overlapping glow halos giving a diffuse
 * heat-in-earth effect.
 *
 * Improvement over widget version: blob radius now breathes with a slow
 * per-particle sine — gives an organic "heat pulsing through earth" feel.
 * Conduction lines between nearby blobs become more visible as heat rises.
 * Trail persistence is very high (0.93) — heat moves slowly in soil.
 *
 * Props:
 *   soilTemperature {number|null}  °C
 *   lastUpdated     {Date|null}
 */
const SoilTemperatureIndicator = ({ soilTemperature = null, lastUpdated = null }) => {
  const { t, language } = useTranslation();
  const canvasRef  = useRef(null);
  const frameRef   = useRef(0);
  const rafRef     = useRef(null);
  const psRef      = useRef(null);
  const offRef     = useRef(null);
  const smoothNorm = useRef(0.46);

  const norm = useCallback((temp) =>
    clamp((temp + 5) / 45, 0, 1), []);

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

      const raw = soilTemperature !== null && !isNaN(soilTemperature) ? soilTemperature : 15.8;
      const n   = norm(raw);
      smoothNorm.current += (n - smoothNorm.current) * 0.03; // very slow smooth
      const sn  = smoothNorm.current;

      flockStep(ps, N, W, H, {
        maxSpd:  0.07 + n * 0.5,              // always slow — soil is viscous
        cohR:    n < 0.25 ? 14 : lerp(38, W * 0.36, n),
        sepR:    lerp(8, 13, n),
        aliR:    28,
        pull:    lerp(0.0028, 0.0005, n),
        damping: 0.965,                        // viscous soil damping
        cx, cy,
      }, frame);

      // very high trail persistence — soil heat lingers
      octx.clearRect(0, 0, W, H);
      octx.drawImage(cv, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.globalAlpha = 0.93;
      ctx.drawImage(oc, 0, 0);
      ctx.globalAlpha = 1;

      const col = soilColor(n);

      // Conduction lines between nearby blobs
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = ps[i].x - ps[j].x, dy = ps[i].y - ps[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          const mx = lerp(14, 40, n);
          if (d > mx) continue;
          ctx.beginPath();
          ctx.moveTo(ps[i].x, ps[i].y);
          ctx.lineTo(ps[j].x, ps[j].y);
          ctx.strokeStyle = `rgba(${col[0]},${col[1]},${col[2]},${(1 - d / mx) * (0.03 + n * 0.065)})`;
          ctx.lineWidth   = 0.4;
          ctx.stroke();
        }
      }

      // Blob glows — breathing radius
      ps.forEach((p, pi) => {
        const breathe = 1 + Math.sin(frame * 0.014 + p.phase) * 0.12;
        const sz      = p.sz * (2 + n * 2.5) * breathe;
        const a       = 0.15 + n * 0.35;

        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, sz * 2.6);
        g.addColorStop(0,   `rgba(${col[0]},${col[1]},${col[2]},${a})`);
        g.addColorStop(0.4, `rgba(${col[0]},${col[1]},${col[2]},${a * 0.28})`);
        g.addColorStop(1,   `rgba(${col[0]},${col[1]},${col[2]},0)`);
        ctx.beginPath(); ctx.arc(p.x, p.y, sz * 2.6, 0, PI2);
        ctx.fillStyle = g; ctx.fill();

        // Small hard core
        ctx.beginPath(); ctx.arc(p.x, p.y, p.sz * 0.32, 0, PI2);
        ctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${0.42 + n * 0.32})`;
        ctx.fill();
      });

      // Colour scale strip + smoothly animated needle
      const sw = 84, sh = 2.5, sx = (W - sw) / 2, sy = H - 8;
      for (let i = 0; i < sw; i++) {
        const c = soilColor(i / sw);
        ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},0.48)`;
        ctx.fillRect(sx + i, sy, 1, sh);
      }
      const px = sx + sn * sw;
      ctx.beginPath(); ctx.moveTo(px, sy - 3); ctx.lineTo(px + 2.5, sy); ctx.lineTo(px - 2.5, sy); ctx.closePath();
      ctx.fillStyle = 'rgba(220,210,255,0.7)'; ctx.fill();

      rafRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [soilTemperature, norm]);

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
          {fmt(soilTemperature)}°C
        </div>
        <div className="text-[9px] uppercase tracking-widest text-[var(--text-sage)] opacity-35 mt-0.5">
          {t('soilTemp') || 'temperatura prsti'}
        </div>
      </div>
    </div>
  );
};

export default SoilTemperatureIndicator;
