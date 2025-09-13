import React from 'react';
import { useTranslation } from '../context/LanguageContext';
import { getTextClasses } from './typography-utils';
import { getGlassVariant } from './glass-theme';
import FilteredImage from './ui/FilteredImage';

const FundingLogos = () => {
  const { language } = useTranslation();

  return (
    <div className="container mx-auto px-4 pt-12 pb-6 text-[var(--text-muted)]">
      <div className="flex flex-col items-center">
        <div className="p-2 rounded-lg mb-4 bg-gradient-to-b from-[var(--glass-i-bg)] to-[var(--glass-bg-nav)] backdrop-blur-sm">
          <h3 className={getTextClasses({ fontFamily: 'body', color: 'text-muted', weight: 'medium' })}>
            {language === 'sl' ? 'S podporo:' : 'Supported by:'}
          </h3>
        </div>
        <div className={`bg-gradient-to-r from-[var(--glass-i-bg)] to-[var(--glass-bg-nav)] backdrop-blur-sm shadow-xl rounded-2xl p-6 transition-all duration-300 hover:bg-white/20 hover:scale-105 inline-flex items-center gap-6`}>
          <FilteredImage 
            src="/images/funding/MOL-grb.svg" 
            alt={language === 'sl' ? 'Mestna občina Ljubljana' : 'City of Ljubljana'}
            className="h-20 object-contain flex-shrink-0"
            filterType="grid"
          />
          <div className="font-serif text-left">
            <div className="text-lg font-medium text-muted whitespace-nowrap">
              {language === 'sl' ? 'Mestna občina Ljubljana' : 'City of Ljubljana'}
            </div>
            <div className="text-sm text-var(--text-muted)">
              {language === 'sl' ? <>Oddelek za varstvo okolja<br />Urad za mladino</> : <>Department for Environmental Protection<br />Office for Youth</>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundingLogos;