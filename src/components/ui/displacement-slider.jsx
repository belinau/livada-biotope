import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FilteredImage from './FilteredImage';

export const DisplacementSlider = ({ 
  images, 
  className = "",
  autoPlay = true,
  autoPlayInterval = 6000,
  filterType = "glass"
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || images.length < 2) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, autoPlayInterval);
    
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, images.length]);

  if (images.length === 0) return null;
  
  if (images.length === 1) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <div className="w-full h-full flex items-center justify-center">
          <FilteredImage 
            {...(typeof images[0] === 'string' ? { src: images[0] } : images[0])}
            alt="Slide" 
            className="max-w-full max-h-full object-contain"
            filterType={filterType}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="w-full h-full flex items-center justify-center">
        <AnimatePresence mode="crossfade">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 4,
              ease: "easeInOut"
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <FilteredImage 
              {...(typeof images[currentIndex] === 'string' ? { src: images[currentIndex] } : images[currentIndex])}
              alt={`Slide ${currentIndex + 1}`} 
              className="max-w-full max-h-full object-contain"
              filterType={filterType}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};