import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from './ui/GlassCard';
import FilteredImage from './ui/FilteredImage';

const FlippedCardView = ({ flippedCards, isMismatched, isMatched }) => {
  // Don't render anything if no cards are flipped
  if (flippedCards.length === 0) return null;

  // Create a simplified version of the MemoryCard component for the matching section
  const MatchingCard = ({ card, isMismatched, isMatched }) => {
    const cardVariants = {
      default: {
        scale: 1,
        zIndex: 1,
      },
      mismatched: {
        x: [0, -10, 10, -10, 10, 0], // Shake animation
        transition: { duration: 0.4, ease: "easeInOut" },
      },
      matched: {
        scale: [1, 1.1, 1],
        transition: { 
          duration: 0.6,
          times: [0, 0.5, 1]
        }
      }
    };

    // Glitter effect for matched cards
    const [glitterParticles, setGlitterParticles] = useState([]);

    useEffect(() => {
      if (isMatched) {
        // Create glitter particles
        const particles = Array.from({ length: 20 }, (_, i) => ({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 2,
          delay: Math.random() * 0.5,
        }));
        setGlitterParticles(particles);
      }
    }, [isMatched]);

    return (
      <motion.div
        className="relative w-full h-full"
        variants={cardVariants}
        animate={isMismatched ? 'mismatched' : (isMatched ? 'matched' : 'default')}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Card Front */}
        <GlassCard className="absolute inset-0 flex items-center justify-center p-2 rounded-lg overflow-hidden" variant="card" style={{ backfaceVisibility: 'hidden' }}>
          {card.type === 'image' ? (
            <FilteredImage src={card.content} alt="" className="w-full h-full object-cover rounded-md" filterType="matching" />
          ) : (
            <span className="text-xl md:text-2xl font-bold text-center text-white z-10 px-2">{card.content}</span>
          )}
          
          {/* Glitter effect for matched cards */}
          {isMatched && glitterParticles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full bg-yellow-300"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: [0, (Math.random() - 0.5) * 100],
                y: [0, (Math.random() - 0.5) * 100],
              }}
              transition={{
                duration: 1,
                delay: particle.delay,
              }}
            />
          ))}
        </GlassCard>
      </motion.div>
    );
  };

  return (
    <motion.div
      className="flex items-center justify-center gap-8 md:gap-12 lg:gap-20 w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {flippedCards.map((card, index) => (
        <div 
          key={`${card.id}-match`} 
          className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-64 lg:h-64 xl:w-72 xl:h-72"
        >
          <MatchingCard 
            card={card} 
            isMismatched={isMismatched} 
            isMatched={isMatched}
          />
        </div>
      ))}
    </motion.div>
  );
};

export default FlippedCardView;