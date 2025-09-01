import React from 'react';
import { useTranslation } from '../context/LanguageContext';

const FundingLogos = () => {
  const { language } = useTranslation();

  return (
    <div className="py-6 bg-gradient-to-t from-bg-main/90 to-transparent backdrop-blur-sm border-t border-border-color/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          <h3 className="text-body text-text-muted mb-4 font-medium">
            {language === 'sl' ? 'S podporo:' : 'Supported by:'}
          </h3>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 transition-all duration-300 hover:bg-white/20 hover:scale-105 flex items-center justify-center">
              <img 
                src="/images/funding/city-ljubljana-logo.png" 
                alt={language === 'sl' ? 'Mestna občina Ljubljana' : 'City of Ljubljana'}
                className="h-12 object-contain"
              />
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 transition-all duration-300 hover:bg-white/20 hover:scale-105 flex items-center justify-center">
              <img 
                src="/images/funding/urs-logo.svg" 
                alt={language === 'sl' ? 'Urad Republike Slovenije za mladino' : 'Office of the Republic of Slovenia for Youth'}
                className="h-12 object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundingLogos;