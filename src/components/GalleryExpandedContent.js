import React from "react";
import { motion } from "framer-motion";

const GalleryExpandedContent = ({ gallery, imageIndex, goToPrev, goToNext, currentIndex, totalImages, t, language }) => {
  const currentImage = gallery.images[currentIndex];
  
  // Get caption based on language
  const caption = language === 'sl' 
    ? currentImage.caption_sl 
    : (currentImage.caption_en || currentImage.caption_sl);

  return (
    <div className="w-full max-w-4xl max-h-[90vh] flex flex-col bg-[var(--glass-bg)] border-[var(--glass-border)] border-opacity-50 backdrop-blur-sm sm:rounded-3xl overflow-auto">
      {/* Image container - takes up most of the space */}
      <div className="relative flex-grow bg-[var(--glass-bg)] backdrop-blur-sm">
        <img
          src={currentImage.image}
          alt={caption || gallery.title}
          className="w-full h-full max-h-[70vh] sm:rounded-tr-lg sm:rounded-tl-lg object-contain"
        />
        
        {/* Navigation buttons */}
        <motion.button
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/50 text-white hover:bg-white/20 transition-colors focus:outline-none"
          onClick={(e) => {
            e.stopPropagation();
            goToPrev();
          }}
          aria-label={t('previous')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>

        <motion.button
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/50 text-white hover:bg-white/20 transition-colors focus:outline-none"
          onClick={(e) => {
            e.stopPropagation();
            goToNext();
          }}
          aria-label={t('next')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>

        {/* Close button */}
        <motion.button
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-primary/70 text-white hover:bg-primary transition-colors focus:outline-none"
          aria-label={t('close')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </motion.button>
      </div>

      {/* Content area - smaller, more spacious with solid background */}
      <div className="flex-grow-0 p-6 bg-[var(--bg-main)]">
        <div className="mb-4">
          <motion.h3 className="font-medium text-[var(--text-main)] text-xl mb-2">
            {caption}
          </motion.h3>
          <motion.p className="text-[var(--text-muted)] text-lg mb-4">
            {gallery.title}
          </motion.p>
        </div>
        
        <div className="flex items-center justify-between text-[var(--text-muted)] text-sm">
          <span className="bg-[var(--bg-main)] border border-[var(--border-color)] px-3 py-1 rounded-full">
            {currentIndex + 1} / {totalImages}
          </span>
          {gallery.author && (
            <span className="bg-[var(--bg-main)] border border-[var(--border-color)] px-3 py-1 rounded-full">
              {t('photoBy')}: {gallery.author}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default GalleryExpandedContent;