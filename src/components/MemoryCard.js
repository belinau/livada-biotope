import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from './ui/GlassCard';
import FilteredImage from './ui/FilteredImage';

const MemoryCard = ({ card, isFlipped, isMatched, isMismatched, onClick }) => {
  const cardVariants = {
    flipped: {
      rotateY: 180,
      scale: 1,
      zIndex: 1,
      transition: { type: 'spring', stiffness: 300, damping: 20 },
    },
    unflipped: {
      rotateY: 0,
      scale: 1,
      zIndex: 1,
      transition: { type: 'spring', stiffness: 300, damping: 20 },
    },
    matched: {
      scale: [1, 1.1, 0], // Scale up slightly then fade out
      opacity: [1, 1, 0], // Maintain opacity then fade out
      transition: { 
        duration: 0.8, // Longer duration for glow and fade
        ease: "easeOut",
        opacity: { delay: 0.2 } // Delay opacity fade slightly
      },
    },
    mismatched: {
      x: [0, -10, 10, -10, 10, 0], // More pronounced shake
      transition: { duration: 0.4, ease: "easeInOut" }, // Faster shake
    },
  };

  return (
    <motion.div
      className="relative w-full h-full cursor-pointer"
      onClick={onClick}
      variants={cardVariants}
      animate={isMatched ? 'matched' : isFlipped ? (isMismatched ? 'mismatched' : 'flipped') : 'unflipped'}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Card Back - Simplified glassmorphic design with gradient */}
      <GlassCard className="absolute inset-0 flex items-center justify-center !p-0 rounded-lg bg-gradient-to-t from-[var(--glass-i-bg)] to-[var(--glass-bg-nav)]" variant="card">
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-primary/40"></div>
          </div>
        </div>
      </GlassCard>

      {/* Card Front with gradient */}
      <GlassCard className="absolute inset-0 flex items-center justify-center p-1 rounded-lg bg-gradient-to-t from-[var(--glass-i-bg)] to-[var(--glass-bg-nav)]" variant="card" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
        {card.type === 'image' ? (
          <FilteredImage src={card.content} alt="" className="w-full h-full object-cover rounded-md" filterType="grid" />
        ) : (
          <span className="text-xs sm:text-sm font-bold text-center text-white px-1">{card.content}</span>
        )}
      </GlassCard>
    </motion.div>
  );
};

export default MemoryCard;
