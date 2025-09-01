import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ImagesSlider } from './ui/images-slider';
import { getOptimizedImageUrl } from '../App';
import { fetchRecentImages } from '../shared/image-utils';

const JoinHero = ({ language = 'sl' }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        // Fetch the 30 most recent images from the uploads directory
        const recentImages = await fetchRecentImages(30);
        setImages(recentImages);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load images:", error);
        setImages([]);
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-r from-primary/20 to-primary-light/20 rounded-2xl flex items-center justify-center">
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
      <div className="h-screen bg-gradient-to-r from-primary/20 to-primary-light/20 rounded-2xl flex items-center justify-center">
        <p className="text-text-muted">
          {language === 'sl' ? 'Ni najdenih slik' : 'No images found'}
        </p>
      </div>
    );
  }

  // Prepare images array for slider with optimized URLs
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
        ? 'V Biotopu Livada redno izvajamo DITO srečanja o permakulturi, z zemljo povezanih praksah, izdelavi predmetov iz lesa in recikliranih materialov, občasno pa potekajo tudi delavnice o ekofeminističnih praksah, medvrstnem sodelovanju in razvoju rešitev za telemetrijo.'
        : 'At Livada Biotope we regularly hold DITO gatherings on permaculture, land-connected practices, crafting objects from wood and recycled materials, and occasionally workshops on ecofeminist practices, interspecies collaboration and telemetry solutions development.',
      link: '/koledar'
    },
    {
      title: language === 'sl' ? 'Širjenje informacij' : 'Spread the word',
      description: language === 'sl'
        ? 'S pomenom ohranjanja tega urbanega barjanskega travnika lahko seznaniš tudi prijatelje, še raje pa vidimo, če jih kar pripelješ s sabo na naslednje srečanje.'
        : 'You can inform your friends about the importance of preserving this urban fen meadow, but we\'d rather see you bring them along to our next gathering.',
      link: '/koledar'
    }
  ];

  return (
    <ImagesSlider 
      className="h-screen rounded-2xl overflow-hidden shadow-xl"
      images={sliderImages}
      showArrows={true}
      showIndicators={true}
      autoPlay={true}
      autoPlayInterval={5000}
      imageFit="cover"
    >
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
        className="z-50 flex flex-col justify-center items-center text-center px-4 w-full h-full"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent rounded-2xl"></div>
        
        <motion.h1
          className="font-bold text-4xl md:text-5xl text-center text-white py-4 relative z-10 max-w-4xl"
        >
          {language === 'sl' ? 'Pridruži se nam' : 'Join us'}
        </motion.h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 relative z-10 max-w-6xl w-full px-4">
          {joinActions.map((action, index) => (
            <div 
              key={index}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-left transition-all duration-300 hover:bg-white/20 hover:scale-105"
            >
              <h3 className="text-xl font-bold text-white mb-3">{action.title}</h3>
              <p className="text-white/90 mb-4">{action.description}</p>
              <button
                className="px-4 py-2 backdrop-blur-sm border bg-primary/20 border-primary/30 text-white text-center rounded-full relative hover:bg-primary/30 transition-all duration-300"
                onClick={() => window.location.hash = action.link}
              >
                <span className="text-sm font-medium">
                  {language === 'sl' ? 'Več o tem' : 'Learn more'} →
                </span>
                <div className="absolute inset-x-0 h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-primary to-transparent" />
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </ImagesSlider>
  );
};

export default JoinHero;