import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BiodiversityHero = ({ language = 'sl', heroTitle, heroSubtitle }) => {
  const [observations, setObservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const projectSlug = "the-livada-biotope-monitoring";

  const goToNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % observations.length);
  }, [observations.length]);

  const goToPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + observations.length) % observations.length);
  }, [observations.length]);

  useEffect(() => {
    const fetchObservations = async () => {
      try {
        const response = await fetch(
          `https://api.inaturalist.org/v1/observations?project_id=${projectSlug}&per_page=10&page=1&order_by=observed_on&order=desc&locale=${language}`
        );
        
        if (!response.ok) throw new Error('Failed to fetch observations');
        
        const data = await response.json();
        setObservations(data.results.filter(obs => obs.photos && obs.photos.length > 0));
        setLoading(false);
      } catch (error) {
        console.error("iNaturalist fetch error:", error);
        setObservations([]);
        setLoading(false);
      }
    };

    fetchObservations();
  }, [projectSlug, language]);

  // Auto-play functionality
  useEffect(() => {
    if (loading || observations.length === 0) return;
    
    const interval = setInterval(() => {
      goToNext();
    }, 7000); // autoPlayInterval

    return () => clearInterval(interval);
  }, [loading, observations.length, goToNext]);

  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-r from-primary/20 to-primary-light/20 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-text-muted">Nalagam opazovanja...</p>
        </div>
      </div>
    );
  }

  if (observations.length === 0) {
    return (
      <div className="h-screen bg-gradient-to-r from-primary/20 to-primary-light/20 rounded-2xl flex items-center justify-center">
        <p className="text-text-muted">Ni najdenih opazovanj</p>
      </div>
    );
  }

  const currentImage = observations[currentIndex].photos[0].url.replace('square', 'large');

  const slideVariants = {
    hiddenRight: {
      x: "100%",
      opacity: 0,
    },
    hiddenLeft: {
      x: "-100%",
      opacity: 0,
    },
    visible: {
      x: "0",
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <div className="relative overflow-hidden h-screen">
      <div className="w-full h-full">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial={direction > 0 ? "hiddenRight" : "hiddenLeft"}
            animate="visible"
            exit={direction > 0 ? "exit" : "exit"}
            className="absolute inset-0 w-full h-full"
          >
            {/* Blurred background image */}
            <div 
              className="absolute inset-0 bg-cover bg-center filter blur-lg scale-110" 
              style={{ backgroundImage: `url(${currentImage})` }} 
            />

            <img
              src={currentImage}
              alt={`Slide ${currentIndex + 1}`}
              className="absolute inset-0 w-full h-full object-contain"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800/30 to-gray-900/30" />
          </motion.div>
        </AnimatePresence>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{
              opacity: 0,
              y: -80,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            className="z-50 flex flex-col justify-center items-center text-center px-4"
          >
            <motion.h1
              className="font-bold text-4xl md:text-6xl text-center bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-300 py-4 backdrop-blur-sm bg-white/10 rounded-lg p-2"
            >
              {heroTitle || (language === 'sl' ? 'livada.bio' : 'livada.bio')}
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl text-white/90 max-w-3xl mt-4 backdrop-blur-sm bg-white/10 rounded-lg p-2"
            >
              {heroSubtitle || (language === 'sl' 
                ? 'Gojenje sorodstev v več kot človeškem svetu' 
                : 'Fostering kinship in a more than human world')}
            </motion.p>
            <div className="flex flex-col sm:flex-row gap-4 mt-12">
              <button
                className="px-8 py-4 backdrop-blur-sm border bg-primary/20 border-primary/30 text-white mx-auto text-center rounded-full relative hover:bg-primary/30 transition-all duration-300 transform hover:scale-105"
                onClick={() => window.location.hash = '/biodiverziteta'}
              >
                <span className="text-lg font-medium">
                  {language === 'sl' ? 'Razišči biodiverziteto' : 'Explore Biodiversity'} →
                </span>
                <div className="absolute inset-x-0 h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-primary to-transparent" />
              </button>
              <button
                className="px-8 py-4 backdrop-blur-sm border bg-secondary/20 border-secondary/30 text-white mx-auto text-center rounded-full relative hover:bg-secondary/30 transition-all duration-300 transform hover:scale-105"
                onClick={() => window.location.hash = '/spomin'}
              >
                <span className="text-lg font-medium">
                  {language === 'sl' ? 'Biodiverzitetni spomin' : 'Biodiversity Memory'} →
                </span>
                <div className="absolute inset-x-0 h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-secondary to-transparent" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Navigation arrows */}
        <div className="absolute inset-0 flex items-center justify-between px-4"> 
          <button
            onClick={goToPrev}
            className="p-3 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors focus:outline-none"
            aria-label="Previous slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="p-3 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors focus:outline-none"
            aria-label="Next slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {observations.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${ index === currentIndex ? "bg-white" : "bg-white/50"}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BiodiversityHero;
