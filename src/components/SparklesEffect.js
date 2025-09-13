import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const SparklesEffect = ({ isActive, iconRef }) => {
  const [particles, setParticles] = useState([]);
  const [iconPosition, setIconPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isActive && iconRef?.current) {
      const rect = iconRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      setIconPosition({ x: centerX, y: centerY });

      // Create particles for the sparkles effect
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 100, // -50 to 50 range
        y: (Math.random() - 0.5) * 100, // -50 to 50 range
        size: Math.random() * 6 + 2,
        delay: Math.random() * 0.3,
        duration: Math.random() * 1 + 1, // 1-2 seconds
        color: 'bg-yellow-300'
      }));
      setParticles(newParticles);
    }
  }, [isActive, iconRef]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute rounded-full ${particle.color} shadow-lg`}
          style={{
            left: `${iconPosition.x}px`,
            top: `${iconPosition.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            boxShadow: '0 0 8px 2px rgba(255, 255, 0, 0.8)',
            transformOrigin: 'center center'
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
            x: particle.x,
            y: particle.y,
            rotate: [0, Math.random() * 360],
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

export default SparklesEffect;