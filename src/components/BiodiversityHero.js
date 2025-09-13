import React from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from './Hero';

const BiodiversityHero = ({ language = 'sl', heroTitle, heroSubtitle }) => {
  const navigate = useNavigate();

  return (
    <Hero 
      title={heroTitle || (language === 'sl' ? 'Spremljanje biotske raznovrstnosti' : 'Biodiversity Monitoring')}
      subtitle={heroSubtitle || (language === 'sl' 
        ? 'Sodeluj pri zbiranju podatkov o rastlinah in živalih v Biotopu Livada.' 
        : 'Participate in collecting data about the plant and animal life in Livada Biotope.')}
      language={language}
    >
      <div className="pb-12 flex flex-col sm:flex-row gap-4 justify-center">
        <button
          className="px-8 py-4 backdrop-blur-sm border border-[var(--glass-border)] bg-[var(--glass-bg)] text-white text-center rounded-full relative hover:bg-primary/30 transition-all duration-300 transform hover:scale-105 min-w-[200px]"
          onClick={() => navigate(language === 'sl' ? '/utelesenja/monitoring' : '/utelesenja/monitoring')}
        >
          <span className="text-lg font-medium">
            {language === 'sl' ? 'Pridi na monitoring' : 'Join the Monitoring'} →
          </span>
        </button>
        <button
          className="px-8 py-4 backdrop-blur-sm border border-[var(--glass-border)] bg-[var(--glass-bg)] text-white text-center rounded-full relative hover:bg-primary/30 transition-all duration-300 transform hover:scale-105 min-w-[200px]"
          onClick={() => navigate('/spomin')}
        >
          <span className="text-lg font-medium">
            {language === 'sl' ? 'Biodiverzitetni spomin' : 'Biodiversity Memory'} →
          </span>
        </button>
      </div>
    </Hero>
  );
};

export default BiodiversityHero;
