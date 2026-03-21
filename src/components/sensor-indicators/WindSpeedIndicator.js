import React, { useEffect, useRef, useCallback } from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { V, VP, rc, clamp, PI2 } from './sensorPalette';

/**
 * WindSpeedIndicator
 *
 * Visual: six organic seed-pod blades + inner Duchamp concentric arcs,
 * all rotating in a single direction. Speed governs RPM, blade width,
 * and the intensity of the outer cilia ring.
 *
 * Props:
 *   windSpeed   {number|null}  m/s
 *   windGust    {number|null}  m/s
 *   lastUpdated {Date|null}
 */
const WindSpeedIndicator = ({ windSpeed = null, windGust = null, lastUpdated = null }) => {
  const { t, language } = useTranslation();
  const canvasRef = useRef(null);
  const stateRef  = useRef({ angle: 0, t: 0, raf: null });

  const fmt = useCallback((n, d = 1) => {
    if (n === null || n === undefined || isNaN(n)) return '—';
    const s = Number(n).toFixed(d);
    return language === 'sl' ? s.replace('.', ',') : s;
  }, [language]);

  useEffect(() => {
    const cv  = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    const W   = cv.width;
    const H   = cv.height;
    const cx  = W / 2;
    const cy  = H / 2;
    const st  = stateRef.current;

    function blade(len, w) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo( w, -len * 0.26,  w * 1.15, -len * 0.62, 0, -len);
      ctx.bezierCurveTo(-w * 1.15, -len * 0.62, -w, -len * 0.26, 0,  0);
      ctx.closePath();
    }

    function draw() {
      const speed = windSpeed !== null && !isNaN(windSpeed) ? windSpeed : 0;
      st.t     += 0.016;
      // Single direction always. Faster = more wind.
      st.angle += 0.003 + speed * 0.011;

      ctx.clearRect(0, 0, W, H);

      // — outer cilia ring (violet only) —
      for (let i = 0; i < 64; i++) {
        const a   = (i / 64) * PI2 + st.t * 0.035;
        const r   = W * 0.41;
        const len = i % 4 === 0 ? W * 0.043 : W * 0.018;
        ctx.beginPath();
        ctx.moveTo(cx + (r - len) * Math.cos(a), cy + (r - len) * Math.sin(a));
        ctx.lineTo(cx +  r        * Math.cos(a), cy +  r        * Math.sin(a));
        ctx.strokeStyle = i % 4 === 0
          ? rc(V,  0.22 + speed * 0.005)
          : rc(V,  0.06);
        ctx.lineWidth = i % 4 === 0 ? 1 : 0.5;
        ctx.stroke();
      }

      // — faint breathing rings —
      [0.14, 0.24, 0.34].forEach((rf, i) => {
        const r = W * rf;
        ctx.beginPath();
        ctx.arc(cx, cy, r * (1 + Math.sin(st.t * 0.9 + i) * 0.006), 0, PI2);
        ctx.strokeStyle = rc(V, 0.04 + i * 0.01 + speed * 0.002);
        ctx.lineWidth   = 0.7;
        ctx.stroke();
      });

      // — 6 seed-pod blades —
      for (let i = 0; i < 6; i++) {
        const ba  = st.angle + (i / 6) * PI2;
        const len = W * 0.19 + Math.sin(st.t * 1.1 + i) * 2;
        const w   = 4 + speed * 0.22;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(ba);
        blade(len, w);

        const f = ctx.createLinearGradient(0, 0, 0, -len);
        f.addColorStop(0,   rc(V,  0.5  + speed * 0.014));
        f.addColorStop(0.5, rc(VP, 0.65 + speed * 0.007));
        f.addColorStop(1,  `rgba(220,210,255,${0.38 + speed * 0.016})`);
        ctx.fillStyle = f;
        ctx.fill();

        // midrib vein
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(0.4, -len * 0.5, 0, -len);
        ctx.strokeStyle = `rgba(220,210,255,${0.26 + speed * 0.009})`;
        ctx.lineWidth   = 0.6;
        ctx.stroke();
        ctx.restore();
      }

      // — inner Duchamp concentric arcs —
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(st.angle * 1.35);
      for (let ring = 0; ring < 5; ring++) {
        const r = 6 + ring * 5;
        for (let arc = 0; arc < 3; arc++) {
          const s  = (arc / 3) * PI2 + ring * 0.38;
          const sw = PI2 / 3 * 0.52;
          ctx.beginPath();
          ctx.arc(0, 0, r, s, s + sw);
          ctx.strokeStyle = rc(VP, 0.46 - ring * 0.06);
          ctx.lineWidth   = 0.9;
          ctx.stroke();
        }
      }
      ctx.restore();

      // — hub glow —
      const hg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 6);
      hg.addColorStop(0,   `rgba(230,220,255,0.88)`);
      hg.addColorStop(0.5,  rc(VP, 0.28 + speed * 0.012));
      hg.addColorStop(1,    rc(VP, 0));
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, PI2);
      ctx.fillStyle = hg;
      ctx.fill();

      st.raf = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(st.raf);
  }, [windSpeed]);

  const speedKmh = windSpeed !== null ? windSpeed * 3.6 : null;
  const gustKmh  = windGust  !== null ? windGust  * 3.6 : null;

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
          {fmt(windSpeed)} m/s
          {windGust !== null && (
            <span className="text-sm font-normal opacity-60 ml-1">
              / {fmt(windGust)} m/s
            </span>
          )}
        </div>
        {speedKmh !== null && (
          <div className="text-xs font-mono text-[var(--text-sage)] opacity-55">
            {fmt(speedKmh)} km/h
            {gustKmh !== null && ` / ${fmt(gustKmh)} km/h`}
          </div>
        )}
        <div className="text-[9px] uppercase tracking-widest text-[var(--text-sage)] opacity-35 mt-0.5">
          {t('windSpeed')} / {t('windGust')}
        </div>
      </div>
    </div>
  );
};

export default WindSpeedIndicator;
