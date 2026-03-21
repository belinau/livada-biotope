import React, { useEffect, useRef } from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { V, VP, rc, PI2 } from './sensorPalette';

const DIRS_SL = ['S','SSV','SV','VSV','V','VJV','JV','JJV','J','JJZ','JZ','ZJZ','Z','ZSZ','SZ','SSZ'];
const DIRS_EN = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];

export function dir16(degrees, language = 'sl') {
  const dirs = language === 'sl' ? DIRS_SL : DIRS_EN;
  return dirs[Math.round(((degrees % 360) + 360) % 360 / 22.5) % 16];
}

/**
 * WindCompassIndicator
 *
 * Visual: botanical compass rose. Eight background petals stay small and
 * dim. The petal that aligns with the actual wind direction blooms fully —
 * large, bright, with visible veins. A slowly counter-rotating outer ring
 * of tick marks frames the whole thing.
 *
 * Props:
 *   windDirection {number|null}  degrees 0–360
 *   lastUpdated   {Date|null}
 */
const WindCompassIndicator = ({ windDirection = null, lastUpdated = null }) => {
  const { t, language } = useTranslation();
  const canvasRef = useRef(null);
  const stateRef  = useRef({ t: 0, smoothDir: windDirection ?? 180, raf: null });

  // Keep smoothDir target updated when prop changes
  const targetDir = useRef(windDirection ?? 180);
  useEffect(() => {
    targetDir.current = windDirection ?? 180;
  }, [windDirection]);

  useEffect(() => {
    const cv  = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    const W   = cv.width;
    const H   = cv.height;
    const cx  = W / 2;
    const cy  = H / 2;
    const st  = stateRef.current;

    function petal(len, w, curl) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo( w * curl, -len * 0.3,  w, -len * 0.65,  0, -len);
      ctx.bezierCurveTo(-w,        -len * 0.65, -w * curl, -len * 0.3, 0, 0);
      ctx.closePath();
    }

    function draw() {
      st.t += 0.016;

      // Smooth direction — shortest arc interpolation
      let diff = ((targetDir.current - st.smoothDir) + 540) % 360 - 180;
      st.smoothDir += diff * 0.055;

      ctx.clearRect(0, 0, W, H);

      // — slowly rotating outer botanical ring —
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(st.t * 0.06);
      for (let i = 0; i < 24; i++) {
        const a = (i / 24) * PI2;
        const r = W * 0.41;
        const l = i % 3 === 0 ? W * 0.043 : W * 0.022;
        ctx.beginPath();
        ctx.moveTo((r - l) * Math.cos(a), (r - l) * Math.sin(a));
        ctx.lineTo(  r     * Math.cos(a),   r     * Math.sin(a));
        ctx.strokeStyle = i % 6 === 0 ? rc(VP, 0.35) : rc(V, 0.11);
        ctx.lineWidth   = i % 3 === 0 ? 0.8 : 0.4;
        ctx.stroke();
        if (i % 6 === 0) {
          ctx.beginPath();
          ctx.arc(r * Math.cos(a), r * Math.sin(a), 1.2, 0, PI2);
          ctx.fillStyle = rc(VP, 0.22);
          ctx.fill();
        }
      }
      ctx.restore();

      // — 8 background petals, bloom strength = alignment with wind dir —
      for (let i = 0; i < 8; i++) {
        const pa   = (i / 8) * PI2 - Math.PI / 2;
        const pd   = (((pa + Math.PI / 2) * 180 / Math.PI) + 360) % 360;
        const diff = ((st.smoothDir - pd) + 540) % 360 - 180;
        const align = Math.max(0, 1 - Math.abs(diff) / 100);

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(pa);

        const len = W * 0.14 + align * W * 0.14;
        const w   = 5 + align * 4.5;
        const al  = 0.06 + align * 0.42;

        petal(len, w, 0.78 + align * 0.28);
        const f = ctx.createLinearGradient(0, 0, 0, -len);
        f.addColorStop(0,   rc(V,  al));
        f.addColorStop(0.6, rc(V,  al * 0.9));
        f.addColorStop(1,   rc(VP, al * 0.55));
        ctx.fillStyle   = f;
        ctx.fill();
        ctx.strokeStyle = rc(VP, al * 0.28);
        ctx.lineWidth   = 0.4;
        ctx.stroke();
        ctx.restore();
      }

      // — cardinal labels (static) —
      const labels = language === 'sl'
        ? [['S', 0], ['V', 90], ['J', 180], ['Z', 270]]
        : [['N', 0], ['E', 90], ['S', 180], ['W', 270]];

      labels.forEach(([l, d]) => {
        const ra = (d - 90) * Math.PI / 180;
        const r  = W * 0.33;
        ctx.fillStyle    = rc(VP, 0.46);
        ctx.font         = `bold ${W * 0.062}px 'Courier New'`;
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(l, cx + r * Math.cos(ra), cy + r * Math.sin(ra));
      });

      // — main bloom petal toward wind —
      const wr = (st.smoothDir - 45) * Math.PI / 180;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(wr);

      // soft glow behind tip
      const gl = ctx.createRadialGradient(0, -W * 0.3, 0, 0, -W * 0.3, W * 0.16);
      gl.addColorStop(0, rc(VP, 0.18));
      gl.addColorStop(1, rc(VP, 0));
      ctx.beginPath();
      ctx.arc(0, -W * 0.3, W * 0.16, 0, PI2);
      ctx.fillStyle = gl;
      ctx.fill();

      const ml = W * 0.34 + Math.sin(st.t * 1.2) * 1.5;
      petal(ml, W * 0.077, 1.08);
      const mf = ctx.createLinearGradient(0, 0, 0, -ml);
      mf.addColorStop(0,    rc(V,  0.72));
      mf.addColorStop(0.4,  rc(VP, 0.78));
      mf.addColorStop(0.85, `rgba(220,210,255,0.62)`);
      mf.addColorStop(1,    `rgba(235,228,255,0.85)`);
      ctx.fillStyle   = mf;
      ctx.fill();
      ctx.strokeStyle = `rgba(225,218,255,0.28)`;
      ctx.lineWidth   = 0.6;
      ctx.stroke();

      // midrib
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(0.4, -ml * 0.35, 0, -ml * 0.7, 0, -ml);
      ctx.strokeStyle = `rgba(225,218,255,0.38)`;
      ctx.lineWidth   = 0.65;
      ctx.stroke();

      // side veins
      for (let v = 1; v <= 3; v++) {
        const vy = -ml * (0.28 + v * 0.16);
        const vw =  ml * 0.06;
        ctx.beginPath();
        ctx.moveTo(0, vy); ctx.lineTo( vw, vy - ml * 0.04);
        ctx.moveTo(0, vy); ctx.lineTo(-vw, vy - ml * 0.04);
        ctx.strokeStyle = `rgba(220,210,255,0.18)`;
        ctx.lineWidth   = 0.5;
        ctx.stroke();
      }

      // root tail
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(1.5, W * 0.08, 0, W * 0.11);
      ctx.strokeStyle = rc(V, 0.28);
      ctx.lineWidth   = 1.6;
      ctx.stroke();
      ctx.restore();

      // — breathing centre rings —
      [0.078, 0.128, 0.178].forEach((rf, i) => {
        const r = W * rf + Math.sin(st.t * 0.65 + i) * 0.9;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, PI2);
        ctx.strokeStyle = rc(V, 0.07 - i * 0.016);
        ctx.lineWidth   = 0.8;
        ctx.stroke();
      });

      // — stamen —
      const sg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 5);
      sg.addColorStop(0,   `rgba(235,228,255,0.88)`);
      sg.addColorStop(0.5,  rc(VP, 0.58));
      sg.addColorStop(1,    rc(VP, 0));
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, PI2);
      ctx.fillStyle = sg;
      ctx.fill();

      st.raf = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(st.raf);
  }, [language]); // language only — direction is read from targetDir ref

  const dirLabel = windDirection !== null
    ? `${Math.round(windDirection)}° ${dir16(windDirection, language)}`
    : '—';

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
          {dirLabel}
        </div>
        <div className="text-[9px] uppercase tracking-widest text-[var(--text-sage)] opacity-35 mt-0.5">
          {t('windDirection')}
        </div>
      </div>
    </div>
  );
};

export default WindCompassIndicator;
