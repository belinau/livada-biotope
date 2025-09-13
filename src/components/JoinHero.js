import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DisplacementSlider } from './ui/displacement-slider';
import { getOptimizedImageUrl } from '../shared/image-utils';
import { fetchRecentImages } from '../shared/image-utils';
import { useNavigate } from 'react-router-dom';

const JoinHero = ({ language = 'sl' }) => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentActionIndex, setCurrentActionIndex] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        // Fetch the 30 most recent images from the uploads directory
        const recentImages = await fetchRecentImages(30);
        setImages(recentImages);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load images:', error);
        setImages([]);
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Rotate through actions - always show one action
  useEffect(() => {
    const actionInterval = setInterval(() => {
      // Rotate to next action (always show one)
      setCurrentActionIndex(prev => (prev + 1) % 3);
    }, 10000); // Change every 6 seconds for more elegant timing

    return () => clearInterval(actionInterval);
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-text-muted">
            {language === 'sl' ? 'Nalagam slike...' : 'Loading images...'}
          </p>
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-text-muted">
          {language === 'sl' ? 'Ni najdenih slik' : 'No images found'}
        </p>
      </div>
    );
  }

  // Prepare images array with optimized URLs
  const sliderImages = images.map(imagePath => getOptimizedImageUrl(imagePath));

  const joinActions = [
    {
      title: language === 'sl' ? 'Pridi na monitoring' : 'Join our monitoring',
      description: language === 'sl' 
        ? 'Pomagaj zbirati podatke o biotski raznovrstnosti v skupini ali samostojno.' 
        : 'Help collect biodiversity data in a group or independently.',
      link: '/biodiverziteta'
    },
    {
      title: language === 'sl' ? 'Pridi na srečanje' : 'Come to our gatherings',
      description: language === 'sl'
        ? 'V Biotopu Livada redno izvajamo DITO srečanja o permakulturi, z zemljo povezanih praksah, izdelavi predmetov iz lesa in recikliranih materialov, občasno pa potekajo tudi delavnice o ekofeminističnih praksah, medvrstnem sodelovanju in rešitvah za telemetrijo in okoljske meritve.'
        : "You can inform your friends about the importance of preserving this urban fen meadow, but we'd rather see you bring them along to our next gathering.",
      link: '/koledar'
    },
    {
      title: language === 'sl' ? 'Širjenje informacij' : 'Spread the word',
      description: language === 'sl'
        ? 'S pomenom ohranjanja tega urbanega barjanskega travnika lahko seznaniš tudi prijatelje, še raje pa vidimo, če jih kar pripelješ s sabo na naslednje srečanje.'
        : "You can inform your friends about the importance of preserving this urban fen meadow, but we'd rather see you bring them along to our next gathering.",
      link: '/koledar'
    }
  ];

  const currentAction = joinActions[currentActionIndex];
  const heroTitle = language === 'sl' ? 'Pridruži se nam' : 'Join us';
  const heroSubtitle = language === 'sl' 
    ? 'Postani del skupnosti, ki skrbi za ohranjanje in raziskovanje Biotopa Livada.' 
    : 'Become part of the community caring for and researching Livada Biotope.';

  return (
    <div className="w-full">
      {/* Custom Hero Section with integrated CTA buttons and slider */}
      <div className="relative min-h-[75vh] flex items-center justify-center overflow-hidden py-8">
        {/* Constrain width to match other components on HomePage */}
        <div className="container mx-auto px-4 w-full max-w-6xl">
          {/* Glassmorphic hero card - now with same width as other components */}
          <div className="relative z-10 text-center mx-auto p-5 md:p-6 bg-gradient-to-l from-[var(--glass-i-bg)] to-[var(--glass-bg-nav)] backdrop-blur-sm border border-[var(--glass-border)] rounded-3xl w-full max-w-6xl">
            <h1 className="heading-organic text-3xl md:text-4xl bg-gradient-to-r from-[var(--primary)] to-[var(--text-orange)] bg-clip-text text-transparent mb-3">
              {heroTitle}
            </h1>
            
            <p className="text-base md:text-lg text-text-muted mb-5">
              {heroSubtitle}
            </p>
            
            {/* Image Slider */}
            <div className="mt-5 rounded-2xl overflow-hidden aspect-video">
              <DisplacementSlider 
                images={sliderImages}
                autoPlay={true}
                autoPlayInterval={8000}
                className="w-full h-full"
              />
            </div>
            
            {/* Rotating Action Buttons placed below the slider */}
            <div className="mt-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentActionIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  className="max-w-2xl mx-auto"
                >
                  <div className="bg-gradient-to-l from-[var(--glass-i-bg)] to-[var(--glass-bg-nav)] backdrop-blur-sm border border-[var(--glass-border)] rounded-2xl p-4 text-center">
                    <h3 className="heading-organic text-lg text-primary mb-2">{currentAction.title}</h3>
                    <p className="text-text-muted mb-4 text-sm">{currentAction.description}</p>
                    <button
                      className="px-4 py-2 backdrop-blur-sm border border-[var(--glass-border)] bg-gradient-to-l from-[var(--glass-i-bg)] to-[var(--glass-bg-nav)] text-[var(--primary)] mx-auto text-center rounded-full relative hover:bg-primary/30 transition-all duration-300 transform hover:scale-105 text-sm"
                      onClick={() => navigate(currentAction.link)}
                    >
                      <span className="font-medium">
                        {language === 'sl' ? 'Več o tem' : 'Learn more'} →
                      </span>
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            
            <div className="flex justify-center mt-5">
              <div className="w-16 h-1 bg-gradient-to-l from-primary to-primary-light rounded-full"></div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default JoinHero;
