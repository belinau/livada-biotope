import React from 'react';
import { motion } from 'framer-motion';

export const CometCard = ({ children, animationDelay = '0s', animationDuration = '15s' }) => {
  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--glass-bg)] to-[var(--glass-bg-nav)] rounded-lg" />
      {/* Animated background layer - now on top */}
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          background: 'radial-gradient(circle at var(--x, 50%) var(--y, 50%), rgba(212, 105, 26, 0.4) 0%, rgba(232, 149, 71, 0.1) 40%, transparent 80%)',
          backgroundSize: '200% 200%',
          animation: `subtle-gradient-shift ${animationDuration} ease infinite ${animationDelay}`,
        }}
      />
      <motion.div
        className="absolute inset-0"
        style={{ perspective: '1000px' }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-lg"
          style={{ transformStyle: 'preserve-3d' }}
          whileHover={{ rotateX: 10, rotateY: -10 }}
        />
      </motion.div>
      <div className="relative z-10">{children}</div>
    </div>
  );
};