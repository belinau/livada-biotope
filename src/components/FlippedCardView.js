import React from 'react';
import { motion } from 'framer-motion';
import MemoryCard from './MemoryCard';
import Portal from './Portal';

const FlippedCardView = ({ flippedCards, isMismatched }) => {
  return (
    <Portal>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="flex gap-8 pointer-events-auto">
          {flippedCards.map((card, index) => (
            <motion.div key={card.id} layoutId={card.id} className="w-64 h-64">
              <MemoryCard card={card} isFlipped={true} isMatched={false} isMismatched={isMismatched} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Portal>
  );
};

export default FlippedCardView;