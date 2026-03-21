import React, { useEffect, useRef, useCallback } from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { C, lerp, clamp, rc, flockStep, makeOffscreen, PI2 } from './sensorPalette';

const MAX_P = 30;

function makeParticles(W, H, cx, cy) {
  return Array.from({ length: MAX_P }, () => ({
    x:     cx + (Math.random() - 0.5) * W * 0.6,
    y:     cy + (Math.random() - 0.5) * (H - 20) * 0.6,
    vx:    (Math.random() - 0.5) * 0.14,
    vy:    (Math.random() - 0.5) * 0.14,
    phase: Math.random() * PI2,
    r:     1 + Math.random() * 1.3,   // molecule radius seed
  }));
}

/**
 * AirHumidityIndicator
 *
 * Visual: water molecules as a slow flock. Dry → only 2–4 wanderers,
 * wide separation, drifting freely. Humid → up to 30 molecules that
 * cohere into tight droplet-like clusters. Heavier/slower at saturation.
 * Hydrogen-bond lines thicken between close pairs at high humidity.
 *
 * Improvement: specular highlights now flicker softly, molecules gain
 * a very subtle secondary inner ring at humidity > 70 % (surface-tension
 * halo), and the arc indicator at the bottom pulses with a slow breath.
 *
 * Props:
 *   airHumidity {number|null}  %
 *   lastUpdated {Date|null}
 */
const AirHumidityIndicator = ({ airHumidity = null, lastUpdated = null }) => {
  const { t, language } = useTranslation();
  const canvasRef = useRef(null);
  const frameRef  = useRef(0);
  const rafRef    = useRef(null);
  const psRef     = useRef(null);
  const offRef    = useRef(null);

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

      const pct    = clamp((airHumidity ?? 33) / 100, 0, 1);
      const active = Math.max(2, Math.floor(pct * pct * MAX_P + 2));

      flockStep(ps, active, W, H - 10, {
        maxSpd: 0.28 - pct * 0.13,          // heavier when humid
        cohR:   lerp(72, 22, pct),           // tighter clustering when humid
        sepR:   lerp(13, 8,  pct),
        aliR:   32,
        pull:   0,                           // no centre pull — free float
        cx, cy,
      }, frame);

      // trail fade — molecules linger slightly longer when humid
      octx.clearRect(0, 0, W, H);
      octx.drawImage(cv, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.globalAlpha = 0.86 + pct * 0.06;
      ctx.drawImage(oc, 0, 0);
      ctx.globalAlpha = 1;

      const apt = ps.slice(0, active);

      // hydrogen-bond lines
      for (let i = 0; i < apt.length; i++) {
        for (let j = i + 1; j < apt.length; j++) {
          const dx = apt[i].x - apt[j].x, dy = apt[i].y - apt[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          const br = lerp(28, 14, pct);
          if (d > br) continue;
          const ba = (1 - d / br) * (0.07 + pct * 0.18);
          ctx.beginPath();
          ctx.moveTo(apt[i].x, apt[i].y);
          ctx.lineTo(apt[j].x, apt[j].y);
          ctx.strokeStyle = rc(C, ba);
          ctx.lineWidth   = lerp(0.28, 0.9, pct) * (1 - d / br);
          ctx.stroke();
        }
      }

      // molecule rendering
      apt.forEach(p => {
        const sz     = p.r * (1.1 + pct * 0.72);
        const a      = lerp(0.35, 0.64, pct);
        const flick  = Math.sin(frame * 0.018 + p.phase) * 0.08; // specular flicker

        // outer soft glow
        const og = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, sz * 3);
        og.addColorStop(0, rc(C, a * 0.24));
        og.addColorStop(1, rc(C, 0));
        ctx.beginPath(); ctx.arc(p.x, p.y, sz * 3, 0, PI2);
        ctx.fillStyle = og; ctx.fill();

        // body
        ctx.beginPath(); ctx.arc(p.x, p.y, sz, 0, PI2);
        ctx.fillStyle = rc(C, a + 0.05); ctx.fill();

        // surface-tension halo at high humidity
        if (pct > 0.68) {
          ctx.beginPath(); ctx.arc(p.x, p.y, sz * 1.55, 0, PI2);
          ctx.strokeStyle = rc(C, (pct - 0.68) / 0.32 * 0.18);
          ctx.lineWidth   = 0.5; ctx.stroke();
        }

        // specular highlight (flickering)
        ctx.beginPath();
        ctx.arc(p.x - sz * 0.27, p.y - sz * 0.27, sz * 0.23, 0, PI2);
        ctx.fillStyle = `rgba(200,240,242,${(a + flick) * 0.55})`; ctx.fill();
      });

      // arc indicator with breath pulse
      const aR    = 50, aX = W / 2, aY = H + 11;
      const pulse = 1 + Math.sin(frame * 0.022) * 0.018;
      ctx.beginPath(); ctx.arc(aX, aY, aR * pulse, -Math.PI, 0);
      ctx.strokeStyle = rc(C, 0.07); ctx.lineWidth = 2.2; ctx.stroke();
      if (pct > 0.01) {
        ctx.beginPath(); ctx.arc(aX, aY, aR * pulse, -Math.PI, -Math.PI + Math.PI * pct);
        ctx.strokeStyle = rc(C, 0.5); ctx.lineWidth = 2.2; ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [airHumidity]);

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
          {fmt(airHumidity)}%
        </div>
        <div className="text-[9px] uppercase tracking-widest text-[var(--text-sage)] opacity-35 mt-0.5">
          {t('airHumidity')}
        </div>
      </div>
    </div>
  );
};

export default AirHumidityIndicator;
