import React from 'react';
import { motion } from 'framer-motion';
import { CometCard } from './ui/comet-card';
import { getGlassClasses } from './glass-theme';

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
      {/* Card Back */}
      <div
        className={`absolute inset-0 ${getGlassClasses({ rounded: 'lg' })}`}
        style={{ backfaceVisibility: 'hidden' }}
      >
        <CometCard />
      </div>

      {/* Card Front */}
      <div
        className={`absolute inset-0 ${getGlassClasses({ rounded: 'lg' })} flex items-center justify-center p-2`}
        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
      >
        {card.type === 'image' ? (
          <img src={card.content} alt="" className="w-full h-full object-cover rounded-md" />
        ) : (
          <span className="text-lg font-bold text-center text-white">{card.content}</span>
        )}
      </div>
    </motion.div>
  );
};

export default MemoryCard;