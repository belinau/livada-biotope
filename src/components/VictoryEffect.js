import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const VictoryEffect = ({ isActive }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (isActive) {
      // Create more particles for a more pronounced effect
      const newParticles = Array.from({ length: 200 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 10 + 4,
        delay: Math.random() * 0.8,
        duration: Math.random() * 2 + 3, // Longer duration (3-5 seconds) for more impact
        // Using yellow-300 to match the existing game effect
        color: 'bg-yellow-300'
      }));
      setParticles(newParticles);
    }
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute rounded-full ${particle.color} shadow-lg`}
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            boxShadow: '0 0 12px 4px rgba(255, 255, 0, 0.8)'
          }}
          initial={{ 
            opacity: 0, 
            scale: 0,
            x: 0,
            y: 0
          }}
          animate={{ 
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1, 0],
            x: [(Math.random() - 0.5) * 800],
            y: [(Math.random() - 0.5) * 800],
            rotate: [0, Math.random() * 720], // More rotation for liveliness
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            times: [0, 0.1, 0.9, 1],
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
};

export default VictoryEffect;