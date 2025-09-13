"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FilteredImage from './FilteredImage';

export const ImagesSlider = ({ 
  images, 
  children, 
  className = "",
  autoPlay = true,
  autoPlayInterval = 8000,
  showIndicators = true,
  showArrows = true,
  imageFit = "cover",
  onSlideChange
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState({});

  useEffect(() => {
    if (onSlideChange) {
      onSlideChange(currentIndex);
    }
  }, [currentIndex, onSlideChange]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  }, [images.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay) return;
    
    const interval = setInterval(() => {
      goToNext();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, goToNext]);

  // Genuine ripple transition with wave-like motion
  const rippleVariants = {
    hidden: {
      opacity: 0,
      clipPath: "circle(0% at 50% 50%)",
    },
    visible: {
      opacity: 1,
      clipPath: "circle(150% at 50% 50%)",
      transition: {
        duration: 2.5,
        ease: [0.34, 1.56, 0.64, 1],
      },
    },
    exit: {
      opacity: 0,
      scale: 1.1,
      transition: {
        duration: 2.0,
        ease: [0.34, 1.56, 0.64, 1],
      },
    },
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  const dragEndHandler = (dragInfo) => {
    const { offset, velocity } = dragInfo;
    const swipe = swipePower(offset.x, velocity.x);

    if (swipe < -swipeConfidenceThreshold) {
      goToNext();
    } else if (swipe > swipeConfidenceThreshold) {
      goToPrev();
    }
  };

  const handleImageLoad = (index) => {
    setImageLoaded(prev => ({ ...prev, [index]: true }));
  };

  const handleImageError = (index) => {
    console.warn(`Failed to load image at index ${index}: ${images[index]}`);
    // Mark as loaded even on error to prevent infinite loading state
    setImageLoaded(prev => ({ ...prev, [index]: true }));
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            variants={rippleVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={(event, dragInfo) => dragEndHandler(dragInfo)}
            className="absolute inset-0 w-full h-full"
          >
            {!imageLoaded[currentIndex] && (
              <div className="absolute inset-0 bg-transparent flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            )}
            <div className="relative w-full h-full overflow-hidden">
              <FilteredImage
                src={images[currentIndex]}
                alt={`Slide ${currentIndex + 1}`}
                className={`w-full h-full object-${imageFit} ${imageLoaded[currentIndex] ? 'block' : 'hidden'}`}
                onLoad={() => handleImageLoad(currentIndex)}
                onError={() => handleImageError(currentIndex)}
              />
              {/* Genuine ripple effect overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <div 
                  className="absolute inset-0 opacity-20"
                  style={{
                    background: `radial-gradient(circle, 
                      rgba(135, 169, 107, 0.3) 0%, 
                      transparent 70%)`,
                    animation: "genuineRipple 3s ease-out infinite",
                  }}
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        
        {children && (
          <div className="absolute inset-0 flex items-center justify-center">
            {children}
          </div>
        )}
      </div>

      {/* Navigation arrows with glassmorphic styling */}
      {showArrows && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-[var(--glass-bg)] backdrop-blur-sm border border-[var(--glass-border)] text-white hover:bg-[var(--glass-bg)]/80 transition-all duration-300 focus:outline-none shadow-lg"
            aria-label="Previous slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-[var(--glass-bg)] backdrop-blur-sm border border-[var(--glass-border)] text-white hover:bg-[var(--glass-bg)]/80 transition-all duration-300 focus:outline-none shadow-lg"
            aria-label="Next slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Indicators with glassmorphic styling */}
      {showIndicators && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? "bg-[var(--glass-icon-bg)] shadow-lg scale-125" 
                  : "bg-[var(--glass-border)] hover:bg-[var(--glass-icon-bg)]/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
      
      {/* Genuine ripple animation keyframes */}
      <style>{`
        @keyframes genuineRipple {
          0% {
            transform: scale(0);
            opacity: 0.3;
          }
          50% {
            transform: scale(2);
            opacity: 0.1;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};