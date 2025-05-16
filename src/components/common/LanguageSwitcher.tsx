import React from 'react';
import { Button, ButtonGroup } from '@mui/material';
import { useLanguage } from '../../contexts/LanguageContext';

interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <ButtonGroup size="small" className={className}>
      <Button
        variant={language === 'en' ? 'contained' : 'outlined'}
        onClick={() => setLanguage('en')}
        color="primary"
      >
        EN
      </Button>
      <Button
        variant={language === 'sl' ? 'contained' : 'outlined'}
        onClick={() => setLanguage('sl')}
        color="primary"
      >
        SL
      </Button>
    </ButtonGroup>
  );
};

export default LanguageSwitcher;
