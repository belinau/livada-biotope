import React from 'react';
import { motion } from 'framer-motion';

export const CometCard = ({ children }) => {
  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg" />
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