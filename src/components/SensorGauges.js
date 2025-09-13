import React, { useEffect, useRef } from 'react';
import { getWaveColors } from '../lib/sensor-colors';

// Wave class - moved outside component to fix react-hooks/exhaustive-deps warning
class Wave {
  constructor(intensity, color) {
    this.intensity = intensity;
    this.color = color;
    this.points = [];
    this.amplitude = 5 + intensity * 15; // Height based on intensity
    this.wavelength = 50 + (1 - intensity) * 100; // Length based on intensity
    this.speed = 0.02 + intensity * 0.03; // Speed based on intensity
    this.offset = Math.random() * Math.PI * 2; // Random starting phase
    this.life = 1.0; // Life from 1.0 to 0.0
    this.decay = 0.005 + intensity * 0.01; // Decay rate based on intensity
  }
  
  update() {
    this.offset += this.speed;
    this.life -= this.decay;
    return this.life > 0;
  }
  
  draw(ctx, width, height) {
    ctx.beginPath();
    ctx.moveTo(0, height);
    
    // Create smooth wave curve
    for (let x = 0; x <= width; x += 5) {
      const y = height - 20 - 
                Math.sin((x / this.wavelength) * Math.PI * 2 + this.offset) * this.amplitude * this.life -
                Math.sin((x / (this.wavelength * 0.5)) * Math.PI * 2 + this.offset * 1.7) * (this.amplitude * 0.3) * this.life;
      ctx.lineTo(x, y);
    }
    
    ctx.lineTo(width, height);
    ctx.closePath();
    
    // Create gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${0.3 * this.life})`);
    gradient.addColorStop(1, `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, 0)`);
    
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Draw wave line
    ctx.beginPath();
    for (let x = 0; x <= width; x += 5) {
      const y = height - 20 - 
                Math.sin((x / this.wavelength) * Math.PI * 2 + this.offset) * this.amplitude * this.life -
                Math.sin((x / (this.wavelength * 0.5)) * Math.PI * 2 + this.offset * 1.7) * (this.amplitude * 0.3) * this.life;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    
    ctx.strokeStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${0.8 * this.life})`;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

// WavePropagation - Clean physics-based wave propagation
const WavePropagation = ({ value, label, unit = '', metricType = 'moisture', maxValue = 100, lastUpdated }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const wavesRef = useRef([]);
  
  // Normalize value based on max value for this sensor type
  const normalizedValue = Math.min(maxValue, Math.max(0, value || 0));
  const waveIntensity = normalizedValue / maxValue; // 0-1 scale based on sensor's max value
  
  // Get unified colors for this metric type
  const { base, wave } = getWaveColors(metricType);
  
  // Format timestamp for retro display
  const formatRetroTimestamp = (timestamp) => {
    if (!timestamp) return '--:--:--';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  };
  
  // Format full date
  const formatFullDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };
  
  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width = canvas.clientWidth;
    let height = canvas.clientHeight;
    
    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;
    
    // Handle resize
    const handleResize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width;
      canvas.height = height;
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation function
    const animate = () => {
      // Clear canvas with transparent fill for full transparency
      ctx.clearRect(0, 0, width, height);
      
      // Occasionally add new waves based on intensity
      if (Math.random() < 0.05 + waveIntensity * 0.1) {
        wavesRef.current.push(new Wave(waveIntensity, wave));
      }
      
      // Update and draw waves
      wavesRef.current = wavesRef.current.filter(wave => {
        const isAlive = wave.update();
        if (isAlive) wave.draw(ctx, width, height);
        return isAlive;
      });
      
      // Draw base line
      ctx.beginPath();
      ctx.moveTo(0, height - 20);
      ctx.lineTo(width, height - 20);
      ctx.strokeStyle = `rgba(${base[0]}, ${base[1]}, ${base[2]}, 0.5)`;
      ctx.lineWidth = 1;
      ctx.stroke();
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [waveIntensity, base, wave]);
  
  return (
    <div className="sensor-gauge-container h-full flex flex-col">
      <div className="flex justify-between items-start mb-1">
        <div>
          <div className="text-[var(--text-sage)] font-medium">{label}</div>
          <div className="text-2xl md:text-3xl font-mono font-bold text-[var(--text-sage)]">
            {normalizedValue.toFixed(1)}{unit}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-[var(--text-sage)] font-mono">{formatRetroTimestamp(lastUpdated)}</div>
          <div className="text-xs text-[var(--text-sage)] font-mono">{formatFullDate(lastUpdated)}</div>
        </div>
      </div>
      <div className="relative w-full flex-grow min-h-0 rounded-lg overflow-hidden border border-[var(--glass-border)] bg-transparent">
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full"
        />
      </div>
    </div>
  );
};

// Soil Moisture Wave
export const SoilMoistureWave = ({ value, label, unit, lastUpdated }) => (
  <WavePropagation 
    value={value} 
    label={label} 
    unit={unit} 
    metricType="moisture" 
    maxValue={100}
    lastUpdated={lastUpdated}
  />
);

// Soil Temperature Wave
export const SoilTemperatureWave = ({ value, label, unit, lastUpdated }) => (
  <WavePropagation 
    value={value} 
    label={label} 
    unit={unit} 
    metricType="temperature" 
    maxValue={40}
    lastUpdated={lastUpdated}
  />
);

// Air Humidity Wave
export const AirHumidityWave = ({ value, label, unit, lastUpdated }) => (
  <WavePropagation 
    value={value} 
    label={label} 
    unit={unit} 
    metricType="airHumidity" 
    maxValue={100}
    lastUpdated={lastUpdated}
  />
);

// Air Temperature Wave
export const AirTemperatureWave = ({ value, label, unit, lastUpdated }) => (
  <WavePropagation 
    value={value} 
    label={label} 
    unit={unit} 
    metricType="airTemperature" 
    maxValue={40}
    lastUpdated={lastUpdated}
  />
);

export default WavePropagation;