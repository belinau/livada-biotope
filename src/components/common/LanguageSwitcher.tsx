import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Language } from '../../lib/translations';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'sl' : 'en');
  };

  return (
    <div className="flex items-center space-x-2">
      <button 
        onClick={() => setLanguage('en')} 
        className={`px-2 py-1 text-sm font-medium ${language === 'en' ? 'bg-green-100 text-green-800' : 'text-gray-600 hover:text-green-700'} rounded-md transition-colors`}
      >
        EN
      </button>
      <button 
        onClick={() => setLanguage('sl')} 
        className={`px-2 py-1 text-sm font-medium ${language === 'sl' ? 'bg-green-100 text-green-800' : 'text-gray-600 hover:text-green-700'} rounded-md transition-colors`}
      >
        SL
      </button>
    </div>
  );
};

export default LanguageSwitcher;
